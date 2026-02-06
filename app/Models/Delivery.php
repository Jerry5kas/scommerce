<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Delivery extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_ASSIGNED = 'assigned';

    public const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';

    public const STATUS_DELIVERED = 'delivered';

    public const STATUS_FAILED = 'failed';

    public const STATUS_CANCELLED = 'cancelled';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'driver_id',
        'user_id',
        'user_address_id',
        'zone_id',
        'status',
        'scheduled_date',
        'scheduled_time',
        'time_slot',
        'assigned_at',
        'dispatched_at',
        'delivered_at',
        'delivery_proof_image',
        'delivery_proof_verified',
        'delivery_proof_verified_by',
        'delivery_proof_verified_at',
        'failure_reason',
        'delivery_instructions',
        'customer_signature',
        'notes',
        'sequence',
        'estimated_distance',
        'estimated_time',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scheduled_date' => 'date',
            'scheduled_time' => 'datetime:H:i',
            'assigned_at' => 'datetime',
            'dispatched_at' => 'datetime',
            'delivered_at' => 'datetime',
            'delivery_proof_verified' => 'boolean',
            'delivery_proof_verified_at' => 'datetime',
            'estimated_distance' => 'decimal:2',
            'estimated_time' => 'integer',
            'sequence' => 'integer',
        ];
    }

    // Relationships

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(UserAddress::class, 'user_address_id');
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'delivery_proof_verified_by');
    }

    public function trackingHistory(): HasMany
    {
        return $this->hasMany(DeliveryTracking::class)->orderByDesc('tracked_at');
    }

    // Scopes

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeAssigned($query)
    {
        return $query->where('status', self::STATUS_ASSIGNED);
    }

    public function scopeOutForDelivery($query)
    {
        return $query->where('status', self::STATUS_OUT_FOR_DELIVERY);
    }

    public function scopeDelivered($query)
    {
        return $query->where('status', self::STATUS_DELIVERED);
    }

    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_FAILED);
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', self::STATUS_CANCELLED);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByDate($query, $date)
    {
        return $query->whereDate('scheduled_date', $date);
    }

    public function scopeByDriver($query, int $driverId)
    {
        return $query->where('driver_id', $driverId);
    }

    public function scopeByZone($query, int $zoneId)
    {
        return $query->where('zone_id', $zoneId);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeUnassigned($query)
    {
        return $query->where('status', self::STATUS_PENDING)->whereNull('driver_id');
    }

    public function scopeUpcoming($query)
    {
        return $query->whereDate('scheduled_date', '>=', now()->toDateString())
            ->whereNotIn('status', [self::STATUS_DELIVERED, self::STATUS_FAILED, self::STATUS_CANCELLED]);
    }

    public function scopeNeedsProofVerification($query)
    {
        return $query->where('status', self::STATUS_DELIVERED)
            ->whereNotNull('delivery_proof_image')
            ->where('delivery_proof_verified', false);
    }

    // Helper Methods

    public function canAssignDriver(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_ASSIGNED], true);
    }

    public function assignDriver(Driver $driver): self
    {
        if (! $this->canAssignDriver()) {
            throw new \InvalidArgumentException('Cannot assign driver to this delivery.');
        }

        $this->update([
            'driver_id' => $driver->id,
            'status' => self::STATUS_ASSIGNED,
            'assigned_at' => now(),
        ]);

        return $this;
    }

    public function markAsOutForDelivery(): self
    {
        if ($this->status !== self::STATUS_ASSIGNED) {
            throw new \InvalidArgumentException('Delivery must be assigned before dispatching.');
        }

        if (! $this->driver_id) {
            throw new \InvalidArgumentException('No driver assigned to this delivery.');
        }

        $this->update([
            'status' => self::STATUS_OUT_FOR_DELIVERY,
            'dispatched_at' => now(),
        ]);

        // Update order status
        $this->order->update(['status' => Order::STATUS_OUT_FOR_DELIVERY]);

        return $this;
    }

    public function markAsDelivered(string $proofImage): self
    {
        if ($this->status !== self::STATUS_OUT_FOR_DELIVERY) {
            throw new \InvalidArgumentException('Delivery must be out for delivery to be completed.');
        }

        if (empty($proofImage)) {
            throw new \InvalidArgumentException('Proof image is required to complete delivery.');
        }

        $this->update([
            'status' => self::STATUS_DELIVERED,
            'delivered_at' => now(),
            'delivery_proof_image' => $proofImage,
        ]);

        // Update order status
        $this->order->markAsDelivered();

        return $this;
    }

    public function markAsFailed(string $reason): self
    {
        if (! in_array($this->status, [self::STATUS_ASSIGNED, self::STATUS_OUT_FOR_DELIVERY], true)) {
            throw new \InvalidArgumentException('Cannot mark this delivery as failed.');
        }

        $this->update([
            'status' => self::STATUS_FAILED,
            'failure_reason' => $reason,
        ]);

        return $this;
    }

    public function cancel(): self
    {
        if (in_array($this->status, [self::STATUS_DELIVERED, self::STATUS_CANCELLED], true)) {
            throw new \InvalidArgumentException('Cannot cancel this delivery.');
        }

        $this->update([
            'status' => self::STATUS_CANCELLED,
        ]);

        return $this;
    }

    public function verifyProof(Admin $admin): self
    {
        if (! $this->delivery_proof_image) {
            throw new \InvalidArgumentException('No proof image to verify.');
        }

        $this->update([
            'delivery_proof_verified' => true,
            'delivery_proof_verified_by' => $admin->id,
            'delivery_proof_verified_at' => now(),
        ]);

        return $this;
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isAssigned(): bool
    {
        return $this->status === self::STATUS_ASSIGNED;
    }

    public function isOutForDelivery(): bool
    {
        return $this->status === self::STATUS_OUT_FOR_DELIVERY;
    }

    public function isDelivered(): bool
    {
        return $this->status === self::STATUS_DELIVERED;
    }

    public function isFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    public function isCancelled(): bool
    {
        return $this->status === self::STATUS_CANCELLED;
    }

    public function isComplete(): bool
    {
        return in_array($this->status, [self::STATUS_DELIVERED, self::STATUS_FAILED, self::STATUS_CANCELLED], true);
    }

    public function hasProof(): bool
    {
        return ! empty($this->delivery_proof_image);
    }

    public function isProofVerified(): bool
    {
        return $this->delivery_proof_verified;
    }

    public function getLatestLocation(): ?DeliveryTracking
    {
        return $this->trackingHistory()->first();
    }

    /**
     * @return array<string, string>
     */
    public static function statusOptions(): array
    {
        return [
            self::STATUS_PENDING => 'Pending',
            self::STATUS_ASSIGNED => 'Assigned',
            self::STATUS_OUT_FOR_DELIVERY => 'Out for Delivery',
            self::STATUS_DELIVERED => 'Delivered',
            self::STATUS_FAILED => 'Failed',
            self::STATUS_CANCELLED => 'Cancelled',
        ];
    }

    public function getStatusLabel(): string
    {
        return self::statusOptions()[$this->status] ?? $this->status;
    }
}
