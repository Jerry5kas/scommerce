<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use App\Models\Wallet;
use App\Services\Gateways\RazorpayGateway;
use App\Services\Gateways\StripeGateway;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    public function __construct(
        private WalletService $walletService
    ) {}

    /**
     * Get the gateway service instance
     */
    protected function getGateway(string $gateway): RazorpayGateway|StripeGateway
    {
        return match ($gateway) {
            'stripe' => new StripeGateway,
            default => new RazorpayGateway,
        };
    }

    /**
     * Process payment for order
     *
     * @param  array<string, mixed>  $data
     * @return array{success: bool, payment?: Payment, error?: string}
     */
    public function processPayment(
        Order $order,
        string $method,
        float $walletUsage = 0,
        array $data = []
    ): array {
        try {
            return DB::transaction(function () use ($order, $method, $walletUsage, $data) {
                $user = $order->user;
                $totalAmount = (float) $order->total;
                $walletAmount = min($walletUsage, $totalAmount);
                $gatewayAmount = $totalAmount - $walletAmount;

                // Process wallet payment if applicable
                if ($walletAmount > 0) {
                    $walletResult = $this->processWalletPayment($user, $order, $walletAmount);
                    if (! $walletResult['success']) {
                        return $walletResult;
                    }
                }

                // Process remaining amount via gateway or COD
                if ($gatewayAmount > 0) {
                    if ($method === Payment::METHOD_COD) {
                        $result = $this->processCodPayment($order, $gatewayAmount);
                    } else {
                        $result = $this->processGatewayPayment($order, $gatewayAmount, $data['gateway'] ?? config('payment.default', 'razorpay'), $data);
                    }

                    if (! $result['success']) {
                        // Rollback wallet payment if gateway fails
                        if ($walletAmount > 0) {
                            $this->refundToWallet($user, $order, $walletAmount, 'Payment failed - wallet refund');
                        }

                        return $result;
                    }
                }

                // Update order payment status
                $order->update([
                    'payment_status' => $method === Payment::METHOD_COD
                        ? Order::PAYMENT_PENDING
                        : Order::PAYMENT_PAID,
                    'payment_method' => $method,
                ]);

                Log::info('Payment processed successfully', [
                    'order_id' => $order->id,
                    'method' => $method,
                    'total' => $totalAmount,
                    'wallet_amount' => $walletAmount,
                    'gateway_amount' => $gatewayAmount,
                ]);

                return [
                    'success' => true,
                    'payment' => $order->payments()->latest()->first(),
                ];
            });
        } catch (\Exception $e) {
            Log::error('Payment processing failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Payment processing failed. Please try again.'];
        }
    }

    /**
     * Create a payment order/intent with gateway
     *
     * @return array{success: bool, payment?: Payment, gateway_data?: array<string, mixed>, error?: string}
     */
    public function initiateGatewayPayment(Order $order, ?string $gateway = null): array
    {
        $gateway = $gateway ?? config('payment.default', 'razorpay');
        $amount = (float) $order->total;

        // Create pending payment record
        $payment = Payment::create([
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'amount' => $amount,
            'currency' => config('payment.currency', 'INR'),
            'method' => Payment::METHOD_GATEWAY,
            'gateway' => $gateway,
            'status' => Payment::STATUS_PENDING,
        ]);

        // Mock mode for testing
        if (config('payment.mock', false)) {
            return [
                'success' => true,
                'payment' => $payment,
                'gateway_data' => [
                    'mock' => true,
                    'payment_id' => $payment->id,
                ],
            ];
        }

        // Create order/intent with gateway
        if ($gateway === 'stripe') {
            $stripeGateway = $this->getGateway('stripe');
            $result = $stripeGateway->createPaymentIntent($order);

            if (! $result['success']) {
                $payment->delete();

                return ['success' => false, 'error' => $result['error']];
            }

            $payment->update([
                'payment_id' => $result['payment_intent_id'],
            ]);

            return [
                'success' => true,
                'payment' => $payment,
                'gateway_data' => $stripeGateway->getCheckoutOptions($order, $result['client_secret']),
            ];
        }

        // Default: Razorpay
        $razorpayGateway = $this->getGateway('razorpay');
        $result = $razorpayGateway->createOrder($order);

        if (! $result['success']) {
            $payment->delete();

            return ['success' => false, 'error' => $result['error']];
        }

        $payment->update([
            'gateway_response' => ['razorpay_order_id' => $result['order_id']],
        ]);

        return [
            'success' => true,
            'payment' => $payment,
            'gateway_data' => $razorpayGateway->getCheckoutOptions($order, $result['order_id']),
        ];
    }

    /**
     * Verify and complete Razorpay payment
     *
     * @return array{success: bool, payment?: Payment, error?: string}
     */
    public function verifyRazorpayPayment(
        Payment $payment,
        string $razorpayOrderId,
        string $razorpayPaymentId,
        string $razorpaySignature
    ): array {
        $razorpay = $this->getGateway('razorpay');

        // Verify signature
        $result = $razorpay->verifyPayment($razorpayOrderId, $razorpayPaymentId, $razorpaySignature);

        if (! $result['success']) {
            $this->handlePaymentFailure($payment, $result['error'] ?? 'Signature verification failed');

            return ['success' => false, 'error' => 'Payment verification failed'];
        }

        // Mark payment as successful
        $this->handlePaymentSuccess($payment, [
            'razorpay_order_id' => $razorpayOrderId,
            'razorpay_payment_id' => $razorpayPaymentId,
            'razorpay_signature' => $razorpaySignature,
        ]);

        $payment->update(['payment_id' => $razorpayPaymentId]);

        return ['success' => true, 'payment' => $payment];
    }

    /**
     * Verify and complete Stripe payment
     *
     * @return array{success: bool, payment?: Payment, error?: string}
     */
    public function verifyStripePayment(Payment $payment, string $paymentIntentId): array
    {
        $stripe = $this->getGateway('stripe');

        $result = $stripe->retrievePaymentIntent($paymentIntentId);

        if (! $result['success']) {
            $this->handlePaymentFailure($payment, $result['error'] ?? 'Failed to retrieve payment');

            return ['success' => false, 'error' => 'Payment verification failed'];
        }

        if ($result['status'] === 'succeeded') {
            $this->handlePaymentSuccess($payment, $result['payment_intent']);

            return ['success' => true, 'payment' => $payment];
        }

        $this->handlePaymentFailure($payment, 'Payment not completed. Status: '.$result['status']);

        return ['success' => false, 'error' => 'Payment was not successful'];
    }

    /**
     * Process wallet payment
     *
     * @return array{success: bool, payment?: Payment, error?: string}
     */
    public function processWalletPayment(User $user, Order $order, float $amount): array
    {
        $wallet = $this->walletService->getOrCreateWallet($user);

        if (! $wallet->hasSufficientBalance($amount)) {
            return ['success' => false, 'error' => 'Insufficient wallet balance.'];
        }

        // Deduct from wallet
        $walletResult = $this->walletService->deductForOrder($wallet, $order, $amount);
        if (! $walletResult['success']) {
            return $walletResult;
        }

        // Create payment record
        $payment = Payment::create([
            'order_id' => $order->id,
            'user_id' => $user->id,
            'amount' => $amount,
            'currency' => config('payment.currency', 'INR'),
            'method' => Payment::METHOD_WALLET,
            'status' => Payment::STATUS_COMPLETED,
            'paid_at' => now(),
        ]);

        return [
            'success' => true,
            'payment' => $payment,
        ];
    }

    /**
     * Process gateway payment (legacy - mock for now)
     *
     * @param  array<string, mixed>  $data
     * @return array{success: bool, payment?: Payment, gateway_data?: array<string, mixed>, error?: string}
     */
    public function processGatewayPayment(Order $order, float $amount, string $gateway, array $data = []): array
    {
        // Create pending payment record
        $payment = Payment::create([
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'amount' => $amount,
            'currency' => config('payment.currency', 'INR'),
            'method' => Payment::METHOD_GATEWAY,
            'gateway' => $gateway,
            'status' => Payment::STATUS_PENDING,
        ]);

        // Mock mode for testing
        if (config('payment.mock', false)) {
            $gatewayPaymentId = 'mock_'.uniqid();
            $payment->update([
                'payment_id' => $gatewayPaymentId,
                'status' => Payment::STATUS_COMPLETED,
                'paid_at' => now(),
                'gateway_response' => [
                    'mock' => true,
                    'gateway' => $gateway,
                    'payment_id' => $gatewayPaymentId,
                ],
            ]);

            return [
                'success' => true,
                'payment' => $payment,
                'gateway_data' => ['payment_id' => $gatewayPaymentId],
            ];
        }

        // For real payments, use initiateGatewayPayment
        return [
            'success' => true,
            'payment' => $payment,
            'gateway_data' => [
                'requires_action' => true,
                'payment_id' => $payment->id,
            ],
        ];
    }

    /**
     * Process COD payment (just record it)
     *
     * @return array{success: bool, payment?: Payment, error?: string}
     */
    public function processCodPayment(Order $order, float $amount): array
    {
        $payment = Payment::create([
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'amount' => $amount,
            'currency' => config('payment.currency', 'INR'),
            'method' => Payment::METHOD_COD,
            'status' => Payment::STATUS_PENDING,
        ]);

        return [
            'success' => true,
            'payment' => $payment,
        ];
    }

    /**
     * Handle successful payment callback
     */
    public function handlePaymentSuccess(Payment $payment, array $gatewayResponse = []): Payment
    {
        $payment->markAsCompleted($gatewayResponse);

        // Update order payment status
        $payment->order->update([
            'payment_status' => Order::PAYMENT_PAID,
            'status' => Order::STATUS_CONFIRMED,
        ]);

        Log::info('Payment completed', [
            'payment_id' => $payment->id,
            'order_id' => $payment->order_id,
        ]);

        return $payment;
    }

    /**
     * Handle failed payment callback
     */
    public function handlePaymentFailure(Payment $payment, string $reason, array $gatewayResponse = []): Payment
    {
        $payment->markAsFailed($reason, $gatewayResponse);

        // Update order payment status
        $payment->order->update([
            'payment_status' => Order::PAYMENT_FAILED,
        ]);

        Log::warning('Payment failed', [
            'payment_id' => $payment->id,
            'order_id' => $payment->order_id,
            'reason' => $reason,
        ]);

        return $payment;
    }

    /**
     * Process refund via gateway
     *
     * @return array{success: bool, refund_id?: string, error?: string}
     */
    public function processGatewayRefund(Payment $payment, float $amount, ?string $reason = null): array
    {
        if (! $payment->payment_id) {
            return ['success' => false, 'error' => 'No gateway payment ID found'];
        }

        if (config('payment.mock', false)) {
            $payment->processRefund($amount);

            return [
                'success' => true,
                'refund_id' => 'mock_refund_'.uniqid(),
            ];
        }

        $gateway = $this->getGateway($payment->gateway ?? 'razorpay');

        if ($payment->gateway === 'stripe') {
            return $gateway->refund($payment->payment_id, $amount, $reason);
        }

        // Razorpay
        return $gateway->refund($payment->payment_id, $amount, $reason);
    }

    /**
     * Verify webhook signature
     */
    public function verifyWebhook(string $payload, string $signature, string $gateway): bool
    {
        if (config('payment.mock', false)) {
            return true;
        }

        $gatewayService = $this->getGateway($gateway);

        if ($gateway === 'razorpay') {
            return $gatewayService->verifyWebhookSignature($payload, $signature);
        }

        if ($gateway === 'stripe') {
            $result = $gatewayService->verifyWebhook($payload, $signature);

            return $result['success'];
        }

        return false;
    }

    /**
     * Refund to wallet
     */
    protected function refundToWallet(User $user, Order $order, float $amount, string $description): void
    {
        $wallet = $this->walletService->getOrCreateWallet($user);
        $this->walletService->addRefund($wallet, $order, $amount, $description);
    }

    /**
     * Calculate payment split
     *
     * @return array{wallet_amount: float, gateway_amount: float, total: float}
     */
    public function calculatePaymentSplit(Order $order, float $walletUsage, Wallet $wallet): array
    {
        $total = (float) $order->total;
        $availableWallet = min($walletUsage, (float) $wallet->balance, $total);
        $gatewayAmount = $total - $availableWallet;

        return [
            'wallet_amount' => $availableWallet,
            'gateway_amount' => $gatewayAmount,
            'total' => $total,
        ];
    }

    /**
     * Get payment by gateway ID
     */
    public function getPaymentByGatewayId(string $gatewayPaymentId): ?Payment
    {
        return Payment::where('payment_id', $gatewayPaymentId)->first();
    }

    /**
     * Mark COD payment as collected
     */
    public function markCodAsCollected(Payment $payment): Payment
    {
        if ($payment->method !== Payment::METHOD_COD) {
            throw new \InvalidArgumentException('Payment is not COD.');
        }

        $payment->update([
            'status' => Payment::STATUS_COMPLETED,
            'paid_at' => now(),
        ]);

        $payment->order->update([
            'payment_status' => Order::PAYMENT_PAID,
        ]);

        return $payment;
    }

    /**
     * Get gateway config for frontend
     *
     * @return array<string, mixed>
     */
    public function getGatewayConfig(?string $gateway = null): array
    {
        $gateway = $gateway ?? config('payment.default', 'razorpay');

        return match ($gateway) {
            'stripe' => [
                'gateway' => 'stripe',
                'publishable_key' => config('payment.gateways.stripe.publishable_key'),
            ],
            default => [
                'gateway' => 'razorpay',
                'key_id' => config('payment.gateways.razorpay.key_id'),
            ],
        };
    }
}
