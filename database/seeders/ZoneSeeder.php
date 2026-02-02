<?php

namespace Database\Seeders;

use App\Models\Zone;
use Illuminate\Database\Seeder;

class ZoneSeeder extends Seeder
{
    public function run(): void
    {
        $zones = [
            [
                'name' => 'Kochi Central',
                'code' => 'KOCHI-C',
                'description' => 'Central Kochi delivery zone',
                'pincodes' => ['682001', '682002', '682003', '682011', '682012'],
                'city' => 'Kochi',
                'state' => 'Kerala',
                'is_active' => true,
                'delivery_charge' => 30.00,
                'min_order_amount' => 100.00,
            ],
            [
                'name' => 'Kochi North',
                'code' => 'KOCHI-N',
                'description' => 'North Kochi delivery zone',
                'pincodes' => ['682018', '682019', '682020', '682021'],
                'city' => 'Kochi',
                'state' => 'Kerala',
                'is_active' => true,
                'delivery_charge' => 40.00,
                'min_order_amount' => 150.00,
            ],
            [
                'name' => 'Ernakulam',
                'code' => 'ERNAKULAM',
                'description' => 'Ernakulam district zone',
                'pincodes' => ['682030', '682031', '682032', '682033'],
                'city' => 'Ernakulam',
                'state' => 'Kerala',
                'is_active' => true,
                'delivery_charge' => 50.00,
                'min_order_amount' => 200.00,
            ],
        ];

        foreach ($zones as $data) {
            Zone::query()->updateOrCreate(
                ['code' => $data['code']],
                $data,
            );
        }
    }
}
