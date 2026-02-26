<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class SubscriptionPlan extends Model
{
    use HasFactory;

    public const FREQUENCY_DAILY = 'daily';

    public const FREQUENCY_ALTERNATE_DAYS = 'alternate_days';

    public const FREQUENCY_WEEKLY = 'weekly';

    public const FREQUENCY_CUSTOM = 'custom';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'frequency_type',
        'frequency_value',
        'days_of_week',
        'discount_percent',
        'prices',
        'min_deliveries',
        'is_active',
        'display_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'days_of_week'     => 'array',
            'prices'           => 'array',
            'discount_percent' => 'decimal:2',
            'min_deliveries'   => 'integer',
            'is_active'        => 'boolean',
            'display_order'    => 'integer',
            'frequency_value'  => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (SubscriptionPlan $plan) {
            if (empty($plan->slug)) {
                $plan->slug = Str::slug($plan->name);
            }
        });
    }

    // ─────────────────────────────────────────────────────────────
    // Relationships
    // ─────────────────────────────────────────────────────────────

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
        return $query->orderBy('display_order')->orderBy('name');
    }

    // ─────────────────────────────────────────────────────────────
    // Helper Methods
    // ─────────────────────────────────────────────────────────────

    /**
     * Calculate next delivery date from a given date
     */
    public function getNextDeliveryDate(Carbon $fromDate): Carbon
    {
        return match ($this->frequency_type) {
            self::FREQUENCY_DAILY => $fromDate->copy()->addDay(),
            self::FREQUENCY_ALTERNATE_DAYS => $fromDate->copy()->addDays(2),
            self::FREQUENCY_WEEKLY => $this->getNextWeeklyDeliveryDate($fromDate),
            self::FREQUENCY_CUSTOM => $fromDate->copy()->addDays($this->frequency_value ?? 1),
            default => $fromDate->copy()->addDay(),
        };
    }

    /**
     * Get next weekly delivery date based on days_of_week
     */
    protected function getNextWeeklyDeliveryDate(Carbon $fromDate): Carbon
    {
        $daysOfWeek = $this->days_of_week ?? [1]; // Default to Monday

        $current = $fromDate->copy()->addDay();
        for ($i = 0; $i < 7; $i++) {
            if (in_array($current->dayOfWeek, $daysOfWeek, true)) {
                return $current;
            }
            $current->addDay();
        }

        return $fromDate->copy()->addWeek();
    }

    /**
     * Check if a given date is a delivery date for this plan
     */
    public function isDeliveryDate(Carbon $date, Carbon $startDate): bool
    {
        return match ($this->frequency_type) {
            self::FREQUENCY_DAILY => true,
            self::FREQUENCY_ALTERNATE_DAYS => $startDate->diffInDays($date) % 2 === 0,
            self::FREQUENCY_WEEKLY => in_array($date->dayOfWeek, $this->days_of_week ?? [], true),
            self::FREQUENCY_CUSTOM => $startDate->diffInDays($date) % ($this->frequency_value ?? 1) === 0,
            default => true,
        };
    }

    /**
     * Get all delivery dates for a month
     *
     * @return array<Carbon>
     */
    public function getDeliveryDatesForMonth(int $year, int $month, Carbon $startDate): array
    {
        $dates = [];
        $start = Carbon::create($year, $month, 1);
        $end = $start->copy()->endOfMonth();

        // If subscription started after the month started, use start date
        if ($startDate->gt($start)) {
            $start = $startDate->copy();
        }

        $current = $start->copy();
        while ($current->lte($end)) {
            if ($this->isDeliveryDate($current, $startDate)) {
                $dates[] = $current->copy();
            }
            $current->addDay();
        }

        return $dates;
    }

    /**
     * Get frequency type options
     *
     * @return array<string, string>
     */
    public static function frequencyOptions(): array
    {
        return [
            self::FREQUENCY_DAILY => 'Daily',
            self::FREQUENCY_ALTERNATE_DAYS => 'Alternate Days',
            self::FREQUENCY_WEEKLY => 'Weekly',
            self::FREQUENCY_CUSTOM => 'Custom',
        ];
    }
}
