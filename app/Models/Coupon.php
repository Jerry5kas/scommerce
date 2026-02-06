<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    use HasFactory;

    public const TYPE_PERCENTAGE = 'percentage';

    public const TYPE_FIXED = 'fixed';

    public const TYPE_FREE_SHIPPING = 'free_shipping';

    public const APPLICABLE_ALL = 'all';

    public const APPLICABLE_PRODUCTS = 'products';

    public const APPLICABLE_CATEGORIES = 'categories';

    public const APPLICABLE_COLLECTIONS = 'collections';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'name',
        'description',
        'type',
        'value',
        'min_order_amount',
        'max_discount',
        'usage_limit',
        'usage_limit_per_user',
        'used_count',
        'is_active',
        'starts_at',
        'ends_at',
        'applicable_to',
        'applicable_ids',
        'exclude_free_samples',
        'exclude_subscriptions',
        'first_order_only',
        'new_users_only',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
            'min_order_amount' => 'decimal:2',
            'max_discount' => 'decimal:2',
            'usage_limit' => 'integer',
            'usage_limit_per_user' => 'integer',
            'used_count' => 'integer',
            'is_active' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'applicable_ids' => 'array',
            'exclude_free_samples' => 'boolean',
            'exclude_subscriptions' => 'boolean',
            'first_order_only' => 'boolean',
            'new_users_only' => 'boolean',
        ];
    }

    // Relationships

    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    // Scopes

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeValid($query)
    {
        $now = Carbon::now();

        return $query->active()
            ->where(function ($q) use ($now) {
                $q->whereNull('starts_at')
                    ->orWhere('starts_at', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('ends_at')
                    ->orWhere('ends_at', '>=', $now);
            })
            ->where(function ($q) {
                $q->whereNull('usage_limit')
                    ->orWhereColumn('used_count', '<', 'usage_limit');
            });
    }

    public function scopeByCode($query, string $code)
    {
        return $query->where('code', strtoupper($code));
    }

    // Helper Methods

    public function isValid(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->isExpired()) {
            return false;
        }

        if ($this->hasReachedLimit()) {
            return false;
        }

        return true;
    }

    public function isExpired(): bool
    {
        $now = Carbon::now();

        if ($this->starts_at && $this->starts_at->gt($now)) {
            return true; // Not started yet
        }

        if ($this->ends_at && $this->ends_at->lt($now)) {
            return true; // Expired
        }

        return false;
    }

    public function hasReachedLimit(): bool
    {
        if ($this->usage_limit === null) {
            return false;
        }

        return $this->used_count >= $this->usage_limit;
    }

    public function hasReachedUserLimit(User $user): bool
    {
        if ($this->usage_limit_per_user === null) {
            return false;
        }

        $userUsages = $this->usages()->where('user_id', $user->id)->count();

        return $userUsages >= $this->usage_limit_per_user;
    }

    public function canBeUsedBy(User $user): bool
    {
        // Check if user has reached their limit
        if ($this->hasReachedUserLimit($user)) {
            return false;
        }

        // First order only check
        if ($this->first_order_only) {
            if ($user->orders()->completed()->exists()) {
                return false;
            }
        }

        // New users only check (registered within last 7 days)
        if ($this->new_users_only) {
            if ($user->created_at->lt(Carbon::now()->subDays(7))) {
                return false;
            }
        }

        return true;
    }

    public function calculateDiscount(float $amount): float
    {
        if ($this->min_order_amount && $amount < $this->min_order_amount) {
            return 0;
        }

        $discount = match ($this->type) {
            self::TYPE_PERCENTAGE => $amount * ($this->value / 100),
            self::TYPE_FIXED => min($this->value, $amount),
            self::TYPE_FREE_SHIPPING => 0, // Handled separately
            default => 0,
        };

        // Apply max discount cap
        if ($this->max_discount && $discount > $this->max_discount) {
            $discount = $this->max_discount;
        }

        return round($discount, 2);
    }

    public function incrementUsage(): void
    {
        $this->increment('used_count');
    }

    public function isApplicableToProduct(Product $product): bool
    {
        if ($this->applicable_to === self::APPLICABLE_ALL) {
            return true;
        }

        if ($this->applicable_ids === null) {
            return true;
        }

        return match ($this->applicable_to) {
            self::APPLICABLE_PRODUCTS => in_array($product->id, $this->applicable_ids),
            self::APPLICABLE_CATEGORIES => in_array($product->category_id, $this->applicable_ids),
            self::APPLICABLE_COLLECTIONS => $product->collections()->whereIn('id', $this->applicable_ids)->exists(),
            default => true,
        };
    }

    public function getDiscountLabel(): string
    {
        return match ($this->type) {
            self::TYPE_PERCENTAGE => $this->value.'% off',
            self::TYPE_FIXED => '₹'.$this->value.' off',
            self::TYPE_FREE_SHIPPING => 'Free Shipping',
            default => 'Discount',
        };
    }

    /**
     * @return array<string, string>
     */
    public static function typeOptions(): array
    {
        return [
            self::TYPE_PERCENTAGE => 'Percentage',
            self::TYPE_FIXED => 'Fixed Amount',
            self::TYPE_FREE_SHIPPING => 'Free Shipping',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function applicableOptions(): array
    {
        return [
            self::APPLICABLE_ALL => 'All Products',
            self::APPLICABLE_PRODUCTS => 'Specific Products',
            self::APPLICABLE_CATEGORIES => 'Specific Categories',
            self::APPLICABLE_COLLECTIONS => 'Specific Collections',
        ];
    }
}
