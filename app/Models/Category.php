<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Category extends Model
{
    public const VERTICAL_BOTH = 'both';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'icon',
        'display_order',
        'is_active',
        'vertical',
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
        ];
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function collections(): HasMany
    {
        return $this->hasMany(Collection::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
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

    public function productsCount(): int
    {
        return $this->products()->count();
    }

    public static function booted(): void
    {
        static::creating(function (Category $category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }
}
