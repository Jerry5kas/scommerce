<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Driver extends Model
{
    protected $fillable = [
        'user_id',
        'employee_id',
        'zone_id',
        'vehicle_number',
        'vehicle_type',
        'license_number',
        'phone',
        'is_active',
        'current_latitude',
        'current_longitude',
        'last_location_update',
        'is_online',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_online' => 'boolean',
            'current_latitude' => 'decimal:8',
            'current_longitude' => 'decimal:8',
            'last_location_update' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOnline(Builder $query): Builder
    {
        return $query->where('is_online', true);
    }

    public function scopeByZone(Builder $query, int $zoneId): Builder
    {
        return $query->where('zone_id', $zoneId);
    }

    public function updateLocation(float $lat, float $lng): void
    {
        $this->update([
            'current_latitude' => $lat,
            'current_longitude' => $lng,
            'last_location_update' => now(),
        ]);
    }

    public function goOnline(): void
    {
        $this->update(['is_online' => true]);
    }

    public function goOffline(): void
    {
        $this->update(['is_online' => false]);
    }
}
