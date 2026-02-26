<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\Zone;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Facades\Cache;

class CatalogService
{
    private const CACHE_TTL_SECONDS = 3600;

    /**
     * Get products available in a zone for a specific vertical
     *
     * @param  array<string, mixed>  $filters
     * @return EloquentCollection<int, Product>
     */
    public function getProductsForZone(Zone $zone, string $vertical, array $filters = []): EloquentCollection
    {
        $cacheKey = sprintf('catalog:products:zone:%d:vertical:%s:%s', $zone->id, $vertical, md5(serialize($filters)));

        return Cache::remember($cacheKey, self::CACHE_TTL_SECONDS, function () use ($zone, $vertical, $filters) {
            $query = Product::query()
                ->active()
                ->inStock()
                ->forVertical($vertical)
                ->whereHas('zones', function ($q) use ($zone) {
                    $q->where('zones.id', $zone->id)
                        ->where('product_zones.is_available', true);
                })
                ->with(['category:id,name,slug', 'collection:id,name,slug', 'variants'])
                ->ordered();

            // Apply filters
            if (isset($filters['category_id']) && $filters['category_id'] > 0) {
                $query->where('category_id', $filters['category_id']);
            }

            if (isset($filters['collection_id']) && $filters['collection_id'] > 0) {
                $query->where('collection_id', $filters['collection_id']);
            }

            if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
                $query->where('price', '>=', $filters['min_price']);
            }

            if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
                $query->where('price', '<=', $filters['max_price']);
            }

            if (isset($filters['subscription_eligible']) && $filters['subscription_eligible']) {
                $query->subscriptionEligible();
            }

            if (isset($filters['sort'])) {
                match ($filters['sort']) {
                    'price_asc' => $query->orderBy('price', 'asc'),
                    'price_desc' => $query->orderBy('price', 'desc'),
                    'name_asc' => $query->orderBy('name', 'asc'),
                    'name_desc' => $query->orderBy('name', 'desc'),
                    default => $query->ordered(),
                };
            }

            return $query->get();
        });
    }

    /**
     * Get featured products for a zone and vertical
     *
     * @return EloquentCollection<int, Product>
     */
    public function getFeaturedProducts(Zone $zone, string $vertical, int $limit = 10): EloquentCollection
    {
        $cacheKey = sprintf('catalog:featured:zone:%d:vertical:%s:limit:%d', $zone->id, $vertical, $limit);

        return Cache::remember($cacheKey, self::CACHE_TTL_SECONDS, function () use ($zone, $vertical, $limit) {
            return Product::query()
                ->active()
                ->inStock()
                ->forVertical($vertical)
                ->whereHas('zones', function ($q) use ($zone) {
                    $q->where('zones.id', $zone->id)
                        ->where('product_zones.is_available', true);
                })
                ->with(['category:id,name,slug'])
                ->ordered()
                ->limit($limit)
                ->get();
        });
    }

    /**
     * Get related products (same category, same vertical, same zone)
     *
     * @return EloquentCollection<int, Product>
     */
    public function getRelatedProducts(Product $product, Zone $zone, string $vertical, int $limit = 8): EloquentCollection
    {
        $cacheKey = sprintf('catalog:related:%d:zone:%d:vertical:%s:limit:%d', $product->id, $zone->id, $vertical, $limit);

        return Cache::remember($cacheKey, self::CACHE_TTL_SECONDS, function () use ($product, $zone, $vertical, $limit) {
            return Product::query()
                ->active()
                ->inStock()
                ->forVertical($vertical)
                ->where('id', '!=', $product->id)
                ->when($product->category_id, function ($q) use ($product) {
                    $q->where('category_id', $product->category_id);
                })
                ->whereHas('zones', function ($q) use ($zone) {
                    $q->where('zones.id', $zone->id)
                        ->where('product_zones.is_available', true);
                })
                ->with(['category:id,name,slug'])
                ->ordered()
                ->limit($limit)
                ->get();
        });
    }

    /**
     * Search products by query string
     *
     * @return EloquentCollection<int, Product>
     */
    public function searchProducts(string $query, Zone $zone, string $vertical): EloquentCollection
    {
        $searchTerm = trim($query);
        if ($searchTerm === '') {
            return new EloquentCollection;
        }

        $cacheKey = sprintf('catalog:search:%s:zone:%d:vertical:%s', md5($searchTerm), $zone->id, $vertical);

        return Cache::remember($cacheKey, self::CACHE_TTL_SECONDS / 2, function () use ($searchTerm, $zone, $vertical) {
            return Product::query()
                ->active()
                ->inStock()
                ->forVertical($vertical)
                ->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                        ->orWhere('description', 'like', "%{$searchTerm}%")
                        ->orWhere('short_description', 'like', "%{$searchTerm}%")
                        ->orWhere('sku', 'like', "%{$searchTerm}%");
                })
                ->whereHas('zones', function ($q) use ($zone) {
                    $q->where('zones.id', $zone->id)
                        ->where('product_zones.is_available', true);
                })
                ->with(['category:id,name,slug', 'collection:id,name,slug', 'variants'])
                ->ordered()
                ->get();
        });
    }

    /**
     * Get active collection banners for a vertical
     *
     * @return EloquentCollection<int, Collection>
     */
    public function getActiveBanners(Zone $zone, string $vertical): EloquentCollection
    {
        $cacheKey = sprintf('catalog:banners:zone:%d:vertical:%s', $zone->id, $vertical);

        return Cache::remember($cacheKey, self::CACHE_TTL_SECONDS, function () use ($vertical) {
            return Collection::query()
                ->active()
                ->current()
                ->forVertical($vertical)
                ->ordered()
                ->get();
        });
    }

    /**
     * Get categories with product counts for a zone and vertical
     *
     * @return EloquentCollection<int, Category>
     */
    public function getCategoriesWithProducts(Zone $zone, string $vertical): EloquentCollection
    {
        $cacheKey = sprintf('catalog:categories:zone:%d:vertical:%s', $zone->id, $vertical);

        return Cache::remember($cacheKey, self::CACHE_TTL_SECONDS, function () use ($zone, $vertical) {
            return Category::query()
                ->active()
                ->forVertical($vertical)
                ->whereHas('products', function ($q) use ($zone, $vertical) {
                    $q->active()
                        ->inStock()
                        ->forVertical($vertical)
                        ->whereHas('zones', function ($zq) use ($zone) {
                            $zq->where('zones.id', $zone->id)
                                ->where('product_zones.is_available', true);
                        });
                })
                ->withCount(['products' => function ($q) use ($zone, $vertical) {
                    $q->active()
                        ->inStock()
                        ->forVertical($vertical)
                        ->whereHas('zones', function ($zq) use ($zone) {
                            $zq->where('zones.id', $zone->id)
                                ->where('product_zones.is_available', true);
                        });
                }])
                ->ordered()
                ->get();
        });
    }

    /**
     * Clear cache for a zone and vertical
     */
    public function clearCache(?Zone $zone = null, ?string $vertical = null): void
    {
        if ($zone !== null && $vertical !== null) {
            $patterns = [
                sprintf('catalog:products:zone:%d:vertical:%s:*', $zone->id, $vertical),
                sprintf('catalog:featured:zone:%d:vertical:%s:*', $zone->id, $vertical),
                sprintf('catalog:related:*:zone:%d:vertical:%s:*', $zone->id, $vertical),
                sprintf('catalog:search:*:zone:%d:vertical:%s', $zone->id, $vertical),
                sprintf('catalog:banners:zone:%d:vertical:%s', $zone->id, $vertical),
                sprintf('catalog:categories:zone:%d:vertical:%s', $zone->id, $vertical),
            ];
        } else {
            Cache::flush();
        }
    }
}
