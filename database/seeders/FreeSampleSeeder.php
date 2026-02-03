<?php

namespace Database\Seeders;

use App\Models\FreeSample;
use App\Models\Product;
use Illuminate\Database\Seeder;

class FreeSampleSeeder extends Seeder
{
    public function run(): void
    {
        // Get a sample product for free samples
        $product = Product::query()->where('is_active', true)->first();

        if ($product === null) {
            return;
        }

        // Create some test free samples
        $samples = [
            [
                'product_id' => $product->id,
                'user_id' => null,
                'phone_hash' => hash('sha256', '9876543210'),
                'device_hash' => hash('sha256', 'test-device-001'),
                'claimed_at' => now()->subDays(5),
                'is_used' => false,
            ],
            [
                'product_id' => $product->id,
                'user_id' => null,
                'phone_hash' => hash('sha256', '9876543211'),
                'device_hash' => hash('sha256', 'test-device-002'),
                'claimed_at' => now()->subDays(2),
                'is_used' => true,
            ],
        ];

        foreach ($samples as $data) {
            FreeSample::query()->updateOrCreate(
                [
                    'product_id' => $data['product_id'],
                    'phone_hash' => $data['phone_hash'],
                ],
                $data,
            );
        }
    }
}
