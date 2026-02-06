<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    public const TYPE_ONE_TIME = 'one_time';

    public const TYPE_SUBSCRIPTION = 'subscription';

    public const STATUS_PENDING = 'pending';

    public const STATUS_CONFIRMED = 'confirmed';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';

    public const STATUS_DELIVERED = 'delivered';

    public const STATUS_CANCELLED = 'cancelled';

    public const STATUS_REFUNDED = 'refunded';

    public const PAYMENT_PENDING = 'pending';

    public const PAYMENT_PAID = 'paid';

    public const PAYMENT_FAILED = 'failed';

    public const PAYMENT_REFUNDED = 'refunded';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'order_number',
        'user_id',
        'user_address_id',
        'subscription_id',
        'vertical',
        'type',
        'status',
        'subtotal',
        'discount',
        'delivery_charge',
        'total',
        'currency',
        'payment_status',
        'payment_method',
        'coupon_id',
        'coupon_code',
        'delivery_instructions',
        'scheduled_delivery_date',
        'scheduled_delivery_time',
        'driver_id',
        'delivered_at',
        'cancelled_at',
        'cancellation_reason',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
            'delivery_charge' => 'decimal:2',
            'total' => 'decimal:2',
            'scheduled_delivery_date' => 'date',
            'scheduled_delivery_time' => 'datetime:H:i',
            'delivered_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->order_number)) {
                $order->order_number = self::generateOrderNumber();
            }
        });
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
     * @return BelongsTo<Subscription, $this>
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * @return BelongsTo<Driver, $this>
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    /**
     * @return HasMany<Payment, $this>
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * @return HasOne<Delivery, $this>
     */
    public function delivery(): HasOne
    {
        return $this->hasOne(Delivery::class);
    }

    // ─────────────────────────────────────────────────────────────
    // Scopes
    // ─────────────────────────────────────────────────────────────

    /**
     * @param  Builder<Order>  $query
     * @return Builder<Order>
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * @param  Builder<Order>  $query
     * @return Builder<Order>
     */
    public function scopeConfirmed(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_CONFIRMED);
    }

    /**
     * @param  Builder<Order>  $query
     * @return Builder<Order>
     */
    public function scopeDelivered(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_DELIVERED);
    }

    /**
     * @param  Builder<Order>  $query
     * @return Builder<Order>
     */
    public function scopeCancelled(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_CANCELLED);
    }

    /**
     * @param  Builder<Order>  $query
     * @return Builder<Order>
     */
    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * @param  Builder<Order>  $query
     * @return Builder<Order>
     */
    public function scopeByDate(Builder $query, Carbon $date): Builder
    {
        return $query->whereDate('scheduled_delivery_date', $date);
    }

    /**
     * @param  Builder<Order>  $query
     * @return Builder<Order>
     */
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * @param  Builder<Order>  $query
     * @return Builder<Order>
     */
    public function scopeForVertical(Builder $query, string $vertical): Builder
    {
        return $query->where('vertical', $vertical);
    }

    /**
     * @param  Builder<Order>  $query
     * @return Builder<Order>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereNotIn('status', [self::STATUS_CANCELLED, self::STATUS_REFUNDED]);
    }

    // ─────────────────────────────────────────────────────────────
    // Helper Methods
    // ─────────────────────────────────────────────────────────────

    /**
     * Generate unique order number
     */
    public static function generateOrderNumber(): string
    {
        $year = date('Y');
        $prefix = 'FT';

        // Get the last order number for this year
        $lastOrder = self::where('order_number', 'like', "{$prefix}-{$year}-%")
            ->orderByDesc('id')
            ->first();

        if ($lastOrder) {
            $lastNumber = (int) substr($lastOrder->order_number, -6);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return sprintf('%s-%s-%06d', $prefix, $year, $newNumber);
    }

    /**
     * Check if order can be cancelled
     */
    public function canCancel(): bool
    {
        return in_array($this->status, [
            self::STATUS_PENDING,
            self::STATUS_CONFIRMED,
            self::STATUS_PROCESSING,
        ], true);
    }

    /**
     * Cancel the order
     */
    public function cancel(?string $reason = null): bool
    {
        if (! $this->canCancel()) {
            return false;
        }

        $this->status = self::STATUS_CANCELLED;
        $this->cancelled_at = Carbon::now();
        $this->cancellation_reason = $reason;

        return $this->save();
    }

    /**
     * Mark order as delivered
     */
    public function markAsDelivered(): bool
    {
        if ($this->status !== self::STATUS_OUT_FOR_DELIVERY) {
            return false;
        }

        $this->status = self::STATUS_DELIVERED;
        $this->delivered_at = Carbon::now();

        return $this->save();
    }

    /**
     * Update order status
     */
    public function updateStatus(string $status): bool
    {
        $this->status = $status;

        if ($status === self::STATUS_DELIVERED) {
            $this->delivered_at = Carbon::now();
        }

        if ($status === self::STATUS_CANCELLED) {
            $this->cancelled_at = Carbon::now();
        }

        return $this->save();
    }

    /**
     * Check if order is from subscription
     */
    public function isSubscriptionOrder(): bool
    {
        return $this->type === self::TYPE_SUBSCRIPTION;
    }

    /**
     * Get status options
     *
     * @return array<string, string>
     */
    public static function statusOptions(): array
    {
        return [
            self::STATUS_PENDING => 'Pending',
            self::STATUS_CONFIRMED => 'Confirmed',
            self::STATUS_PROCESSING => 'Processing',
            self::STATUS_OUT_FOR_DELIVERY => 'Out for Delivery',
            self::STATUS_DELIVERED => 'Delivered',
            self::STATUS_CANCELLED => 'Cancelled',
            self::STATUS_REFUNDED => 'Refunded',
        ];
    }

    /**
     * Get payment status options
     *
     * @return array<string, string>
     */
    public static function paymentStatusOptions(): array
    {
        return [
            self::PAYMENT_PENDING => 'Pending',
            self::PAYMENT_PAID => 'Paid',
            self::PAYMENT_FAILED => 'Failed',
            self::PAYMENT_REFUNDED => 'Refunded',
        ];
    }

    /**
     * Get type options
     *
     * @return array<string, string>
     */
    public static function typeOptions(): array
    {
        return [
            self::TYPE_ONE_TIME => 'One Time',
            self::TYPE_SUBSCRIPTION => 'Subscription',
        ];
    }
}
