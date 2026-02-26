<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Collection extends Model
{
    public const VERTICAL_BOTH = 'both';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'category_id',
        'banner_image',
        'banner_mobile_image',
        'display_order',
        'is_active',
        'vertical',
        'starts_at',
        'ends_at',
        'link_url',
        'meta_title',
        'meta_description',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'display_order' => 'integer',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeCurrent(Builder $query): Builder
    {
        $now = now();

        return $query->where(function (Builder $q) use ($now) {
            $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
        })->where(function (Builder $q) use ($now) {
            $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now);
        });
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('display_order')->orderBy('name');
    }

    public function scopeForVertical(Builder $query, string $vertical): Builder
    {
        if ($vertical === 'all') {
            return $query;
        }

        return $query->where(function (Builder $q) use ($vertical) {
            $q->where('vertical', $vertical)->orWhere('vertical', self::VERTICAL_BOTH);
        });
    }

    public function isActive(): bool
    {
        if (! $this->is_active) {
            return false;
        }
        if ($this->starts_at !== null && $this->starts_at->isFuture()) {
            return false;
        }
        if ($this->ends_at !== null && $this->ends_at->isPast()) {
            return false;
        }

        return true;
    }

    public static function booted(): void
    {
        static::creating(function (Collection $collection) {
            if (empty($collection->slug)) {
                $collection->slug = Str::slug($collection->name);
            }
        });
    }
}
