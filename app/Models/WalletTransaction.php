<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class WalletTransaction extends Model
{
    public const TYPE_CREDIT = 'credit';

    public const TYPE_DEBIT = 'debit';

    public const TRANSACTION_RECHARGE = 'recharge';

    public const TRANSACTION_PAYMENT = 'payment';

    public const TRANSACTION_REFUND = 'refund';

    public const TRANSACTION_LOYALTY = 'loyalty';

    public const TRANSACTION_REFERRAL = 'referral';

    public const TRANSACTION_ADMIN_ADJUSTMENT = 'admin_adjustment';

    public const TRANSACTION_CASHBACK = 'cashback';

    public const STATUS_PENDING = 'pending';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_FAILED = 'failed';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'wallet_id',
        'user_id',
        'type',
        'amount',
        'balance_before',
        'balance_after',
        'transaction_type',
        'reference_id',
        'reference_type',
        'description',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'balance_before' => 'decimal:2',
            'balance_after' => 'decimal:2',
        ];
    }

    // Relationships

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reference(): MorphTo
    {
        return $this->morphTo('reference', 'reference_type', 'reference_id');
    }

    // Scopes

    public function scopeCredit($query)
    {
        return $query->where('type', self::TYPE_CREDIT);
    }

    public function scopeDebit($query)
    {
        return $query->where('type', self::TYPE_DEBIT);
    }

    public function scopeByTransactionType($query, string $type)
    {
        return $query->where('transaction_type', $type);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // Helper Methods

    public function isCredit(): bool
    {
        return $this->type === self::TYPE_CREDIT;
    }

    public function isDebit(): bool
    {
        return $this->type === self::TYPE_DEBIT;
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function getFormattedAmount(): string
    {
        $prefix = $this->isCredit() ? '+' : '-';

        return $prefix.'₹'.number_format($this->amount, 2);
    }

    public function getTypeLabel(): string
    {
        return match ($this->transaction_type) {
            self::TRANSACTION_RECHARGE => 'Wallet Recharge',
            self::TRANSACTION_PAYMENT => 'Order Payment',
            self::TRANSACTION_REFUND => 'Refund',
            self::TRANSACTION_LOYALTY => 'Loyalty Reward',
            self::TRANSACTION_REFERRAL => 'Referral Bonus',
            self::TRANSACTION_ADMIN_ADJUSTMENT => 'Admin Adjustment',
            self::TRANSACTION_CASHBACK => 'Cashback',
            default => ucfirst($this->transaction_type ?? 'Unknown'),
        };
    }

    /**
     * @return array<string, string>
     */
    public static function transactionTypeOptions(): array
    {
        return [
            self::TRANSACTION_RECHARGE => 'Wallet Recharge',
            self::TRANSACTION_PAYMENT => 'Order Payment',
            self::TRANSACTION_REFUND => 'Refund',
            self::TRANSACTION_LOYALTY => 'Loyalty Reward',
            self::TRANSACTION_REFERRAL => 'Referral Bonus',
            self::TRANSACTION_ADMIN_ADJUSTMENT => 'Admin Adjustment',
            self::TRANSACTION_CASHBACK => 'Cashback',
        ];
    }
}
