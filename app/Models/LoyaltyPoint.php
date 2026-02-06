<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LoyaltyPoint extends Model
{
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'points',
        'total_earned',
        'total_redeemed',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'points' => 'integer',
            'total_earned' => 'integer',
            'total_redeemed' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(LoyaltyTransaction::class)->orderByDesc('created_at');
    }

    // Scopes

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Helper Methods

    public function addPoints(int $amount, string $source, ?string $description = null, ?Model $reference = null): LoyaltyTransaction
    {
        $balanceBefore = $this->points;
        $balanceAfter = $balanceBefore + $amount;

        $this->update([
            'points' => $balanceAfter,
            'total_earned' => $this->total_earned + $amount,
        ]);

        return $this->transactions()->create([
            'user_id' => $this->user_id,
            'type' => LoyaltyTransaction::TYPE_EARNED,
            'points' => $amount,
            'balance_before' => $balanceBefore,
            'balance_after' => $balanceAfter,
            'source' => $source,
            'reference_id' => $reference?->id,
            'reference_type' => $reference ? get_class($reference) : null,
            'description' => $description,
            'status' => LoyaltyTransaction::STATUS_COMPLETED,
        ]);
    }

    public function deductPoints(int $amount, string $source, ?string $description = null, ?Model $reference = null): LoyaltyTransaction
    {
        if ($amount > $this->points) {
            throw new \InvalidArgumentException('Insufficient points balance.');
        }

        $balanceBefore = $this->points;
        $balanceAfter = $balanceBefore - $amount;

        $this->update([
            'points' => $balanceAfter,
            'total_redeemed' => $this->total_redeemed + $amount,
        ]);

        return $this->transactions()->create([
            'user_id' => $this->user_id,
            'type' => LoyaltyTransaction::TYPE_REDEEMED,
            'points' => -$amount,
            'balance_before' => $balanceBefore,
            'balance_after' => $balanceAfter,
            'source' => $source,
            'reference_id' => $reference?->id,
            'reference_type' => $reference ? get_class($reference) : null,
            'description' => $description,
            'status' => LoyaltyTransaction::STATUS_COMPLETED,
        ]);
    }

    public function getBalance(): int
    {
        return $this->points;
    }

    public function hasSufficientPoints(int $amount): bool
    {
        return $this->points >= $amount;
    }

    public function getFormattedBalance(): string
    {
        return number_format($this->points);
    }
}
