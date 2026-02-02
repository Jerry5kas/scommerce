<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['phone' => '9876500001'],
            [
                'name' => 'Test Customer',
                'email' => 'customer@test.com',
                'password' => null,
                'role' => User::ROLE_CUSTOMER,
                'preferred_language' => 'en',
                'communication_consent' => true,
                'is_active' => true,
            ],
        );

        User::factory()->count(3)->customer()->create();
    }
}
