<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word.' Product',
            'slug' => $this->faker->unique()->slug,
            'sku' => $this->faker->unique()->bothify('SKU-####'),
            'category_id' => \App\Models\Category::factory(),
            'image' => '/placeholder.png',
            'price' => $this->faker->randomFloat(2, 10, 100),
            'stock_quantity' => 100,
            'is_in_stock' => true,
            'is_subscription_eligible' => false,
            'requires_bottle' => false,
            'unit' => 'piece',
            'is_active' => true,
        ];
    }
}
