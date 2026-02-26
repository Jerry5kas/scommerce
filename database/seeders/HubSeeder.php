<?php

namespace Database\Seeders;

use App\Models\Hub;
use App\Enums\BusinessVertical;
use Illuminate\Database\Seeder;

class HubSeeder extends Seeder
{
    public function run(): void
    {
        Hub::query()->updateOrCreate(
            ['name' => 'Freshtick Default Hub (vypin-co-op society)'],
            [
                'description' => 'Vypin, Pallipuram, Kochi, Ernakulam, Kerala, India',
                'is_active' => true,
                'latitude' => 10.078103,
                'longitude' => 76.205973,
                'verticals' => [
                    BusinessVertical::DailyFresh->value,
                    BusinessVertical::SocietyFresh->value,
                ],
            ]
        );
    }
}
