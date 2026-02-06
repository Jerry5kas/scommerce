<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    public const METHOD_GATEWAY = 'gateway';

    public const METHOD_WALLET = 'wallet';

    public const METHOD_COD = 'cod';

    public const METHOD_SPLIT = 'split';

    public const STATUS_PENDING = 'pending';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_FAILED = 'failed';

    public const STATUS_REFUNDED = 'refunded';

    public const STATUS_PARTIALLY_REFUNDED = 'partially_refunded';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'user_id',
        'payment_id',
        'amount',
        'currency',
        'method',
        'gateway',
        'status',
        'gateway_response',
        'failure_reason',
        'refunded_amount',
        'refunded_at',
        'paid_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'refunded_amount' => 'decimal:2',
            'gateway_response' => 'array',
            'refunded_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    // Relationships

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', self::STATUS_PROCESSING);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_FAILED);
    }

    public function scopeRefunded($query)
    {
        return $query->whereIn('status', [self::STATUS_REFUNDED, self::STATUS_PARTIALLY_REFUNDED]);
    }

    public function scopeByGateway($query, string $gateway)
    {
        return $query->where('gateway', $gateway);
    }

    public function scopeByMethod($query, string $method)
    {
        return $query->where('method', $method);
    }

    // Helper Methods

    public function isSuccessful(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function isPending(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_PROCESSING], true);
    }

    public function isFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    public function canRefund(): bool
    {
        if (! $this->isSuccessful()) {
            return false;
        }

        return $this->refunded_amount < $this->amount;
    }

    public function getRemainingRefundableAmount(): float
    {
        return (float) ($this->amount - $this->refunded_amount);
    }

    public function markAsCompleted(array $gatewayResponse = []): self
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'paid_at' => now(),
            'gateway_response' => $gatewayResponse,
        ]);

        return $this;
    }

    public function markAsFailed(string $reason, array $gatewayResponse = []): self
    {
        $this->update([
            'status' => self::STATUS_FAILED,
            'failure_reason' => $reason,
            'gateway_response' => $gatewayResponse,
        ]);

        return $this;
    }

    public function processRefund(float $amount): self
    {
        $newRefundedAmount = $this->refunded_amount + $amount;

        $this->update([
            'refunded_amount' => $newRefundedAmount,
            'refunded_at' => now(),
            'status' => $newRefundedAmount >= $this->amount
                ? self::STATUS_REFUNDED
                : self::STATUS_PARTIALLY_REFUNDED,
        ]);

        return $this;
    }

    /**
     * @return array<string, string>
     */
    public static function statusOptions(): array
    {
        return [
            self::STATUS_PENDING => 'Pending',
            self::STATUS_PROCESSING => 'Processing',
            self::STATUS_COMPLETED => 'Completed',
            self::STATUS_FAILED => 'Failed',
            self::STATUS_REFUNDED => 'Refunded',
            self::STATUS_PARTIALLY_REFUNDED => 'Partially Refunded',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function methodOptions(): array
    {
        return [
            self::METHOD_GATEWAY => 'Online Payment',
            self::METHOD_WALLET => 'Wallet',
            self::METHOD_COD => 'Cash on Delivery',
            self::METHOD_SPLIT => 'Split Payment',
        ];
    }
}
