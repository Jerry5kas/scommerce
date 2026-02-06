<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Referral extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_CANCELLED = 'cancelled';

    public const CRITERIA_FIRST_ORDER = 'first_order';

    public const CRITERIA_FIRST_DELIVERY = 'first_delivery';

    public const CRITERIA_FIRST_SUBSCRIPTION = 'first_subscription';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'referrer_id',
        'referred_id',
        'referral_code',
        'status',
        'completed_at',
        'completion_criteria',
        'referrer_reward',
        'referred_reward',
        'referrer_reward_paid',
        'referred_reward_paid',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
            'referrer_reward' => 'decimal:2',
            'referred_reward' => 'decimal:2',
            'referrer_reward_paid' => 'boolean',
            'referred_reward_paid' => 'boolean',
        ];
    }

    // Relationships

    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referred(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_id');
    }

    // Scopes

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', self::STATUS_CANCELLED);
    }

    public function scopeByReferrer($query, int $userId)
    {
        return $query->where('referrer_id', $userId);
    }

    public function scopeByReferred($query, int $userId)
    {
        return $query->where('referred_id', $userId);
    }

    public function scopeUnpaidRewards($query)
    {
        return $query->completed()
            ->where(function ($q) {
                $q->where('referrer_reward_paid', false)
                    ->orWhere('referred_reward_paid', false);
            });
    }

    // Helper Methods

    public function markAsCompleted(?string $criteria = null): bool
    {
        if ($this->status === self::STATUS_COMPLETED) {
            return false;
        }

        $this->update([
            'status' => self::STATUS_COMPLETED,
            'completed_at' => now(),
            'completion_criteria' => $criteria ?? $this->completion_criteria,
        ]);

        return true;
    }

    public function markReferrerRewardPaid(): bool
    {
        return $this->update(['referrer_reward_paid' => true]);
    }

    public function markReferredRewardPaid(): bool
    {
        return $this->update(['referred_reward_paid' => true]);
    }

    public function cancel(?string $reason = null): bool
    {
        if ($this->status !== self::STATUS_PENDING) {
            return false;
        }

        $this->update([
            'status' => self::STATUS_CANCELLED,
            'notes' => $reason,
        ]);

        return true;
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function isCancelled(): bool
    {
        return $this->status === self::STATUS_CANCELLED;
    }

    public function hasUnpaidRewards(): bool
    {
        if ($this->status !== self::STATUS_COMPLETED) {
            return false;
        }

        return ($this->referrer_reward > 0 && ! $this->referrer_reward_paid)
            || ($this->referred_reward > 0 && ! $this->referred_reward_paid);
    }

    /**
     * @return array<string, string>
     */
    public static function statusOptions(): array
    {
        return [
            self::STATUS_PENDING => 'Pending',
            self::STATUS_COMPLETED => 'Completed',
            self::STATUS_CANCELLED => 'Cancelled',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function criteriaOptions(): array
    {
        return [
            self::CRITERIA_FIRST_ORDER => 'First Order',
            self::CRITERIA_FIRST_DELIVERY => 'First Delivery',
            self::CRITERIA_FIRST_SUBSCRIPTION => 'First Subscription',
        ];
    }
}
