<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'balance',
        'currency',
        'is_active',
        'low_balance_threshold',
        'auto_recharge_enabled',
        'auto_recharge_amount',
        'auto_recharge_threshold',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'balance' => 'decimal:2',
            'low_balance_threshold' => 'decimal:2',
            'auto_recharge_amount' => 'decimal:2',
            'auto_recharge_threshold' => 'decimal:2',
            'is_active' => 'boolean',
            'auto_recharge_enabled' => 'boolean',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    // Scopes

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeWithAutoRecharge($query)
    {
        return $query->where('auto_recharge_enabled', true);
    }

    public function scopeLowBalance($query)
    {
        return $query->whereRaw('balance <= low_balance_threshold');
    }

    public function scopeBelowAutoRechargeThreshold($query)
    {
        return $query->where('auto_recharge_enabled', true)
            ->whereRaw('balance <= auto_recharge_threshold');
    }

    // Helper Methods

    public function hasSufficientBalance(float $amount): bool
    {
        return $this->is_active && $this->balance >= $amount;
    }

    public function isLowBalance(): bool
    {
        return $this->balance <= $this->low_balance_threshold;
    }

    public function needsAutoRecharge(): bool
    {
        if (! $this->auto_recharge_enabled || ! $this->auto_recharge_threshold) {
            return false;
        }

        return $this->balance <= $this->auto_recharge_threshold;
    }

    public function deduct(float $amount, string $description, ?string $referenceId = null, ?string $referenceType = null): WalletTransaction
    {
        $balanceBefore = $this->balance;
        $this->balance -= $amount;
        $this->save();

        return $this->transactions()->create([
            'user_id' => $this->user_id,
            'type' => 'debit',
            'amount' => $amount,
            'balance_before' => $balanceBefore,
            'balance_after' => $this->balance,
            'transaction_type' => 'payment',
            'reference_id' => $referenceId,
            'reference_type' => $referenceType,
            'description' => $description,
            'status' => 'completed',
        ]);
    }

    public function add(float $amount, string $transactionType, string $description, ?string $referenceId = null, ?string $referenceType = null): WalletTransaction
    {
        $balanceBefore = $this->balance;
        $this->balance += $amount;
        $this->save();

        return $this->transactions()->create([
            'user_id' => $this->user_id,
            'type' => 'credit',
            'amount' => $amount,
            'balance_before' => $balanceBefore,
            'balance_after' => $this->balance,
            'transaction_type' => $transactionType,
            'reference_id' => $referenceId,
            'reference_type' => $referenceType,
            'description' => $description,
            'status' => 'completed',
        ]);
    }

    public function recharge(float $amount, string $description = 'Wallet recharge', ?string $referenceId = null): WalletTransaction
    {
        return $this->add($amount, 'recharge', $description, $referenceId, Payment::class);
    }

    public function refund(float $amount, string $description = 'Order refund', ?string $referenceId = null): WalletTransaction
    {
        return $this->add($amount, 'refund', $description, $referenceId, Order::class);
    }

    public function payForOrder(float $amount, Order $order): WalletTransaction
    {
        return $this->deduct(
            $amount,
            "Payment for Order #{$order->order_number}",
            (string) $order->id,
            Order::class
        );
    }

    public function setAutoRecharge(bool $enabled, ?float $amount = null, ?float $threshold = null): self
    {
        $this->update([
            'auto_recharge_enabled' => $enabled,
            'auto_recharge_amount' => $enabled ? $amount : null,
            'auto_recharge_threshold' => $enabled ? $threshold : null,
        ]);

        return $this;
    }

    public function getFormattedBalance(): string
    {
        return '₹'.number_format($this->balance, 2);
    }
}
