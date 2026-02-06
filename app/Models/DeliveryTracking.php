<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryTracking extends Model
{
    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'delivery_id',
        'driver_id',
        'latitude',
        'longitude',
        'accuracy',
        'speed',
        'heading',
        'status',
        'tracked_at',
    ];

    /**
     * @var string
     */
    protected $table = 'delivery_tracking';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'accuracy' => 'decimal:2',
            'speed' => 'decimal:2',
            'heading' => 'decimal:2',
            'tracked_at' => 'datetime',
        ];
    }

    // Relationships

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(Delivery::class);
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    // Scopes

    public function scopeRecent($query, int $minutes = 30)
    {
        return $query->where('tracked_at', '>=', now()->subMinutes($minutes));
    }

    public function scopeByDelivery($query, int $deliveryId)
    {
        return $query->where('delivery_id', $deliveryId);
    }

    public function scopeByDriver($query, int $driverId)
    {
        return $query->where('driver_id', $driverId);
    }

    // Helper Methods

    /**
     * Calculate distance from another point (Haversine formula)
     */
    public function distanceFrom(float $lat, float $lng): float
    {
        $earthRadius = 6371; // km

        $latFrom = deg2rad($this->latitude);
        $lonFrom = deg2rad($this->longitude);
        $latTo = deg2rad($lat);
        $lonTo = deg2rad($lng);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $a = sin($latDelta / 2) ** 2 + cos($latFrom) * cos($latTo) * sin($lonDelta / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Get formatted coordinates
     */
    public function getCoordinates(): array
    {
        return [
            'lat' => (float) $this->latitude,
            'lng' => (float) $this->longitude,
        ];
    }
}
