<?php

namespace App\Services\Gateways;

use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\Refund;
use Stripe\Stripe;
use Stripe\Webhook;

class StripeGateway
{
    public function __construct()
    {
        Stripe::setApiKey(config('payment.gateways.stripe.secret_key'));
    }

    /**
     * Create a payment intent
     *
     * @return array{success: bool, client_secret?: string, payment_intent_id?: string, error?: string}
     */
    public function createPaymentIntent(Order $order): array
    {
        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => (int) ($order->total * 100), // Amount in paise/cents
                'currency' => strtolower(config('payment.currency', 'INR')),
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'user_id' => $order->user_id,
                ],
                'description' => "Order #{$order->order_number}",
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            return [
                'success' => true,
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id,
            ];
        } catch (ApiErrorException $e) {
            Log::error('Stripe create payment intent failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Retrieve payment intent
     *
     * @return array{success: bool, payment_intent?: array, status?: string, error?: string}
     */
    public function retrievePaymentIntent(string $paymentIntentId): array
    {
        try {
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);

            return [
                'success' => true,
                'payment_intent' => $paymentIntent->toArray(),
                'status' => $paymentIntent->status,
            ];
        } catch (ApiErrorException $e) {
            Log::error('Stripe retrieve payment intent failed', [
                'payment_intent_id' => $paymentIntentId,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Confirm payment intent
     *
     * @return array{success: bool, status?: string, error?: string}
     */
    public function confirmPaymentIntent(string $paymentIntentId, string $paymentMethodId): array
    {
        try {
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);
            $paymentIntent->confirm([
                'payment_method' => $paymentMethodId,
            ]);

            return [
                'success' => true,
                'status' => $paymentIntent->status,
            ];
        } catch (ApiErrorException $e) {
            Log::error('Stripe confirm payment intent failed', [
                'payment_intent_id' => $paymentIntentId,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Process refund
     *
     * @return array{success: bool, refund_id?: string, refund?: array, error?: string}
     */
    public function refund(string $paymentIntentId, float $amount, ?string $reason = null): array
    {
        try {
            $refund = Refund::create([
                'payment_intent' => $paymentIntentId,
                'amount' => (int) ($amount * 100),
                'reason' => $reason ? 'requested_by_customer' : null,
                'metadata' => $reason ? ['notes' => $reason] : [],
            ]);

            return [
                'success' => true,
                'refund_id' => $refund->id,
                'refund' => $refund->toArray(),
            ];
        } catch (ApiErrorException $e) {
            Log::error('Stripe refund failed', [
                'payment_intent_id' => $paymentIntentId,
                'amount' => $amount,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Verify webhook signature
     *
     * @return array{success: bool, event?: \Stripe\Event, error?: string}
     */
    public function verifyWebhook(string $payload, string $signature): array
    {
        $secret = config('payment.gateways.stripe.webhook_secret');

        if (! $secret) {
            Log::warning('Stripe webhook secret not configured');

            return ['success' => false, 'error' => 'Webhook secret not configured'];
        }

        try {
            $event = Webhook::constructEvent($payload, $signature, $secret);

            return [
                'success' => true,
                'event' => $event,
            ];
        } catch (\UnexpectedValueException $e) {
            Log::error('Stripe webhook invalid payload', [
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Invalid payload'];
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::error('Stripe webhook signature verification failed', [
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Invalid signature'];
        }
    }

    /**
     * Get checkout options for frontend
     *
     * @return array<string, mixed>
     */
    public function getCheckoutOptions(Order $order, string $clientSecret): array
    {
        return [
            'publishable_key' => config('payment.gateways.stripe.publishable_key'),
            'client_secret' => $clientSecret,
            'amount' => (int) ($order->total * 100),
            'currency' => strtolower(config('payment.currency', 'INR')),
            'order_number' => $order->order_number,
        ];
    }
}
