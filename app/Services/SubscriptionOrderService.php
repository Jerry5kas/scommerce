<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubscriptionOrderService
{
    public function __construct(
        private SubscriptionScheduleService $scheduleService,
        private CheckoutService $checkoutService,
        private SubscriptionPaymentService $subscriptionPaymentService
    ) {}

    /**
     * Generate order for a single subscription on a given date
     *
     * @return array{success: bool, message: string, order_id?: int}
     */
    public function generateOrderForSubscription(Subscription $subscription, Carbon $deliveryDate): array
    {
        // Validate subscription is eligible
        if (! $this->shouldGenerateOrder($subscription, $deliveryDate)) {
            return [
                'success' => false,
                'message' => 'Subscription is not eligible for order generation on this date.',
            ];
        }

        $alreadyExists = Order::query()
            ->where('subscription_id', $subscription->id)
            ->whereDate('scheduled_delivery_date', $deliveryDate)
            ->exists();

        if ($alreadyExists) {
            return [
                'success' => false,
                'message' => 'Order already exists for this subscription and date.',
            ];
        }

        try {
            return DB::transaction(function () use ($subscription, $deliveryDate) {
                // Get active subscription items
                $items = $subscription->items()->active()->with('product')->get();

                if ($items->isEmpty()) {
                    return [
                        'success' => false,
                        'message' => 'Subscription has no active items.',
                    ];
                }

                $order = $this->checkoutService->createOrderFromSubscription($subscription, $deliveryDate);

                $paymentResult = $this->subscriptionPaymentService->attemptChargeForOrder($order);

                // Update next delivery date
                $subscription->next_delivery_date = $this->scheduleService->calculateNextDeliveryDate(
                    $subscription,
                    $deliveryDate
                );
                $subscription->save();

                Log::info('Subscription order generated', [
                    'subscription_id' => $subscription->id,
                    'order_id' => $order->id,
                    'delivery_date' => $deliveryDate->format('Y-m-d'),
                ]);

                return [
                    'success' => true,
                    'message' => 'Order generated successfully.',
                    'order_id' => $order->id,
                    'total' => (float) $order->total,
                    'items_count' => $items->count(),
                    'next_delivery_date' => $subscription->next_delivery_date->format('Y-m-d'),
                    'payment_status' => $order->fresh()->payment_status,
                    'payment_attempt_status' => $paymentResult['status'] ?? null,
                ];
            });
        } catch (\Exception $e) {
            Log::error('Failed to generate subscription order', [
                'subscription_id' => $subscription->id,
                'delivery_date' => $deliveryDate->format('Y-m-d'),
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to generate order: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Generate orders for all eligible subscriptions on a given date
     *
     * @return array{processed: int, success: int, failed: int, errors: array<string>}
     */
    public function generateOrdersForDate(Carbon $date): array
    {
        $subscriptions = Subscription::query()
            ->dueForDelivery($date)
            ->with(['items.product', 'plan', 'address', 'user'])
            ->get();

        $results = [
            'processed' => 0,
            'success' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        foreach ($subscriptions as $subscription) {
            $results['processed']++;

            $result = $this->generateOrderForSubscription($subscription, $date);

            if ($result['success']) {
                $results['success']++;
            } else {
                $results['failed']++;
                $results['errors'][] = "Subscription #{$subscription->id}: {$result['message']}";
            }
        }

        Log::info('Daily subscription order generation completed', $results);

        return $results;
    }

    /**
     * Check if an order should be generated for a subscription on a given date
     */
    public function shouldGenerateOrder(Subscription $subscription, Carbon $date): bool
    {
        // Must be active
        if ($subscription->status !== Subscription::STATUS_ACTIVE) {
            return false;
        }

        // Must not be on vacation
        if ($subscription->isOnVacation($date)) {
            return false;
        }

        // Must be a delivery date according to schedule
        if (! $this->scheduleService->isDeliveryDate($subscription, $date)) {
            return false;
        }

        // Must have active items
        if ($subscription->items()->active()->count() === 0) {
            return false;
        }

        // Check if subscription hasn't expired
        if ($subscription->end_date && $date->gt($subscription->end_date)) {
            return false;
        }

        return true;
    }

    /**
     * Get subscriptions due for delivery on a specific date
     *
     * @return Collection<int, Subscription>
     */
    public function getSubscriptionsDueForDelivery(Carbon $date): Collection
    {
        return Subscription::query()
            ->dueForDelivery($date)
            ->with(['items.product', 'plan', 'address', 'user'])
            ->get();
    }

    /**
     * Preview orders that would be generated for a date
     *
     * @return array<array{subscription_id: int, user_name: string, items_count: int, total: float}>
     */
    public function previewOrdersForDate(Carbon $date): array
    {
        $subscriptions = $this->getSubscriptionsDueForDelivery($date);

        return $subscriptions->map(function ($subscription) {
            $items = $subscription->items()->active()->get();
            $total = $items->sum(fn ($item) => $item->getLineTotal());

            $plan = $subscription->plan;
            if ($plan) {
                if ($plan->discount_type === SubscriptionPlan::DISCOUNT_PERCENTAGE && (float) $plan->discount_value > 0) {
                    $total -= $total * (((float) $plan->discount_value) / 100);
                }

                if ($plan->discount_type === SubscriptionPlan::DISCOUNT_FLAT && (float) $plan->discount_value > 0) {
                    $total -= min($total, (float) $plan->discount_value);
                }
            }

            return [
                'subscription_id' => $subscription->id,
                'user_id' => $subscription->user_id,
                'user_name' => $subscription->user->name ?? 'Unknown',
                'address' => $subscription->address->address_line_1 ?? 'Unknown',
                'items_count' => $items->count(),
                'total' => round($total, 2),
            ];
        })->toArray();
    }
}
