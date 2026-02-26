<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Collection>
 */
class CollectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word.' Collection',
            'slug' => $this->faker->unique()->slug,
            'description' => $this->faker->sentence,
            'category_id' => null,
            'banner_image' => '/placeholder.png',
            'banner_mobile_image' => '/placeholder.png',
            'display_order' => rand(1, 100),
            'is_active' => true,
            'vertical' => 'all',
            'starts_at' => null,
            'ends_at' => null,
            'link_url' => null,
            'meta_title' => null,
            'meta_description' => null,
        ];
    }
}
