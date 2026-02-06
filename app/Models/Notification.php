<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory, HasUuids;

    public const CHANNEL_SMS = 'sms';

    public const CHANNEL_WHATSAPP = 'whatsapp';

    public const CHANNEL_PUSH = 'push';

    public const CHANNEL_EMAIL = 'email';

    public const CHANNEL_IN_APP = 'in_app';

    public const CHANNEL_DATABASE = 'database';

    public const STATUS_PENDING = 'pending';

    public const STATUS_SENT = 'sent';

    public const STATUS_FAILED = 'failed';

    public const STATUS_DELIVERED = 'delivered';

    public const STATUS_READ = 'read';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'channel',
        'title',
        'message',
        'data',
        'status',
        'scheduled_at',
        'sent_at',
        'delivered_at',
        'read_at',
        'failure_reason',
        'retry_count',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'data' => 'array',
            'scheduled_at' => 'datetime',
            'sent_at' => 'datetime',
            'delivered_at' => 'datetime',
            'read_at' => 'datetime',
            'retry_count' => 'integer',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeSent($query)
    {
        return $query->where('status', self::STATUS_SENT);
    }

    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_FAILED);
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByChannel($query, string $channel)
    {
        return $query->where('channel', $channel);
    }

    public function scopeScheduled($query)
    {
        return $query->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', now())
            ->where('status', self::STATUS_PENDING);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Helper Methods

    public function markAsSent(): bool
    {
        return $this->update([
            'status' => self::STATUS_SENT,
            'sent_at' => now(),
        ]);
    }

    public function markAsDelivered(): bool
    {
        return $this->update([
            'status' => self::STATUS_DELIVERED,
            'delivered_at' => now(),
        ]);
    }

    public function markAsRead(): bool
    {
        if ($this->read_at) {
            return true;
        }

        return $this->update([
            'status' => self::STATUS_READ,
            'read_at' => now(),
        ]);
    }

    public function markAsFailed(string $reason): bool
    {
        return $this->update([
            'status' => self::STATUS_FAILED,
            'failure_reason' => $reason,
        ]);
    }

    public function incrementRetry(): void
    {
        $this->increment('retry_count');
    }

    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    /**
     * @return array<string, string>
     */
    public static function channelOptions(): array
    {
        return [
            self::CHANNEL_SMS => 'SMS',
            self::CHANNEL_WHATSAPP => 'WhatsApp',
            self::CHANNEL_PUSH => 'Push',
            self::CHANNEL_EMAIL => 'Email',
            self::CHANNEL_IN_APP => 'In-App',
            self::CHANNEL_DATABASE => 'Database',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function statusOptions(): array
    {
        return [
            self::STATUS_PENDING => 'Pending',
            self::STATUS_SENT => 'Sent',
            self::STATUS_FAILED => 'Failed',
            self::STATUS_DELIVERED => 'Delivered',
            self::STATUS_READ => 'Read',
        ];
    }
}
