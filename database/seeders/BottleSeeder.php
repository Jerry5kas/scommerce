<?php

namespace Database\Seeders;

use App\Models\Bottle;
use Illuminate\Database\Seeder;

class BottleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create available bottles
        $bottleTypes = [
            ['type' => Bottle::TYPE_STANDARD, 'capacity' => 1.0, 'deposit_amount' => 50.00, 'purchase_cost' => 30.00],
            ['type' => Bottle::TYPE_STANDARD, 'capacity' => 0.5, 'deposit_amount' => 30.00, 'purchase_cost' => 20.00],
            ['type' => Bottle::TYPE_PREMIUM, 'capacity' => 1.0, 'deposit_amount' => 100.00, 'purchase_cost' => 60.00],
            ['type' => Bottle::TYPE_PREMIUM, 'capacity' => 2.0, 'deposit_amount' => 150.00, 'purchase_cost' => 90.00],
        ];

        $counter = 1;

        foreach ($bottleTypes as $config) {
            // Create 10 of each type
            for ($i = 0; $i < 10; $i++) {
                Bottle::create([
                    'bottle_number' => Bottle::generateBottleNumber(),
                    'barcode' => sprintf('BTL%08d', $counter),
                    'type' => $config['type'],
                    'capacity' => $config['capacity'],
                    'status' => Bottle::STATUS_AVAILABLE,
                    'deposit_amount' => $config['deposit_amount'],
                    'purchase_cost' => $config['purchase_cost'],
                ]);
                $counter++;
            }
        }

        $this->command->info('Created '.($counter - 1).' bottles.');
    }
}
