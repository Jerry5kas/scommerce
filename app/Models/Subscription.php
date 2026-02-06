<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    use HasFactory;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_PAUSED = 'paused';

    public const STATUS_CANCELLED = 'cancelled';

    public const STATUS_EXPIRED = 'expired';

    public const BILLING_WEEKLY = 'weekly';

    public const BILLING_MONTHLY = 'monthly';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'user_address_id',
        'subscription_plan_id',
        'status',
        'start_date',
        'end_date',
        'next_delivery_date',
        'paused_until',
        'vacation_start',
        'vacation_end',
        'billing_cycle',
        'auto_renew',
        'notes',
        'vertical',
        'bottles_issued',
        'bottles_returned',
        'cancelled_at',
        'cancellation_reason',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'next_delivery_date' => 'date',
            'paused_until' => 'date',
            'vacation_start' => 'date',
            'vacation_end' => 'date',
            'auto_renew' => 'boolean',
            'bottles_issued' => 'integer',
            'bottles_returned' => 'integer',
            'cancelled_at' => 'datetime',
        ];
    }

    // ─────────────────────────────────────────────────────────────
    // Relationships
    // ─────────────────────────────────────────────────────────────

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<UserAddress, $this>
     */
    public function address(): BelongsTo
    {
        return $this->belongsTo(UserAddress::class, 'user_address_id');
    }

    /**
     * @return BelongsTo<SubscriptionPlan, $this>
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    /**
     * @return HasMany<SubscriptionItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(SubscriptionItem::class);
    }

    /**
     * @return HasMany<Bottle, $this>
     */
    public function bottles(): HasMany
    {
        return $this->hasMany(Bottle::class, 'current_subscription_id');
    }

    // ─────────────────────────────────────────────────────────────
    // Scopes
    // ─────────────────────────────────────────────────────────────

    /**
     * @param  Builder<Subscription>  $query
     * @return Builder<Subscription>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /**
     * @param  Builder<Subscription>  $query
     * @return Builder<Subscription>
     */
    public function scopePaused(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PAUSED);
    }

    /**
     * @param  Builder<Subscription>  $query
     * @return Builder<Subscription>
     */
    public function scopeCancelled(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_CANCELLED);
    }

    /**
     * @param  Builder<Subscription>  $query
     * @return Builder<Subscription>
     */
    public function scopeDueForDelivery(Builder $query, ?Carbon $date = null): Builder
    {
        $date ??= Carbon::today();

        return $query
            ->where('status', self::STATUS_ACTIVE)
            ->where('next_delivery_date', '<=', $date)
            ->where(function ($q) use ($date) {
                $q->whereNull('vacation_start')
                    ->orWhere('vacation_start', '>', $date)
                    ->orWhere('vacation_end', '<', $date);
            });
    }

    /**
     * @param  Builder<Subscription>  $query
     * @return Builder<Subscription>
     */
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    // ─────────────────────────────────────────────────────────────
    // Helper Methods
    // ─────────────────────────────────────────────────────────────

    /**
     * Calculate and set the next delivery date
     */
    public function calculateNextDeliveryDate(?Carbon $fromDate = null): Carbon
    {
        $fromDate ??= Carbon::today();
        $plan = $this->plan;

        if (! $plan) {
            return $fromDate->copy()->addDay();
        }

        $nextDate = $plan->getNextDeliveryDate($fromDate);

        // Skip vacation period
        if ($this->vacation_start && $this->vacation_end) {
            while ($nextDate->between($this->vacation_start, $this->vacation_end)) {
                $nextDate = $plan->getNextDeliveryDate($nextDate);
            }
        }

        return $nextDate;
    }

    /**
     * Check if subscription is due for delivery on given date
     */
    public function isDueForDelivery(?Carbon $date = null): bool
    {
        $date ??= Carbon::today();

        if ($this->status !== self::STATUS_ACTIVE) {
            return false;
        }

        if ($this->isOnVacation($date)) {
            return false;
        }

        return $this->next_delivery_date && $this->next_delivery_date->lte($date);
    }

    /**
     * Check if subscription is on vacation
     */
    public function isOnVacation(?Carbon $date = null): bool
    {
        $date ??= Carbon::today();

        if (! $this->vacation_start || ! $this->vacation_end) {
            return false;
        }

        return $date->between($this->vacation_start, $this->vacation_end);
    }

    /**
     * Check if subscription can be edited (current & previous month only)
     */
    public function canEdit(): bool
    {
        if ($this->status === self::STATUS_CANCELLED) {
            return false;
        }

        $now = Carbon::now();
        $currentMonth = $now->copy()->startOfMonth();
        $previousMonth = $now->copy()->subMonth()->startOfMonth();

        // Can edit if start_date is in current or previous month
        return $this->start_date->gte($previousMonth);
    }

    /**
     * Pause the subscription
     */
    public function pause(?Carbon $until = null): bool
    {
        if ($this->status !== self::STATUS_ACTIVE) {
            return false;
        }

        $this->status = self::STATUS_PAUSED;
        $this->paused_until = $until;

        return $this->save();
    }

    /**
     * Resume the subscription
     */
    public function resume(): bool
    {
        if ($this->status !== self::STATUS_PAUSED) {
            return false;
        }

        $this->status = self::STATUS_ACTIVE;
        $this->paused_until = null;
        $this->next_delivery_date = $this->calculateNextDeliveryDate();

        return $this->save();
    }

    /**
     * Cancel the subscription
     */
    public function cancel(?string $reason = null): bool
    {
        if ($this->status === self::STATUS_CANCELLED) {
            return false;
        }

        $this->status = self::STATUS_CANCELLED;
        $this->cancelled_at = Carbon::now();
        $this->cancellation_reason = $reason;

        return $this->save();
    }

    /**
     * Set vacation hold
     */
    public function setVacation(Carbon $start, Carbon $end): bool
    {
        if ($this->status !== self::STATUS_ACTIVE) {
            return false;
        }

        $this->vacation_start = $start;
        $this->vacation_end = $end;

        // Recalculate next delivery if it falls in vacation
        if ($this->next_delivery_date && $this->next_delivery_date->between($start, $end)) {
            $this->next_delivery_date = $this->calculateNextDeliveryDate($end);
        }

        return $this->save();
    }

    /**
     * Clear vacation hold
     */
    public function clearVacation(): bool
    {
        $this->vacation_start = null;
        $this->vacation_end = null;

        return $this->save();
    }

    /**
     * Get total subscription value
     */
    public function getTotalValue(): float
    {
        return $this->items()->active()->sum(\DB::raw('price * quantity'));
    }

    /**
     * Get status options
     *
     * @return array<string, string>
     */
    public static function statusOptions(): array
    {
        return [
            self::STATUS_ACTIVE => 'Active',
            self::STATUS_PAUSED => 'Paused',
            self::STATUS_CANCELLED => 'Cancelled',
            self::STATUS_EXPIRED => 'Expired',
        ];
    }

    /**
     * Get billing cycle options
     *
     * @return array<string, string>
     */
    public static function billingCycleOptions(): array
    {
        return [
            self::BILLING_WEEKLY => 'Weekly',
            self::BILLING_MONTHLY => 'Monthly',
        ];
    }
}
