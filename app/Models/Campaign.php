<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Campaign extends Model
{
    use HasFactory;

    public const TYPE_WALLET_REMINDER = 'wallet_reminder';

    public const TYPE_SUBSCRIPTION_RENEWAL = 'subscription_renewal';

    public const TYPE_OFFER = 'offer';

    public const TYPE_PROMOTIONAL = 'promotional';

    public const TYPE_TRANSACTIONAL = 'transactional';

    public const CHANNEL_SMS = 'sms';

    public const CHANNEL_WHATSAPP = 'whatsapp';

    public const CHANNEL_PUSH = 'push';

    public const CHANNEL_EMAIL = 'email';

    public const CHANNEL_ALL = 'all';

    public const STATUS_DRAFT = 'draft';

    public const STATUS_SCHEDULED = 'scheduled';

    public const STATUS_SENDING = 'sending';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_CANCELLED = 'cancelled';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'type',
        'channel',
        'subject',
        'message_template',
        'target_audience',
        'scheduled_at',
        'sent_at',
        'status',
        'total_recipients',
        'sent_count',
        'failed_count',
        'created_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'target_audience' => 'array',
            'scheduled_at' => 'datetime',
            'sent_at' => 'datetime',
            'total_recipients' => 'integer',
            'sent_count' => 'integer',
            'failed_count' => 'integer',
        ];
    }

    // Relationships

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes

    public function scopeDraft($query)
    {
        return $query->where('status', self::STATUS_DRAFT);
    }

    public function scopeScheduled($query)
    {
        return $query->where('status', self::STATUS_SCHEDULED);
    }

    public function scopeSending($query)
    {
        return $query->where('status', self::STATUS_SENDING);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', [self::STATUS_SCHEDULED, self::STATUS_SENDING]);
    }

    public function scopeDueForSending($query)
    {
        return $query->where('status', self::STATUS_SCHEDULED)
            ->where('scheduled_at', '<=', now());
    }

    // Helper Methods

    public function canSend(): bool
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_SCHEDULED]);
    }

    public function canCancel(): bool
    {
        return in_array($this->status, [self::STATUS_SCHEDULED, self::STATUS_SENDING]);
    }

    public function markAsSending(): bool
    {
        return $this->update([
            'status' => self::STATUS_SENDING,
        ]);
    }

    public function markAsCompleted(): bool
    {
        return $this->update([
            'status' => self::STATUS_COMPLETED,
            'sent_at' => now(),
        ]);
    }

    public function markAsCancelled(): bool
    {
        return $this->update([
            'status' => self::STATUS_CANCELLED,
        ]);
    }

    public function incrementSent(): void
    {
        $this->increment('sent_count');
    }

    public function incrementFailed(): void
    {
        $this->increment('failed_count');
    }

    public function getSuccessRate(): float
    {
        if ($this->total_recipients === 0) {
            return 0;
        }

        return round(($this->sent_count / $this->total_recipients) * 100, 2);
    }

    /**
     * @return array<string, string>
     */
    public static function typeOptions(): array
    {
        return [
            self::TYPE_WALLET_REMINDER => 'Wallet Reminder',
            self::TYPE_SUBSCRIPTION_RENEWAL => 'Subscription Renewal',
            self::TYPE_OFFER => 'Offer',
            self::TYPE_PROMOTIONAL => 'Promotional',
            self::TYPE_TRANSACTIONAL => 'Transactional',
        ];
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
            self::CHANNEL_ALL => 'All Channels',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function statusOptions(): array
    {
        return [
            self::STATUS_DRAFT => 'Draft',
            self::STATUS_SCHEDULED => 'Scheduled',
            self::STATUS_SENDING => 'Sending',
            self::STATUS_COMPLETED => 'Completed',
            self::STATUS_CANCELLED => 'Cancelled',
        ];
    }
}
