<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    public const VERTICAL_BOTH = 'both';

    protected $fillable = [
        'name',
        'slug',
        'sku',
        'description',
        'short_description',
        'category_id',
        'collection_id',
        'image',
        'images',
        'price',
        'compare_at_price',
        'cost_price',
        'stock_quantity',
        'is_in_stock',
        'is_subscription_eligible',
        'requires_bottle',
        'bottle_deposit',
        'is_one_time_purchase',
        'min_quantity',
        'max_quantity',
        'unit',
        'weight',
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
            'images' => 'array',
            'price' => 'decimal:2',
            'compare_at_price' => 'decimal:2',
            'cost_price' => 'decimal:2',
            'bottle_deposit' => 'decimal:2',
            'weight' => 'decimal:3',
            'stock_quantity' => 'integer',
            'min_quantity' => 'integer',
            'max_quantity' => 'integer',
            'display_order' => 'integer',
            'is_in_stock' => 'boolean',
            'is_subscription_eligible' => 'boolean',
            'requires_bottle' => 'boolean',
            'is_one_time_purchase' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function zones(): BelongsToMany
    {
        return $this->belongsToMany(Zone::class, 'product_zones')
            ->withPivot(['is_available', 'price_override', 'stock_quantity'])
            ->withTimestamps();
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function relations(): HasMany
    {
        return $this->hasMany(ProductRelation::class);
    }

    public function relatedProducts(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_relations', 'product_id', 'related_product_id')
            ->withPivot(['relation_type', 'display_order'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<Wishlist, $this>
     */
    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeInStock(Builder $query): Builder
    {
        return $query->where('is_in_stock', true);
    }

    public function scopeSubscriptionEligible(Builder $query): Builder
    {
        return $query->where('is_subscription_eligible', true);
    }

    public function scopeRequiresBottle(Builder $query): Builder
    {
        return $query->where('requires_bottle', true);
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

    public function isAvailableInZone(Zone $zone): bool
    {
        $pivot = $this->zones()->where('zone_id', $zone->id)->first();
        if ($pivot === null) {
            return false;
        }

        return (bool) $pivot->pivot->is_available;
    }

    public function getPriceForZone(?Zone $zone = null): float
    {
        if ($zone !== null) {
            $pivot = $this->zones()->where('zone_id', $zone->id)->first();
            if ($pivot !== null && $pivot->pivot->price_override !== null) {
                return (float) $pivot->pivot->price_override;
            }
        }

        return (float) $this->price;
    }

    public function canSubscribe(): bool
    {
        return $this->is_subscription_eligible;
    }

    public static function booted(): void
    {
        static::creating(function (Product $product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }
}
