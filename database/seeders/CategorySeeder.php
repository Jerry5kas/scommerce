<?php

namespace Database\Seeders;

use App\Enums\BusinessVertical;
use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // Daily Fresh categories
            [
                'name' => 'Fresh Vegetables',
                'slug' => 'fresh-vegetables',
                'description' => 'Fresh, locally sourced vegetables',
                'vertical' => BusinessVertical::DailyFresh->value,
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Fresh Fruits',
                'slug' => 'fresh-fruits',
                'description' => 'Seasonal fresh fruits',
                'vertical' => BusinessVertical::DailyFresh->value,
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Dairy Products',
                'slug' => 'dairy-products',
                'description' => 'Fresh milk, curd, and dairy items',
                'vertical' => BusinessVertical::DailyFresh->value,
                'display_order' => 3,
                'is_active' => true,
            ],
            // Society Fresh categories
            [
                'name' => 'Premium Water',
                'slug' => 'premium-water',
                'description' => 'Premium purified water',
                'vertical' => BusinessVertical::SocietyFresh->value,
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Beverages',
                'slug' => 'beverages',
                'description' => 'Premium beverages and drinks',
                'vertical' => BusinessVertical::SocietyFresh->value,
                'display_order' => 2,
                'is_active' => true,
            ],
            // Both verticals
            [
                'name' => 'Organic Products',
                'slug' => 'organic-products',
                'description' => 'Organic and natural products',
                'vertical' => Category::VERTICAL_BOTH,
                'display_order' => 10,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $data) {
            Category::query()->updateOrCreate(
                ['slug' => $data['slug']],
                $data,
            );
        }
    }
}
