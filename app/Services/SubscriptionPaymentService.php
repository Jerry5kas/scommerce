<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Subscription;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Log;

class SubscriptionPaymentService
{
    private const MAX_RETRY_ATTEMPTS = 3;

    /**
     * @var array<int, int>
     */
    private const RETRY_WINDOWS_HOURS = [6, 12, 24];

    public function __construct(
        private PaymentService $paymentService,
        private WalletService $walletService
    ) {}

    /**
     * @return array{success: bool, status: string, message: string}
     */
    public function attemptChargeForOrder(Order $order): array
    {
        if ($order->type !== Order::TYPE_SUBSCRIPTION) {
            return [
                'success' => false,
                'status' => 'skipped',
                'message' => 'Order is not a subscription order.',
            ];
        }

        if ($order->payment_status === Order::PAYMENT_PAID) {
            return [
                'success' => true,
                'status' => 'already_paid',
                'message' => 'Order payment is already complete.',
            ];
        }

        $attemptNumber = ((int) $order->payment_attempts) + 1;
        $amount = (float) $order->total;
        $user = $order->user;
        $wallet = $this->walletService->getOrCreateWallet($user);

        if ($wallet->hasSufficientBalance($amount)) {
            $paymentResult = $this->paymentService->processWalletPayment($user, $order, $amount);

            if ($paymentResult['success']) {
                $order->update([
                    'payment_status' => Order::PAYMENT_PAID,
                    'payment_method' => Payment::METHOD_WALLET,
                    'status' => Order::STATUS_CONFIRMED,
                    'payment_attempts' => $attemptNumber,
                    'next_payment_retry_at' => null,
                    'payment_failed_at' => null,
                ]);

                return [
                    'success' => true,
                    'status' => 'paid',
                    'message' => 'Wallet charge completed.',
                ];
            }

            return $this->handleFailedAttempt($order, $attemptNumber, $paymentResult['error'] ?? 'Wallet payment failed.');
        }

        return $this->handleFailedAttempt($order, $attemptNumber, 'Insufficient wallet balance.');
    }

    /**
     * @return array{processed: int, paid: int, retry_scheduled: int, paused: int, errors: array<int, string>}
     */
    public function processDuePayments(CarbonInterface $asOf, bool $retryOnly = false): array
    {
        $ordersQuery = Order::query()
            ->where('type', Order::TYPE_SUBSCRIPTION)
            ->with(['user', 'subscription'])
            ->orderBy('id');

        if ($retryOnly) {
            $ordersQuery->where('payment_status', Order::PAYMENT_FAILED)
                ->where('payment_attempts', '<', self::MAX_RETRY_ATTEMPTS)
                ->whereNotNull('next_payment_retry_at')
                ->where('next_payment_retry_at', '<=', $asOf);
        } else {
            $ordersQuery->where(function ($query) use ($asOf) {
                $query->where(function ($pendingQuery) use ($asOf) {
                    $pendingQuery->where('payment_status', Order::PAYMENT_PENDING)
                        ->whereDate('scheduled_delivery_date', '<=', $asOf->toDateString());
                })->orWhere(function ($retryQuery) use ($asOf) {
                    $retryQuery->where('payment_status', Order::PAYMENT_FAILED)
                        ->where('payment_attempts', '<', self::MAX_RETRY_ATTEMPTS)
                        ->whereNotNull('next_payment_retry_at')
                        ->where('next_payment_retry_at', '<=', $asOf);
                });
            });
        }

        $orders = $ordersQuery->get();

        $result = [
            'processed' => 0,
            'paid' => 0,
            'retry_scheduled' => 0,
            'paused' => 0,
            'errors' => [],
        ];

        foreach ($orders as $order) {
            $result['processed']++;

            try {
                $attemptResult = $this->attemptChargeForOrder($order);

                if ($attemptResult['status'] === 'paid' || $attemptResult['status'] === 'already_paid') {
                    $result['paid']++;

                    continue;
                }

                if ($attemptResult['status'] === 'paused') {
                    $result['paused']++;

                    continue;
                }

                if ($attemptResult['status'] === 'retry_scheduled') {
                    $result['retry_scheduled']++;

                    continue;
                }
            } catch (\Throwable $exception) {
                Log::error('Subscription payment processing failed', [
                    'order_id' => $order->id,
                    'error' => $exception->getMessage(),
                ]);

                $result['errors'][] = "Order #{$order->id}: {$exception->getMessage()}";
            }
        }

        return $result;
    }

    /**
     * @return array{success: bool, status: string, message: string}
     */
    private function handleFailedAttempt(Order $order, int $attemptNumber, string $reason): array
    {
        Payment::query()->create([
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'amount' => (float) $order->total,
            'currency' => $order->currency,
            'method' => Payment::METHOD_WALLET,
            'status' => Payment::STATUS_FAILED,
            'failure_reason' => $reason,
        ]);

        $hasRetriesRemaining = $attemptNumber < self::MAX_RETRY_ATTEMPTS;

        $order->update([
            'payment_status' => Order::PAYMENT_FAILED,
            'payment_method' => Payment::METHOD_WALLET,
            'payment_attempts' => $attemptNumber,
            'payment_failed_at' => now(),
            'next_payment_retry_at' => $hasRetriesRemaining
                ? $this->nextRetryAt($attemptNumber)
                : null,
        ]);

        if (! $hasRetriesRemaining) {
            $this->pauseSubscriptionForPaymentFailures($order, $reason);

            return [
                'success' => false,
                'status' => 'paused',
                'message' => 'Subscription paused after maximum payment retries.',
            ];
        }

        return [
            'success' => false,
            'status' => 'retry_scheduled',
            'message' => 'Payment failed. Retry has been scheduled.',
        ];
    }

    private function nextRetryAt(int $attemptNumber): CarbonInterface
    {
        $offsetIndex = min($attemptNumber - 1, count(self::RETRY_WINDOWS_HOURS) - 1);

        return now()->addHours(self::RETRY_WINDOWS_HOURS[$offsetIndex]);
    }

    private function pauseSubscriptionForPaymentFailures(Order $order, string $reason): void
    {
        $subscription = $order->subscription;

        if (! $subscription || $subscription->status !== Subscription::STATUS_ACTIVE) {
            return;
        }

        $existingNotes = trim((string) $subscription->notes);
        $failureNote = 'Paused automatically due to repeated payment failures: '.$reason;

        $subscription->update([
            'status' => Subscription::STATUS_PAUSED,
            'paused_until' => null,
            'notes' => $existingNotes === '' ? $failureNote : $existingNotes."\n".$failureNote,
        ]);
    }
}
