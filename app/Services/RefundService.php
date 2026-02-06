<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RefundService
{
    public function __construct(
        private WalletService $walletService
    ) {}

    /**
     * Process refund for order
     *
     * @return array{success: bool, refunded_amount?: float, method?: string, error?: string}
     */
    public function processRefund(Order $order, ?float $amount = null, ?string $reason = null): array
    {
        $refundAmount = $amount ?? (float) $order->total;

        if ($refundAmount <= 0) {
            return ['success' => false, 'error' => 'Refund amount must be greater than zero.'];
        }

        // Get total paid amount
        $paidAmount = $order->payments()
            ->where('status', Payment::STATUS_COMPLETED)
            ->sum('amount');

        // Get already refunded amount
        $alreadyRefunded = $order->payments()
            ->whereIn('status', [Payment::STATUS_REFUNDED, Payment::STATUS_PARTIALLY_REFUNDED])
            ->sum('refunded_amount');

        $maxRefundable = $paidAmount - $alreadyRefunded;

        if ($refundAmount > $maxRefundable) {
            return ['success' => false, 'error' => "Maximum refundable amount is ₹{$maxRefundable}."];
        }

        try {
            return DB::transaction(function () use ($order, $refundAmount, $reason) {
                $remainingRefund = $refundAmount;
                $refundMethods = [];

                // Get completed payments to refund
                $payments = $order->payments()
                    ->where('status', Payment::STATUS_COMPLETED)
                    ->orderByDesc('method') // Refund wallet first, then gateway
                    ->get();

                foreach ($payments as $payment) {
                    if ($remainingRefund <= 0) {
                        break;
                    }

                    $refundable = $payment->getRemainingRefundableAmount();
                    $toRefund = min($remainingRefund, $refundable);

                    if ($toRefund <= 0) {
                        continue;
                    }

                    if ($payment->method === Payment::METHOD_WALLET) {
                        // Refund back to wallet
                        $this->refundToWallet($order, $toRefund, $reason);
                        $payment->processRefund($toRefund);
                        $refundMethods[] = 'wallet';
                    } elseif ($payment->method === Payment::METHOD_COD) {
                        // COD refunds go to wallet
                        $this->refundToWallet($order, $toRefund, $reason);
                        $payment->processRefund($toRefund);
                        $refundMethods[] = 'wallet';
                    } else {
                        // Gateway refund - first try gateway, fallback to wallet
                        $gatewayResult = $this->refundToGateway($payment, $toRefund);
                        if ($gatewayResult['success']) {
                            $refundMethods[] = 'gateway';
                        } else {
                            // Fallback to wallet
                            $this->refundToWallet($order, $toRefund, $reason);
                            $payment->processRefund($toRefund);
                            $refundMethods[] = 'wallet';
                        }
                    }

                    $remainingRefund -= $toRefund;
                }

                // Update order
                $totalRefunded = $refundAmount - $remainingRefund;
                if ($totalRefunded >= (float) $order->total) {
                    $order->update([
                        'status' => Order::STATUS_REFUNDED,
                        'payment_status' => Order::PAYMENT_REFUNDED,
                    ]);
                }

                Log::info('Refund processed', [
                    'order_id' => $order->id,
                    'amount' => $totalRefunded,
                    'reason' => $reason,
                    'methods' => $refundMethods,
                ]);

                return [
                    'success' => true,
                    'refunded_amount' => $totalRefunded,
                    'method' => implode(', ', array_unique($refundMethods)),
                ];
            });
        } catch (\Exception $e) {
            Log::error('Refund failed', [
                'order_id' => $order->id,
                'amount' => $refundAmount,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Refund processing failed. Please try again.'];
        }
    }

    /**
     * Refund to user's wallet
     */
    public function refundToWallet(Order $order, float $amount, ?string $reason = null): bool
    {
        $user = $order->user;
        $wallet = $this->walletService->getOrCreateWallet($user);

        $description = $reason
            ? "Refund for Order #{$order->order_number}: {$reason}"
            : "Refund for Order #{$order->order_number}";

        $result = $this->walletService->addRefund($wallet, $order, $amount, $description);

        return $result['success'];
    }

    /**
     * Refund via payment gateway
     *
     * @return array{success: bool, refund_id?: string, error?: string}
     */
    public function refundToGateway(Payment $payment, float $amount): array
    {
        if (! $payment->payment_id) {
            return ['success' => false, 'error' => 'No gateway payment ID found.'];
        }

        // TODO: Implement actual gateway refund
        // For Razorpay: Use refund API
        // For Stripe: Use refund API

        if (config('services.payment.mock', true)) {
            // Mock refund
            $payment->processRefund($amount);

            return [
                'success' => true,
                'refund_id' => 'mock_refund_'.uniqid(),
            ];
        }

        return match ($payment->gateway) {
            'razorpay' => $this->processRazorpayRefund($payment, $amount),
            'stripe' => $this->processStripeRefund($payment, $amount),
            default => ['success' => false, 'error' => 'Unsupported gateway.'],
        };
    }

    /**
     * Process Razorpay refund
     *
     * @return array{success: bool, refund_id?: string, error?: string}
     */
    protected function processRazorpayRefund(Payment $payment, float $amount): array
    {
        // TODO: Implement Razorpay refund
        // $api = new \Razorpay\Api\Api($key, $secret);
        // $refund = $api->payment->fetch($payment->payment_id)->refund(['amount' => $amount * 100]);

        return ['success' => false, 'error' => 'Razorpay refund not implemented.'];
    }

    /**
     * Process Stripe refund
     *
     * @return array{success: bool, refund_id?: string, error?: string}
     */
    protected function processStripeRefund(Payment $payment, float $amount): array
    {
        // TODO: Implement Stripe refund
        // \Stripe\Refund::create(['payment_intent' => $payment->payment_id, 'amount' => $amount * 100]);

        return ['success' => false, 'error' => 'Stripe refund not implemented.'];
    }

    /**
     * Get refund summary for order
     *
     * @return array{total_paid: float, total_refunded: float, refundable: float, payments: array<int, array<string, mixed>>}
     */
    public function getRefundSummary(Order $order): array
    {
        $payments = $order->payments()->get();

        $totalPaid = $payments->where('status', Payment::STATUS_COMPLETED)->sum('amount');
        $totalRefunded = $payments->sum('refunded_amount');

        return [
            'total_paid' => (float) $totalPaid,
            'total_refunded' => (float) $totalRefunded,
            'refundable' => (float) ($totalPaid - $totalRefunded),
            'payments' => $payments->map(fn ($p) => [
                'id' => $p->id,
                'method' => $p->method,
                'amount' => (float) $p->amount,
                'refunded' => (float) $p->refunded_amount,
                'status' => $p->status,
            ])->toArray(),
        ];
    }
}
