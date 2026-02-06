<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BottleLog extends Model
{
    public const ACTION_ISSUED = 'issued';

    public const ACTION_RETURNED = 'returned';

    public const ACTION_DAMAGED = 'damaged';

    public const ACTION_LOST = 'lost';

    public const ACTION_FOUND = 'found';

    public const ACTION_TRANSFERRED = 'transferred';

    public const ACTION_BY_SYSTEM = 'system';

    public const ACTION_BY_DRIVER = 'driver';

    public const ACTION_BY_ADMIN = 'admin';

    public const ACTION_BY_CUSTOMER = 'customer';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'bottle_id',
        'user_id',
        'subscription_id',
        'delivery_id',
        'action',
        'action_by',
        'action_by_id',
        'condition',
        'notes',
        'deposit_amount',
        'refund_amount',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'deposit_amount' => 'decimal:2',
            'refund_amount' => 'decimal:2',
        ];
    }

    // Relationships

    public function bottle(): BelongsTo
    {
        return $this->belongsTo(Bottle::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(Delivery::class);
    }

    // Scopes

    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    public function scopeByBottle($query, int $bottleId)
    {
        return $query->where('bottle_id', $bottleId);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function scopeIssued($query)
    {
        return $query->where('action', self::ACTION_ISSUED);
    }

    public function scopeReturned($query)
    {
        return $query->where('action', self::ACTION_RETURNED);
    }

    // Helper Methods

    /**
     * @return array<string, string>
     */
    public static function actionOptions(): array
    {
        return [
            self::ACTION_ISSUED => 'Issued',
            self::ACTION_RETURNED => 'Returned',
            self::ACTION_DAMAGED => 'Damaged',
            self::ACTION_LOST => 'Lost',
            self::ACTION_FOUND => 'Found',
            self::ACTION_TRANSFERRED => 'Transferred',
        ];
    }

    public function getActionLabel(): string
    {
        return self::actionOptions()[$this->action] ?? $this->action;
    }

    public function isIssue(): bool
    {
        return $this->action === self::ACTION_ISSUED;
    }

    public function isReturn(): bool
    {
        return $this->action === self::ACTION_RETURNED;
    }
}
