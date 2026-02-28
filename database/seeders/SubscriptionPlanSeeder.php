<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure Products Exist
        $product480 = Product::firstOrCreate(
            ['name' => 'Milk 480ml'],
            [
                'sku' => 'MILK-480',
                'slug' => 'milk-480ml',
                'description' => 'Fresh Milk 480ml',
                'price' => 45.00, // Assuming MRP is slightly higher than subscription price
                'category_id' => 1, // Dummy
                'image' => 'default.png',
            ]
        );

        $product1L = Product::firstOrCreate(
            ['name' => 'Milk 1L'],
            [
                'sku' => 'MILK-1L',
                'slug' => 'milk-1l',
                'description' => 'Fresh Milk 1L',
                'price' => 90.00, // Assuming MRP
                'category_id' => 1, // Dummy
                'image' => 'default.png',
            ]
        );

        // 2. Clear existing plans
        Schema::disableForeignKeyConstraints();
        SubscriptionPlan::truncate();
        DB::table('subscription_plan_items')->truncate();
        DB::table('subscription_plan_features')->truncate();
        Schema::enableForeignKeyConstraints();

        // 3. Create Plans

        $features = [
            ['title' => 'Daily Morning delivery', 'highlight' => true],
            ['title' => 'Free delivery', 'highlight' => true],
            ['title' => 'Pause/Resume anytime', 'highlight' => false],
            ['title' => 'Vacation hold', 'highlight' => false],
            ['title' => 'Whatsapp alerts', 'highlight' => false],
        ];

        // Plan 1: 15-Pack Plan
        $plan15 = SubscriptionPlan::create([
            'name' => '15-Pack Plan',
            'description' => 'Best for trial',
            'frequency_type' => 'daily',
            'discount_type' => 'none',
            'discount_value' => 0,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $plan15->items()->createMany([
            [
                'product_id' => $product480->id,
                'units' => 15,
                'total_price' => 630.00,
                'per_unit_price' => 42.00,
            ],
            [
                'product_id' => $product1L->id,
                'units' => 15,
                'total_price' => 1260.00,
                'per_unit_price' => 84.00,
            ],
        ]);

        $plan15->features()->createMany($features);

        // Plan 2: 30-Pack Plan
        $plan30 = SubscriptionPlan::create([
            'name' => '30-Pack Plan',
            'description' => 'Most Popular',
            'frequency_type' => 'daily',
            'discount_type' => 'percentage',
            'discount_value' => 49.00, // Label says 49% OFF
            'is_active' => true,
            'sort_order' => 2,
        ]);

        $plan30->items()->createMany([
            [
                'product_id' => $product480->id,
                'units' => 30,
                'total_price' => 1230.00,
                'per_unit_price' => 41.00,
            ],
            [
                'product_id' => $product1L->id,
                'units' => 30,
                'total_price' => 2430.00,
                'per_unit_price' => 81.00,
            ],
        ]);

        $plan30->features()->createMany($features);

        // Plan 3: 90-Pack Plan
        $plan90 = SubscriptionPlan::create([
            'name' => '90-Pack Plan',
            'description' => 'Best Value',
            'frequency_type' => 'daily',
            'discount_type' => 'percentage',
            'discount_value' => 50.00,
            'is_active' => true,
            'sort_order' => 3,
        ]);

        $plan90->items()->createMany([
            [
                'product_id' => $product480->id,
                'units' => 90,
                'total_price' => 3600.00,
                'per_unit_price' => 40.00,
            ],
            [
                'product_id' => $product1L->id,
                'units' => 90,
                'total_price' => 7200.00,
                'per_unit_price' => 80.00,
            ],
        ]);

        $plan90->features()->createMany($features);
    }
}
