<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\Gateways\StripeGateway;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    public function __construct(
        private PaymentService $paymentService
    ) {}

    /**
     * Handle payment webhooks
     */
    public function handle(Request $request, string $gateway): JsonResponse
    {
        Log::info('Payment webhook received', [
            'gateway' => $gateway,
            'headers' => $request->headers->all(),
        ]);

        $payload = $request->getContent();

        // Verify webhook signature
        $signature = $this->getSignature($request, $gateway);

        if (! $this->paymentService->verifyWebhook($payload, $signature, $gateway)) {
            Log::warning('Payment webhook signature verification failed', [
                'gateway' => $gateway,
            ]);

            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Process webhook based on gateway
        return match ($gateway) {
            'razorpay' => $this->handleRazorpay($request),
            'stripe' => $this->handleStripe($request),
            default => response()->json(['error' => 'Unsupported gateway'], 400),
        };
    }

    /**
     * Get signature from request headers
     */
    protected function getSignature(Request $request, string $gateway): string
    {
        return match ($gateway) {
            'razorpay' => $request->header('X-Razorpay-Signature', ''),
            'stripe' => $request->header('Stripe-Signature', ''),
            default => '',
        };
    }

    /**
     * Handle Razorpay webhook
     */
    protected function handleRazorpay(Request $request): JsonResponse
    {
        $payload = $request->all();
        $event = $payload['event'] ?? null;

        Log::info('Razorpay webhook event', ['event' => $event]);

        switch ($event) {
            case 'payment.captured':
                return $this->handleRazorpayPaymentCaptured($payload);

            case 'payment.failed':
                return $this->handleRazorpayPaymentFailed($payload);

            case 'refund.created':
            case 'refund.processed':
                return $this->handleRazorpayRefund($payload);

            default:
                Log::info('Unhandled Razorpay event', ['event' => $event]);

                return response()->json(['status' => 'ignored']);
        }
    }

    /**
     * Handle Razorpay payment captured
     */
    protected function handleRazorpayPaymentCaptured(array $payload): JsonResponse
    {
        $paymentData = $payload['payload']['payment']['entity'] ?? [];
        $razorpayPaymentId = $paymentData['id'] ?? null;
        $razorpayOrderId = $paymentData['order_id'] ?? null;

        if (! $razorpayPaymentId) {
            return response()->json(['error' => 'Missing payment ID'], 400);
        }

        // Find payment by order_id from gateway_response
        $payment = Payment::whereJsonContains('gateway_response->razorpay_order_id', $razorpayOrderId)
            ->where('status', Payment::STATUS_PENDING)
            ->first();

        if (! $payment) {
            // Try finding by payment_id
            $payment = Payment::where('payment_id', $razorpayPaymentId)->first();
        }

        if (! $payment) {
            Log::warning('Razorpay payment not found', [
                'razorpay_payment_id' => $razorpayPaymentId,
                'razorpay_order_id' => $razorpayOrderId,
            ]);

            return response()->json(['status' => 'payment_not_found']);
        }

        // Update payment
        $this->paymentService->handlePaymentSuccess($payment, [
            'razorpay_payment_id' => $razorpayPaymentId,
            'razorpay_order_id' => $razorpayOrderId,
            'webhook_data' => $paymentData,
        ]);

        $payment->update(['payment_id' => $razorpayPaymentId]);

        return response()->json(['status' => 'success']);
    }

    /**
     * Handle Razorpay payment failed
     */
    protected function handleRazorpayPaymentFailed(array $payload): JsonResponse
    {
        $paymentData = $payload['payload']['payment']['entity'] ?? [];
        $razorpayPaymentId = $paymentData['id'] ?? null;
        $razorpayOrderId = $paymentData['order_id'] ?? null;
        $errorReason = $paymentData['error_description'] ?? 'Payment failed';

        $payment = Payment::whereJsonContains('gateway_response->razorpay_order_id', $razorpayOrderId)
            ->where('status', Payment::STATUS_PENDING)
            ->first();

        if (! $payment) {
            return response()->json(['status' => 'payment_not_found']);
        }

        $this->paymentService->handlePaymentFailure($payment, $errorReason, [
            'razorpay_payment_id' => $razorpayPaymentId,
            'webhook_data' => $paymentData,
        ]);

        return response()->json(['status' => 'success']);
    }

    /**
     * Handle Razorpay refund
     */
    protected function handleRazorpayRefund(array $payload): JsonResponse
    {
        $refundData = $payload['payload']['refund']['entity'] ?? [];
        $razorpayPaymentId = $refundData['payment_id'] ?? null;
        $refundAmount = ($refundData['amount'] ?? 0) / 100; // Convert from paise

        $payment = Payment::where('payment_id', $razorpayPaymentId)->first();

        if ($payment) {
            $payment->processRefund($refundAmount);
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Handle Stripe webhook
     */
    protected function handleStripe(Request $request): JsonResponse
    {
        $stripe = new StripeGateway;
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature', '');

        $result = $stripe->verifyWebhook($payload, $signature);

        if (! $result['success']) {
            return response()->json(['error' => $result['error']], 400);
        }

        $event = $result['event'];

        Log::info('Stripe webhook event', ['type' => $event->type]);

        switch ($event->type) {
            case 'payment_intent.succeeded':
                return $this->handleStripePaymentSucceeded($event->data->object);

            case 'payment_intent.payment_failed':
                return $this->handleStripePaymentFailed($event->data->object);

            case 'charge.refunded':
                return $this->handleStripeRefund($event->data->object);

            default:
                return response()->json(['status' => 'ignored']);
        }
    }

    /**
     * Handle Stripe payment succeeded
     */
    protected function handleStripePaymentSucceeded(object $paymentIntent): JsonResponse
    {
        $payment = Payment::where('payment_id', $paymentIntent->id)->first();

        if (! $payment) {
            Log::warning('Stripe payment not found', [
                'payment_intent_id' => $paymentIntent->id,
            ]);

            return response()->json(['status' => 'payment_not_found']);
        }

        $this->paymentService->handlePaymentSuccess($payment, (array) $paymentIntent);

        return response()->json(['status' => 'success']);
    }

    /**
     * Handle Stripe payment failed
     */
    protected function handleStripePaymentFailed(object $paymentIntent): JsonResponse
    {
        $payment = Payment::where('payment_id', $paymentIntent->id)->first();

        if (! $payment) {
            return response()->json(['status' => 'payment_not_found']);
        }

        $errorMessage = $paymentIntent->last_payment_error->message ?? 'Payment failed';
        $this->paymentService->handlePaymentFailure($payment, $errorMessage, (array) $paymentIntent);

        return response()->json(['status' => 'success']);
    }

    /**
     * Handle Stripe refund
     */
    protected function handleStripeRefund(object $charge): JsonResponse
    {
        $paymentIntentId = $charge->payment_intent ?? null;
        $refundedAmount = ($charge->amount_refunded ?? 0) / 100;

        if ($paymentIntentId) {
            $payment = Payment::where('payment_id', $paymentIntentId)->first();
            if ($payment) {
                $currentRefunded = (float) $payment->refunded_amount;
                $newRefund = $refundedAmount - $currentRefunded;
                if ($newRefund > 0) {
                    $payment->processRefund($newRefund);
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
}
