<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceToken extends Model
{
    use HasFactory;

    public const PLATFORM_IOS = 'ios';

    public const PLATFORM_ANDROID = 'android';

    public const PLATFORM_WEB = 'web';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'token',
        'platform',
        'device_name',
        'is_active',
        'last_used_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'last_used_at' => 'datetime',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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

    public function scopeByPlatform($query, string $platform)
    {
        return $query->where('platform', $platform);
    }

    // Helper Methods

    public function markAsUsed(): void
    {
        $this->update(['last_used_at' => now()]);
    }

    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    /**
     * @return array<string, string>
     */
    public static function platformOptions(): array
    {
        return [
            self::PLATFORM_IOS => 'iOS',
            self::PLATFORM_ANDROID => 'Android',
            self::PLATFORM_WEB => 'Web',
        ];
    }
}
