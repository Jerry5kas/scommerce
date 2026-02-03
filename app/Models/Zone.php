<?php

namespace App\Models;

use App\Enums\BusinessVertical;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Zone extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'boundary_coordinates',
        'pincodes',
        'city',
        'state',
        'is_active',
        'verticals',
        'delivery_charge',
        'min_order_amount',
        'service_days',
        'service_time_start',
        'service_time_end',
        'created_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'boundary_coordinates' => 'array',
            'pincodes' => 'array',
            'service_days' => 'array',
            'verticals' => 'array',
            'is_active' => 'boolean',
            'delivery_charge' => 'decimal:2',
            'min_order_amount' => 'decimal:2',
            'service_time_start' => 'datetime',
            'service_time_end' => 'datetime',
        ];
    }

    public function drivers(): HasMany
    {
        return $this->hasMany(Driver::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(UserAddress::class, 'zone_id');
    }

    public function overrides(): HasMany
    {
        return $this->hasMany(ZoneOverride::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_zones')
            ->withPivot(['is_available', 'price_override', 'stock_quantity'])
            ->withTimestamps();
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeForDailyFresh(Builder $query): Builder
    {
        return $query->whereJsonContains('verticals', BusinessVertical::DailyFresh->value);
    }

    public function scopeForSocietyFresh(Builder $query): Builder
    {
        return $query->whereJsonContains('verticals', BusinessVertical::SocietyFresh->value);
    }

    public function scopeForVertical(Builder $query, string $vertical): Builder
    {
        return $query->whereJsonContains('verticals', $vertical);
    }

    public function supportsVertical(string $vertical): bool
    {
        $verticals = $this->verticals ?? [];
        if (empty($verticals)) {
            return true;
        }

        return in_array($vertical, $verticals, true);
    }

    public function isServiceable(string $pincode): bool
    {
        $pincodes = $this->pincodes ?? [];
        if (empty($pincodes)) {
            return false;
        }
        $normalized = preg_replace('/\s+/', '', $pincode);

        return in_array($normalized, array_map(function ($p) {
            return preg_replace('/\s+/', '', (string) $p);
        }, $pincodes), true);
    }

    /**
     * Check if lat/lng is within boundary polygon. boundary_coordinates: array of [lat, lng].
     */
    public function isWithinBoundary(float $lat, float $lng): bool
    {
        $boundary = $this->boundary_coordinates;
        if (empty($boundary) || ! is_array($boundary)) {
            return false;
        }
        $points = array_values($boundary);
        if (count($points) < 3) {
            return false;
        }
        $polygon = array_map(function ($p) {
            if (! is_array($p)) {
                return [0.0, 0.0];
            }
            $lat = (float) ($p[0] ?? 0);
            $lng = (float) ($p[1] ?? 0);

            return [$lng, $lat];
        }, $points);

        return $this->pointInPolygon($lng, $lat, $polygon);
    }

    /**
     * Ray-casting: point in polygon. (x, y) and polygon as array of [x, y] (lng, lat).
     */
    protected function pointInPolygon(float $x, float $y, array $polygon): bool
    {
        $n = count($polygon);
        $inside = false;
        for ($i = 0, $j = $n - 1; $i < $n; $j = $i++) {
            $xi = $polygon[$i][0];
            $yi = $polygon[$i][1];
            $xj = $polygon[$j][0];
            $yj = $polygon[$j][1];
            if ((($yi > $y) !== ($yj > $y)) &&
                ($x < ($xj - $xi) * ($y - $yi) / ($yj - $yi) + $xi)) {
                $inside = ! $inside;
            }
        }

        return $inside;
    }

    /**
     * @param  int|string  $day  0-6 (Sunday-Saturday) or day name
     */
    public function isServiceableOnDay($day): bool
    {
        $days = $this->service_days ?? [];
        if (empty($days)) {
            return true;
        }
        $normalized = is_numeric($day) ? (int) $day : (int) date('w', strtotime((string) $day));

        return in_array($normalized, $days, true);
    }

    public function isServiceableAtTime(?string $time = null): bool
    {
        $start = $this->service_time_start;
        $end = $this->service_time_end;
        if ($start === null && $end === null) {
            return true;
        }
        $t = $time !== null ? \Carbon\Carbon::parse($time) : now();
        $nowTime = $t->format('H:i:s');
        if ($start !== null) {
            $startStr = $start instanceof \DateTimeInterface ? $start->format('H:i:s') : (string) $start;
            if ($nowTime < $startStr) {
                return false;
            }
        }
        if ($end !== null) {
            $endStr = $end instanceof \DateTimeInterface ? $end->format('H:i:s') : (string) $end;
            if ($nowTime > $endStr) {
                return false;
            }
        }

        return true;
    }
}
