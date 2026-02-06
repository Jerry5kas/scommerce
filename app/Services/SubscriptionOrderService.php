<?php

namespace App\Services;

use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubscriptionOrderService
{
    public function __construct(
        private SubscriptionScheduleService $scheduleService
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

        // Check for existing order (prevent duplicates)
        // Note: Order model will be created in Phase 6. For now, we'll return a placeholder.
        // In production, we would check: Order::where('subscription_id', $subscription->id)
        //     ->whereDate('delivery_date', $deliveryDate)->exists()

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

                // Calculate order total
                $total = $items->sum(fn ($item) => $item->getLineTotal());

                // Apply plan discount if any
                $plan = $subscription->plan;
                $discount = 0;
                if ($plan && $plan->discount_percent > 0) {
                    $discount = $total * ($plan->discount_percent / 100);
                    $total -= $discount;
                }

                // Order creation will be implemented in Phase 6
                // For now, we log and update subscription
                Log::info('Subscription order generated', [
                    'subscription_id' => $subscription->id,
                    'delivery_date' => $deliveryDate->format('Y-m-d'),
                    'items_count' => $items->count(),
                    'total' => $total,
                    'discount' => $discount,
                ]);

                // Update next delivery date
                $subscription->next_delivery_date = $this->scheduleService->calculateNextDeliveryDate(
                    $subscription,
                    $deliveryDate
                );
                $subscription->save();

                return [
                    'success' => true,
                    'message' => 'Order generated successfully.',
                    'total' => $total,
                    'items_count' => $items->count(),
                    'next_delivery_date' => $subscription->next_delivery_date->format('Y-m-d'),
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
            if ($plan && $plan->discount_percent > 0) {
                $total -= $total * ($plan->discount_percent / 100);
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
