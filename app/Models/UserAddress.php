<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAddress extends Model
{
    public const TYPE_HOME = 'home';

    public const TYPE_WORK = 'work';

    public const TYPE_OTHER = 'other';

    protected $fillable = [
        'user_id',
        'type',
        'label',
        'address_line_1',
        'address_line_2',
        'landmark',
        'city',
        'state',
        'pincode',
        'latitude',
        'longitude',
        'zone_id',
        'is_default',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
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

    /**
     * Auto-assign zone from pincode/coordinates via LocationService. Returns true if zone was assigned.
     */
    public function autoAssignZone(): bool
    {
        $zone = app(\App\Services\LocationService::class)->validateAddress($this, $this->user_id);
        if ($zone === null) {
            return false;
        }
        $this->update(['zone_id' => $zone->id]);

        return true;
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeDefault(Builder $query): Builder
    {
        return $query->where('is_default', true);
    }
}
