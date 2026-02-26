<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Zone>
 */
class ZoneFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->city.' Zone',
            'code' => $this->faker->unique()->bothify('Z-####'),
            'description' => $this->faker->sentence,
            'boundary_coordinates' => null,
            'pincodes' => [],
            'city' => $this->faker->city,
            'state' => $this->faker->state,
            'is_active' => true,
            'delivery_charge' => null,
            'min_order_amount' => null,
            'service_days' => [],
            'service_time_start' => null,
            'service_time_end' => null,
            'created_by' => null,
        ];
    }
}
