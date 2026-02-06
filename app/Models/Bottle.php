<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bottle extends Model
{
    use HasFactory;

    public const TYPE_STANDARD = 'standard';

    public const TYPE_PREMIUM = 'premium';

    public const TYPE_CUSTOM = 'custom';

    public const STATUS_AVAILABLE = 'available';

    public const STATUS_ISSUED = 'issued';

    public const STATUS_RETURNED = 'returned';

    public const STATUS_DAMAGED = 'damaged';

    public const STATUS_LOST = 'lost';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'bottle_number',
        'barcode',
        'type',
        'capacity',
        'status',
        'current_user_id',
        'current_subscription_id',
        'purchase_cost',
        'deposit_amount',
        'issued_at',
        'returned_at',
        'damaged_at',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'capacity' => 'decimal:2',
            'purchase_cost' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'issued_at' => 'datetime',
            'returned_at' => 'datetime',
            'damaged_at' => 'datetime',
        ];
    }

    // Relationships

    public function currentUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'current_user_id');
    }

    public function currentSubscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class, 'current_subscription_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(BottleLog::class)->orderByDesc('created_at');
    }

    // Scopes

    public function scopeAvailable($query)
    {
        return $query->where('status', self::STATUS_AVAILABLE);
    }

    public function scopeIssued($query)
    {
        return $query->where('status', self::STATUS_ISSUED);
    }

    public function scopeReturned($query)
    {
        return $query->where('status', self::STATUS_RETURNED);
    }

    public function scopeDamaged($query)
    {
        return $query->where('status', self::STATUS_DAMAGED);
    }

    public function scopeLost($query)
    {
        return $query->where('status', self::STATUS_LOST);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('current_user_id', $userId);
    }

    public function scopeForSubscription($query, int $subscriptionId)
    {
        return $query->where('current_subscription_id', $subscriptionId);
    }

    // Helper Methods

    public function issueTo(User $user, ?Subscription $subscription = null): self
    {
        if ($this->status !== self::STATUS_AVAILABLE) {
            throw new \InvalidArgumentException('Bottle is not available for issue.');
        }

        $this->update([
            'status' => self::STATUS_ISSUED,
            'current_user_id' => $user->id,
            'current_subscription_id' => $subscription?->id,
            'issued_at' => now(),
            'returned_at' => null,
        ]);

        return $this;
    }

    public function returnBottle(string $condition = 'good'): self
    {
        if ($this->status !== self::STATUS_ISSUED) {
            throw new \InvalidArgumentException('Bottle is not issued.');
        }

        $newStatus = $condition === 'damaged' ? self::STATUS_DAMAGED : self::STATUS_AVAILABLE;

        $this->update([
            'status' => $newStatus,
            'current_user_id' => null,
            'current_subscription_id' => null,
            'returned_at' => now(),
            'damaged_at' => $condition === 'damaged' ? now() : null,
        ]);

        return $this;
    }

    public function markAsDamaged(string $reason): self
    {
        $this->update([
            'status' => self::STATUS_DAMAGED,
            'damaged_at' => now(),
            'notes' => $reason,
        ]);

        return $this;
    }

    public function markAsLost(): self
    {
        $this->update([
            'status' => self::STATUS_LOST,
            'notes' => 'Marked as lost on '.now()->toDateTimeString(),
        ]);

        return $this;
    }

    public function markAsAvailable(): self
    {
        $this->update([
            'status' => self::STATUS_AVAILABLE,
            'current_user_id' => null,
            'current_subscription_id' => null,
        ]);

        return $this;
    }

    public function isAvailable(): bool
    {
        return $this->status === self::STATUS_AVAILABLE;
    }

    public function isIssued(): bool
    {
        return $this->status === self::STATUS_ISSUED;
    }

    public function isDamaged(): bool
    {
        return $this->status === self::STATUS_DAMAGED;
    }

    public function isLost(): bool
    {
        return $this->status === self::STATUS_LOST;
    }

    /**
     * @return array<string, string>
     */
    public static function statusOptions(): array
    {
        return [
            self::STATUS_AVAILABLE => 'Available',
            self::STATUS_ISSUED => 'Issued',
            self::STATUS_RETURNED => 'Returned',
            self::STATUS_DAMAGED => 'Damaged',
            self::STATUS_LOST => 'Lost',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function typeOptions(): array
    {
        return [
            self::TYPE_STANDARD => 'Standard',
            self::TYPE_PREMIUM => 'Premium',
            self::TYPE_CUSTOM => 'Custom',
        ];
    }

    public function getStatusLabel(): string
    {
        return self::statusOptions()[$this->status] ?? $this->status;
    }

    public function getTypeLabel(): string
    {
        return self::typeOptions()[$this->type] ?? $this->type;
    }

    /**
     * Generate next bottle number
     */
    public static function generateBottleNumber(): string
    {
        $lastBottle = self::orderByDesc('id')->first();
        $nextNumber = $lastBottle ? ((int) substr($lastBottle->bottle_number, 3)) + 1 : 1;

        return 'BTL'.str_pad((string) $nextNumber, 6, '0', STR_PAD_LEFT);
    }
}
