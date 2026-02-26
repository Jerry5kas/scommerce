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
            [
                'name' => 'Butter Milk',
                'slug' => 'butter-milk',
                'description' => 'Refreshing and natural butter milk',
                'image' => '/demo/butter milk.png',
                'vertical' => BusinessVertical::SocietyFresh->value,
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Country Butter',
                'slug' => 'country-butter',
                'description' => 'Pure and traditional country butter',
                'image' => '/demo/butter.png',
                'vertical' => BusinessVertical::SocietyFresh->value,
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Fresh Curd',
                'slug' => 'fresh-curd',
                'description' => 'Thick and creamy naturally set curd',
                'image' => '/demo/Fresh Curd.png',
                'vertical' => Category::VERTICAL_BOTH,
                'display_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Ghee',
                'slug' => 'ghee',
                'description' => 'Aromatic and pure cow ghee',
                'image' => '/demo/Ghee.png',
                'vertical' => Category::VERTICAL_BOTH,
                'display_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Paneer',
                'slug' => 'paneer',
                'description' => 'Soft and fresh cottage cheese',
                'image' => '/demo/panneer.png',
                'vertical' => BusinessVertical::SocietyFresh->value,
                'display_order' => 5,
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
