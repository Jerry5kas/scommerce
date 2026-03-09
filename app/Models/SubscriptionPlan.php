<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    use HasFactory;

    public const FREQUENCY_DAILY = 'daily';

    public const FREQUENCY_ALTERNATE = 'alternate';

    public const FREQUENCY_WEEKLY = 'weekly';

    public const FREQUENCY_CUSTOM = 'custom';

    public const DISCOUNT_NONE = 'none';

    public const DISCOUNT_PERCENTAGE = 'percentage';

    public const DISCOUNT_FLAT = 'flat';

    protected $fillable = [
        'name',
        'description',
        'frequency_type',
        'discount_type',
        'discount_value',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'discount_value' => 'decimal:2',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    // ─────────────────────────────────────────────────────────────
    // Relationships
    // ─────────────────────────────────────────────────────────────

    /**
     * @return HasMany<SubscriptionPlanItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(SubscriptionPlanItem::class);
    }

    /**
     * @return HasMany<SubscriptionPlanFeature, $this>
     */
    public function features(): HasMany
    {
        return $this->hasMany(SubscriptionPlanFeature::class);
    }

    /**
     * @return HasMany<Subscription, $this>
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    // ─────────────────────────────────────────────────────────────
    // Scopes
    // ─────────────────────────────────────────────────────────────

    /**
     * @param  Builder<SubscriptionPlan>  $query
     * @return Builder<SubscriptionPlan>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<SubscriptionPlan>  $query
     * @return Builder<SubscriptionPlan>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * @return array<string, string>
     */
    public static function frequencyOptions(): array
    {
        return [
            self::FREQUENCY_DAILY => 'Daily',
            self::FREQUENCY_ALTERNATE => 'Alternate Days',
            self::FREQUENCY_WEEKLY => 'Weekly',
            self::FREQUENCY_CUSTOM => 'Custom',
        ];
    }

    /**
     * Calculate next delivery date after the given date.
     */
    public function getNextDeliveryDate(Carbon $fromDate): Carbon
    {
        $date = $fromDate->copy();

        return match ($this->frequency_type) {
            self::FREQUENCY_ALTERNATE => $date->addDays(2),
            self::FREQUENCY_WEEKLY => $date->addWeek(),
            self::FREQUENCY_CUSTOM => $date->addDay(),
            default => $date->addDay(),
        };
    }

    /**
     * Check whether a specific date is a delivery date for this plan.
     */
    public function isDeliveryDate(Carbon $date, Carbon $startDate): bool
    {
        if ($date->lt($startDate)) {
            return false;
        }

        $dayDiff = $startDate->copy()->startOfDay()->diffInDays($date->copy()->startOfDay());

        return match ($this->frequency_type) {
            self::FREQUENCY_ALTERNATE => $dayDiff % 2 === 0,
            self::FREQUENCY_WEEKLY => $dayDiff % 7 === 0,
            self::FREQUENCY_CUSTOM => $dayDiff % 1 === 0,
            default => true,
        };
    }
}
