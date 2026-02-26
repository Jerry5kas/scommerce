<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserAddress>
 */
class UserAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => UserAddress::TYPE_HOME,
            'label' => 'Home',
            'address_line_1' => $this->faker->streetAddress,
            'address_line_2' => $this->faker->optional()->sentence,
            'landmark' => $this->faker->word,
            'city' => $this->faker->city,
            'state' => $this->faker->state,
            'pincode' => $this->faker->postcode,
            'latitude' => $this->faker->latitude,
            'longitude' => $this->faker->longitude,
            'zone_id' => null,
            'is_default' => true,
            'is_active' => true,
        ];
    }
}
