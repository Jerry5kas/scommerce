<?php

namespace Database\Seeders;

use App\Enums\BusinessVertical;
use App\Models\Collection;
use Illuminate\Database\Seeder;

class CollectionSeeder extends Seeder
{
    public function run(): void
    {
        $collections = [
            // Daily Fresh banners
            [
                'name' => 'Fresh Daily Deals',
                'slug' => 'fresh-daily-deals',
                'description' => 'Get the freshest produce delivered daily',
                'vertical' => BusinessVertical::DailyFresh->value,
                'banner_image' => 'https://via.placeholder.com/1200x400?text=Fresh+Daily+Deals',
                'banner_mobile_image' => 'https://via.placeholder.com/600x300?text=Fresh+Daily+Deals',
                'display_order' => 1,
                'is_active' => true,
                'starts_at' => now()->subDays(1),
                'ends_at' => now()->addDays(30),
            ],
            [
                'name' => 'Vegetable Special',
                'slug' => 'vegetable-special',
                'description' => 'Best prices on fresh vegetables',
                'vertical' => BusinessVertical::DailyFresh->value,
                'banner_image' => 'https://via.placeholder.com/1200x400?text=Vegetable+Special',
                'banner_mobile_image' => 'https://via.placeholder.com/600x300?text=Vegetable+Special',
                'display_order' => 2,
                'is_active' => true,
                'starts_at' => now()->subDays(1),
                'ends_at' => now()->addDays(15),
            ],
            // Society Fresh banners
            [
                'name' => 'Premium Water Subscription',
                'slug' => 'premium-water-subscription',
                'description' => 'Subscribe and save on premium water',
                'vertical' => BusinessVertical::SocietyFresh->value,
                'banner_image' => 'https://via.placeholder.com/1200x400?text=Premium+Water',
                'banner_mobile_image' => 'https://via.placeholder.com/600x300?text=Premium+Water',
                'display_order' => 1,
                'is_active' => true,
                'starts_at' => now()->subDays(1),
                'ends_at' => now()->addDays(60),
            ],
        ];

        foreach ($collections as $data) {
            Collection::query()->updateOrCreate(
                ['slug' => $data['slug']],
                $data,
            );
        }
    }
}
