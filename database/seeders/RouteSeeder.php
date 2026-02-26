<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserAddress;
use App\Models\Driver;
use App\Models\Hub;
use App\Models\Route;
use App\Models\Zone;
use Illuminate\Database\Seeder;

class RouteSeeder extends Seeder
{
    public function run(): void
    {
        $hub = Hub::where('name', 'Freshtick Default Hub (vypin-co-op society)')->first();
        $zone = Zone::where('code', 'VYPIN')->first();

        if (!$hub || !$zone) {
            return;
        }

        // Customer Data array
        $customerData = [
            [
                'phone' => '9876543201',
                'name' => 'Vypin Customer 1',
                'email' => 'vypin.customer1@test.com',
                'address_line_1' => 'Vypin Pallipuram Road',
                'latitude' => 10.078103,
                'longitude' => 76.205973,
            ],
            [
                'phone' => '9876543202',
                'name' => 'Vypin Customer 2',
                'email' => 'vypin.customer2@test.com',
                'address_line_1' => 'Cherai Beach Road',
                'latitude' => 10.080500,
                'longitude' => 76.210500,
            ],
            [
                'phone' => '9876543203',
                'name' => 'Vypin Customer 3',
                'email' => 'vypin.customer3@test.com',
                'address_line_1' => 'Munambam Fishing Harbour Road',
                'latitude' => 10.076500,
                'longitude' => 76.214000,
            ],
            [
                'phone' => '9876543204',
                'name' => 'Vypin Customer 4',
                'email' => 'vypin.customer4@test.com',
                'address_line_1' => 'Njarakkal Fish Farm Road',
                'latitude' => 10.074000,
                'longitude' => 76.208000,
            ]
        ];

        $addressIds = [];
        foreach ($customerData as $data) {
            // 1. Create a Customer for Vypin
            $customer = User::query()->firstOrCreate(
                ['phone' => $data['phone']],
                [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'role' => User::ROLE_CUSTOMER,
                    'preferred_language' => 'en',
                    'is_active' => true,
                ]
            );

            // 2. Create an Address inside the Vypin polygon
            $address = UserAddress::query()->firstOrCreate(
                [
                    'user_id' => $customer->id,
                    'type' => 'home',
                ],
                [
                    'label' => 'Home',
                    'address_line_1' => $data['address_line_1'],
                    'city' => 'Kochi',
                    'state' => 'Kerala',
                    'pincode' => '682502',
                    'latitude' => $data['latitude'],
                    'longitude' => $data['longitude'],
                    'zone_id' => $zone->id,
                    'is_default' => true,
                    'is_active' => true,
                ]
            );

            $addressIds[] = $address->id;
        }

        // 3. Create a default Driver for Vypin
        $driverUser = User::query()->firstOrCreate(
            ['phone' => '9800000001'],
            [
                'name' => 'Vypin Driver',
                'email' => 'vypin.driver@test.com',
                'role' => User::ROLE_DRIVER,
                'preferred_language' => 'en',
                'is_active' => true,
            ]
        );

        $driver = Driver::query()->firstOrCreate(
            ['user_id' => $driverUser->id],
            [
                'employee_id' => 'VYP-DRV-001',
                'zone_id' => $zone->id,
                'phone' => $driverUser->phone,
                'is_active' => true,
            ]
        );

        // 4. Create a Route for this Hub and assign it to the Driver
        $route = Route::query()->firstOrCreate(
            ['name' => 'Vypin Morning Route'],
            [
                'hub_id' => $hub->id,
                'driver_id' => $driver->id,
                'description' => 'Morning delivery route for Vypin zone',
                'is_active' => true,
            ]
        );

        // 5. Assign the Customer Addresses to the Route Pivot
        $syncData = [];
        foreach ($addressIds as $index => $addressId) {
            $syncData[$addressId] = ['sequence' => $index + 1];
        }
        $route->addresses()->sync($syncData);
        
        $this->command->info('✅ Vypin Route created with 4 stops and assigned to Driver.');
    }
}
