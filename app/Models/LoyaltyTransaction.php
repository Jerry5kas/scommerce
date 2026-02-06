<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class LoyaltyTransaction extends Model
{
    use HasFactory;

    public const TYPE_EARNED = 'earned';

    public const TYPE_REDEEMED = 'redeemed';

    public const TYPE_EXPIRED = 'expired';

    public const TYPE_ADJUSTED = 'adjusted';

    public const SOURCE_DELIVERY = 'delivery';

    public const SOURCE_PURCHASE = 'purchase';

    public const SOURCE_REFERRAL = 'referral';

    public const SOURCE_PROMOTION = 'promotion';

    public const SOURCE_ADMIN = 'admin';

    public const SOURCE_CONVERSION = 'conversion';

    public const STATUS_PENDING = 'pending';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_CANCELLED = 'cancelled';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'loyalty_point_id',
        'user_id',
        'type',
        'points',
        'balance_before',
        'balance_after',
        'source',
        'reference_id',
        'reference_type',
        'description',
        'expires_at',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'points' => 'integer',
            'balance_before' => 'integer',
            'balance_after' => 'integer',
            'expires_at' => 'datetime',
        ];
    }

    // Relationships

    public function loyaltyPoint(): BelongsTo
    {
        return $this->belongsTo(LoyaltyPoint::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    // Scopes

    public function scopeEarned($query)
    {
        return $query->where('type', self::TYPE_EARNED);
    }

    public function scopeRedeemed($query)
    {
        return $query->where('type', self::TYPE_REDEEMED);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeBySource($query, string $source)
    {
        return $query->where('source', $source);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // Helper Methods

    public function isEarned(): bool
    {
        return $this->type === self::TYPE_EARNED;
    }

    public function isRedeemed(): bool
    {
        return $this->type === self::TYPE_REDEEMED;
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function getFormattedPoints(): string
    {
        $prefix = $this->points > 0 ? '+' : '';

        return $prefix.number_format($this->points);
    }

    public function getTypeLabel(): string
    {
        return match ($this->type) {
            self::TYPE_EARNED => 'Earned',
            self::TYPE_REDEEMED => 'Redeemed',
            self::TYPE_EXPIRED => 'Expired',
            self::TYPE_ADJUSTED => 'Adjusted',
            default => ucfirst($this->type),
        };
    }

    public function getSourceLabel(): string
    {
        return match ($this->source) {
            self::SOURCE_DELIVERY => 'Delivery',
            self::SOURCE_PURCHASE => 'Purchase',
            self::SOURCE_REFERRAL => 'Referral',
            self::SOURCE_PROMOTION => 'Promotion',
            self::SOURCE_ADMIN => 'Admin',
            self::SOURCE_CONVERSION => 'Wallet Conversion',
            default => ucfirst($this->source),
        };
    }

    /**
     * @return array<string, string>
     */
    public static function typeOptions(): array
    {
        return [
            self::TYPE_EARNED => 'Earned',
            self::TYPE_REDEEMED => 'Redeemed',
            self::TYPE_EXPIRED => 'Expired',
            self::TYPE_ADJUSTED => 'Adjusted',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function sourceOptions(): array
    {
        return [
            self::SOURCE_DELIVERY => 'Delivery',
            self::SOURCE_PURCHASE => 'Purchase',
            self::SOURCE_REFERRAL => 'Referral',
            self::SOURCE_PROMOTION => 'Promotion',
            self::SOURCE_ADMIN => 'Admin',
            self::SOURCE_CONVERSION => 'Wallet Conversion',
        ];
    }
}
