<?php

namespace Database\Seeders;

use App\Models\Driver;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Database\Seeder;

class DriverSeeder extends Seeder
{
    public function run(): void
    {
        $zone = Zone::query()->where('code', 'KOCHI-C')->first();
        if ($zone === null) {
            return;
        }

        $user = User::query()->updateOrCreate(
            ['phone' => '9876543210'],
            [
                'name' => 'Test Driver',
                'email' => null,
                'password' => null,
                'role' => User::ROLE_DRIVER,
                'preferred_language' => 'en',
                'communication_consent' => true,
                'is_active' => true,
            ],
        );

        Driver::query()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'employee_id' => 'DRV001',
                'zone_id' => $zone->id,
                'phone' => $user->phone,
                'is_active' => true,
                'is_online' => false,
            ],
        );
    }
}
