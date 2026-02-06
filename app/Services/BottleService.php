<?php

namespace App\Services;

use App\Models\Bottle;
use App\Models\BottleLog;
use App\Models\Delivery;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BottleService
{
    /**
     * Issue a bottle to a user
     *
     * @param  array<string, mixed>  $options
     * @return array{success: bool, bottle?: Bottle, log?: BottleLog, error?: string}
     */
    public function issueBottle(
        User $user,
        Bottle $bottle,
        ?Subscription $subscription = null,
        ?Delivery $delivery = null,
        array $options = []
    ): array {
        if (! $bottle->isAvailable()) {
            return ['success' => false, 'error' => 'Bottle is not available for issue.'];
        }

        try {
            return DB::transaction(function () use ($user, $bottle, $subscription, $delivery, $options) {
                // Issue bottle
                $bottle->issueTo($user, $subscription);

                // Create log
                $log = $this->createLog($bottle, BottleLog::ACTION_ISSUED, [
                    'user_id' => $user->id,
                    'subscription_id' => $subscription?->id,
                    'delivery_id' => $delivery?->id,
                    'action_by' => $options['action_by'] ?? BottleLog::ACTION_BY_SYSTEM,
                    'action_by_id' => $options['action_by_id'] ?? null,
                    'deposit_amount' => $bottle->deposit_amount,
                    'notes' => $options['notes'] ?? null,
                ]);

                Log::info('Bottle issued', [
                    'bottle_id' => $bottle->id,
                    'user_id' => $user->id,
                    'subscription_id' => $subscription?->id,
                ]);

                return [
                    'success' => true,
                    'bottle' => $bottle->fresh(),
                    'log' => $log,
                ];
            });
        } catch (\Exception $e) {
            Log::error('Failed to issue bottle', [
                'bottle_id' => $bottle->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to issue bottle.'];
        }
    }

    /**
     * Return a bottle
     *
     * @param  array<string, mixed>  $options
     * @return array{success: bool, bottle?: Bottle, log?: BottleLog, refund?: float, error?: string}
     */
    public function returnBottle(
        Bottle $bottle,
        string $condition = 'good',
        ?Delivery $delivery = null,
        array $options = []
    ): array {
        if (! $bottle->isIssued()) {
            return ['success' => false, 'error' => 'Bottle is not issued.'];
        }

        try {
            return DB::transaction(function () use ($bottle, $condition, $delivery, $options) {
                $userId = $bottle->current_user_id;
                $subscriptionId = $bottle->current_subscription_id;
                $depositAmount = $bottle->deposit_amount ?? 0;

                // Calculate refund based on condition
                $refundAmount = $this->calculateRefund($depositAmount, $condition);

                // Return bottle
                $bottle->returnBottle($condition);

                // Create log
                $log = $this->createLog($bottle, BottleLog::ACTION_RETURNED, [
                    'user_id' => $userId,
                    'subscription_id' => $subscriptionId,
                    'delivery_id' => $delivery?->id,
                    'action_by' => $options['action_by'] ?? BottleLog::ACTION_BY_SYSTEM,
                    'action_by_id' => $options['action_by_id'] ?? null,
                    'condition' => $condition,
                    'refund_amount' => $refundAmount,
                    'notes' => $options['notes'] ?? null,
                ]);

                Log::info('Bottle returned', [
                    'bottle_id' => $bottle->id,
                    'condition' => $condition,
                    'refund_amount' => $refundAmount,
                ]);

                return [
                    'success' => true,
                    'bottle' => $bottle->fresh(),
                    'log' => $log,
                    'refund' => $refundAmount,
                ];
            });
        } catch (\Exception $e) {
            Log::error('Failed to return bottle', [
                'bottle_id' => $bottle->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to return bottle.'];
        }
    }

    /**
     * Mark bottle as damaged
     *
     * @param  array<string, mixed>  $options
     * @return array{success: bool, bottle?: Bottle, log?: BottleLog, error?: string}
     */
    public function markAsDamaged(
        Bottle $bottle,
        string $reason,
        ?Delivery $delivery = null,
        array $options = []
    ): array {
        try {
            return DB::transaction(function () use ($bottle, $reason, $delivery, $options) {
                $userId = $bottle->current_user_id;
                $subscriptionId = $bottle->current_subscription_id;

                $bottle->markAsDamaged($reason);

                $log = $this->createLog($bottle, BottleLog::ACTION_DAMAGED, [
                    'user_id' => $userId,
                    'subscription_id' => $subscriptionId,
                    'delivery_id' => $delivery?->id,
                    'action_by' => $options['action_by'] ?? BottleLog::ACTION_BY_SYSTEM,
                    'action_by_id' => $options['action_by_id'] ?? null,
                    'condition' => 'damaged',
                    'notes' => $reason,
                ]);

                Log::info('Bottle marked as damaged', [
                    'bottle_id' => $bottle->id,
                    'reason' => $reason,
                ]);

                return [
                    'success' => true,
                    'bottle' => $bottle->fresh(),
                    'log' => $log,
                ];
            });
        } catch (\Exception $e) {
            Log::error('Failed to mark bottle as damaged', [
                'bottle_id' => $bottle->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to mark bottle as damaged.'];
        }
    }

    /**
     * Mark bottle as lost
     *
     * @param  array<string, mixed>  $options
     * @return array{success: bool, bottle?: Bottle, log?: BottleLog, error?: string}
     */
    public function markAsLost(Bottle $bottle, array $options = []): array
    {
        try {
            return DB::transaction(function () use ($bottle, $options) {
                $userId = $bottle->current_user_id;
                $subscriptionId = $bottle->current_subscription_id;

                $bottle->markAsLost();

                $log = $this->createLog($bottle, BottleLog::ACTION_LOST, [
                    'user_id' => $userId,
                    'subscription_id' => $subscriptionId,
                    'action_by' => $options['action_by'] ?? BottleLog::ACTION_BY_SYSTEM,
                    'action_by_id' => $options['action_by_id'] ?? null,
                    'notes' => $options['notes'] ?? 'Bottle reported as lost',
                ]);

                Log::warning('Bottle marked as lost', [
                    'bottle_id' => $bottle->id,
                    'user_id' => $userId,
                ]);

                return [
                    'success' => true,
                    'bottle' => $bottle->fresh(),
                    'log' => $log,
                ];
            });
        } catch (\Exception $e) {
            Log::error('Failed to mark bottle as lost', [
                'bottle_id' => $bottle->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to mark bottle as lost.'];
        }
    }

    /**
     * Get user's bottles
     */
    public function getUserBottles(User $user): Collection
    {
        return Bottle::forUser($user->id)
            ->with('currentSubscription')
            ->get();
    }

    /**
     * Get user's bottle balance (issued - returned)
     *
     * @return array{issued: int, returned: int, balance: int, total_deposit: float}
     */
    public function getUserBottleBalance(User $user): array
    {
        $issued = BottleLog::forUser($user->id)->issued()->count();
        $returned = BottleLog::forUser($user->id)->returned()->count();
        $currentlyHeld = Bottle::forUser($user->id)->issued()->count();

        $totalDeposit = Bottle::forUser($user->id)
            ->issued()
            ->sum('deposit_amount');

        return [
            'issued' => $issued,
            'returned' => $returned,
            'balance' => $currentlyHeld,
            'total_deposit' => (float) $totalDeposit,
        ];
    }

    /**
     * Get subscription bottles
     */
    public function getSubscriptionBottles(Subscription $subscription): Collection
    {
        return Bottle::forSubscription($subscription->id)->get();
    }

    /**
     * Get available bottles
     */
    public function getAvailableBottles(?string $type = null): Collection
    {
        $query = Bottle::available();

        if ($type) {
            $query->byType($type);
        }

        return $query->get();
    }

    /**
     * Create a bottle log entry
     *
     * @param  array<string, mixed>  $data
     */
    public function createLog(Bottle $bottle, string $action, array $data = []): BottleLog
    {
        return BottleLog::create([
            'bottle_id' => $bottle->id,
            'user_id' => $data['user_id'] ?? $bottle->current_user_id,
            'subscription_id' => $data['subscription_id'] ?? null,
            'delivery_id' => $data['delivery_id'] ?? null,
            'action' => $action,
            'action_by' => $data['action_by'] ?? BottleLog::ACTION_BY_SYSTEM,
            'action_by_id' => $data['action_by_id'] ?? null,
            'condition' => $data['condition'] ?? null,
            'notes' => $data['notes'] ?? null,
            'deposit_amount' => $data['deposit_amount'] ?? null,
            'refund_amount' => $data['refund_amount'] ?? null,
        ]);
    }

    /**
     * Calculate refund based on condition
     */
    public function calculateRefund(float $depositAmount, string $condition): float
    {
        return match ($condition) {
            'good' => $depositAmount,
            'damaged' => $depositAmount * 0.5, // 50% refund for damaged
            'lost' => 0, // No refund for lost
            default => $depositAmount,
        };
    }

    /**
     * Create new bottle
     *
     * @param  array<string, mixed>  $data
     */
    public function createBottle(array $data): Bottle
    {
        return Bottle::create([
            'bottle_number' => $data['bottle_number'] ?? Bottle::generateBottleNumber(),
            'barcode' => $data['barcode'] ?? null,
            'type' => $data['type'] ?? Bottle::TYPE_STANDARD,
            'capacity' => $data['capacity'] ?? null,
            'status' => Bottle::STATUS_AVAILABLE,
            'purchase_cost' => $data['purchase_cost'] ?? null,
            'deposit_amount' => $data['deposit_amount'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);
    }

    /**
     * Get bottle by barcode
     */
    public function getBottleByBarcode(string $barcode): ?Bottle
    {
        return Bottle::where('barcode', $barcode)->first();
    }

    /**
     * Get bottle by number
     */
    public function getBottleByNumber(string $bottleNumber): ?Bottle
    {
        return Bottle::where('bottle_number', $bottleNumber)->first();
    }

    /**
     * Bulk issue bottles for subscription
     *
     * @return array{success: bool, issued: int, error?: string}
     */
    public function issueBottlesForSubscription(Subscription $subscription, int $count): array
    {
        $user = $subscription->user;
        $availableBottles = $this->getAvailableBottles()->take($count);

        if ($availableBottles->count() < $count) {
            return [
                'success' => false,
                'issued' => 0,
                'error' => "Only {$availableBottles->count()} bottles available.",
            ];
        }

        $issued = 0;
        foreach ($availableBottles as $bottle) {
            $result = $this->issueBottle($user, $bottle, $subscription, null, [
                'action_by' => BottleLog::ACTION_BY_SYSTEM,
                'notes' => 'Issued with subscription',
            ]);

            if ($result['success']) {
                $issued++;
            }
        }

        return ['success' => true, 'issued' => $issued];
    }

    /**
     * Get bottle statistics
     *
     * @return array<string, mixed>
     */
    public function getBottleStats(): array
    {
        return [
            'total' => Bottle::count(),
            'available' => Bottle::available()->count(),
            'issued' => Bottle::issued()->count(),
            'damaged' => Bottle::damaged()->count(),
            'lost' => Bottle::lost()->count(),
            'total_value' => Bottle::sum('purchase_cost'),
            'total_deposit' => Bottle::issued()->sum('deposit_amount'),
        ];
    }
}
