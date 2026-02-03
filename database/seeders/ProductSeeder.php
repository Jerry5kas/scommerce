<?php

namespace Database\Seeders;

use App\Enums\BusinessVertical;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\Zone;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $dailyFreshCategory = Category::query()->where('slug', 'fresh-vegetables')->first();
        $societyFreshCategory = Category::query()->where('slug', 'premium-water')->first();
        $dailyFreshCollection = Collection::query()->where('slug', 'fresh-daily-deals')->first();
        $societyFreshCollection = Collection::query()->where('slug', 'premium-water-subscription')->first();

        $products = [
            // Daily Fresh products
            [
                'name' => 'Fresh Tomatoes',
                'slug' => 'fresh-tomatoes',
                'sku' => 'DF-TOM-001',
                'description' => 'Fresh, locally sourced tomatoes',
                'short_description' => 'Fresh tomatoes',
                'category_id' => $dailyFreshCategory?->id,
                'collection_id' => $dailyFreshCollection?->id,
                'image' => 'https://via.placeholder.com/400x400?text=Tomatoes',
                'price' => 45.00,
                'compare_at_price' => 50.00,
                'stock_quantity' => 100,
                'is_in_stock' => true,
                'is_subscription_eligible' => false,
                'requires_bottle' => false,
                'is_one_time_purchase' => true,
                'min_quantity' => 1,
                'max_quantity' => 10,
                'unit' => 'kg',
                'weight' => 1.0,
                'display_order' => 1,
                'is_active' => true,
                'vertical' => BusinessVertical::DailyFresh->value,
            ],
            [
                'name' => 'Fresh Onions',
                'slug' => 'fresh-onions',
                'sku' => 'DF-ONI-001',
                'description' => 'Fresh onions',
                'short_description' => 'Fresh onions',
                'category_id' => $dailyFreshCategory?->id,
                'image' => 'https://via.placeholder.com/400x400?text=Onions',
                'price' => 35.00,
                'compare_at_price' => 40.00,
                'stock_quantity' => 150,
                'is_in_stock' => true,
                'is_subscription_eligible' => false,
                'requires_bottle' => false,
                'is_one_time_purchase' => true,
                'min_quantity' => 1,
                'max_quantity' => 10,
                'unit' => 'kg',
                'weight' => 1.0,
                'display_order' => 2,
                'is_active' => true,
                'vertical' => BusinessVertical::DailyFresh->value,
            ],
            [
                'name' => 'Fresh Milk',
                'slug' => 'fresh-milk',
                'sku' => 'DF-MIL-001',
                'description' => 'Fresh cow milk',
                'short_description' => 'Fresh milk',
                'category_id' => Category::query()->where('slug', 'dairy-products')->first()?->id,
                'image' => 'https://via.placeholder.com/400x400?text=Milk',
                'price' => 60.00,
                'compare_at_price' => 65.00,
                'stock_quantity' => 200,
                'is_in_stock' => true,
                'is_subscription_eligible' => true,
                'requires_bottle' => false,
                'is_one_time_purchase' => false,
                'min_quantity' => 1,
                'max_quantity' => 5,
                'unit' => 'liter',
                'weight' => 1.0,
                'display_order' => 1,
                'is_active' => true,
                'vertical' => BusinessVertical::DailyFresh->value,
            ],
            // Society Fresh products
            [
                'name' => 'Premium Water 20L',
                'slug' => 'premium-water-20l',
                'sku' => 'SF-WAT-001',
                'description' => 'Premium purified water in 20L bottle',
                'short_description' => 'Premium water 20L',
                'category_id' => $societyFreshCategory?->id,
                'collection_id' => $societyFreshCollection?->id,
                'image' => 'https://via.placeholder.com/400x400?text=Water+20L',
                'price' => 120.00,
                'compare_at_price' => 150.00,
                'stock_quantity' => 500,
                'is_in_stock' => true,
                'is_subscription_eligible' => true,
                'requires_bottle' => true,
                'bottle_deposit' => 200.00,
                'is_one_time_purchase' => false,
                'min_quantity' => 1,
                'max_quantity' => 10,
                'unit' => 'bottle',
                'weight' => 20.0,
                'display_order' => 1,
                'is_active' => true,
                'vertical' => BusinessVertical::SocietyFresh->value,
            ],
            [
                'name' => 'Premium Water 1L',
                'slug' => 'premium-water-1l',
                'sku' => 'SF-WAT-002',
                'description' => 'Premium purified water in 1L bottle',
                'short_description' => 'Premium water 1L',
                'category_id' => $societyFreshCategory?->id,
                'image' => 'https://via.placeholder.com/400x400?text=Water+1L',
                'price' => 25.00,
                'compare_at_price' => 30.00,
                'stock_quantity' => 1000,
                'is_in_stock' => true,
                'is_subscription_eligible' => false,
                'requires_bottle' => false,
                'is_one_time_purchase' => true,
                'min_quantity' => 1,
                'max_quantity' => 24,
                'unit' => 'bottle',
                'weight' => 1.0,
                'display_order' => 2,
                'is_active' => true,
                'vertical' => BusinessVertical::SocietyFresh->value,
            ],
        ];

        $zones = Zone::query()->active()->get();

        foreach ($products as $data) {
            $product = Product::query()->updateOrCreate(
                ['slug' => $data['slug']],
                $data,
            );

            // Assign product to all active zones
            $zoneData = [];
            foreach ($zones as $zone) {
                $zoneData[$zone->id] = [
                    'is_available' => true,
                    'price_override' => null,
                    'stock_quantity' => $data['stock_quantity'],
                ];
            }
            $product->zones()->sync($zoneData);
        }
    }
}
