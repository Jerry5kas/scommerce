<?php

namespace Database\Seeders;

use App\Enums\BusinessVertical;
use App\Models\Hub;
use App\Models\Zone;
use Illuminate\Database\Seeder;

class ZoneSeeder extends Seeder
{
    public function run(): void
    {
        // Remove existing zones
        Zone::query()->forceDelete();

        $hub = Hub::where('name', 'Freshtick Default Hub (vypin-co-op society)')->first();

        Zone::query()->updateOrCreate(
            ['code' => 'VYPIN'],
            [
                'hub_id' => $hub?->id,
                'name' => 'vypin',
                'description' => 'Vypin area delivery zone',
                'pincodes' => ['682502', '682509'],
                'boundary_coordinates' => [
                    [10.081909781994824, 76.20142936706544],
                    [10.082923844406126, 76.20739459991456],
                    [10.082923844406126, 76.21263027191164],
                    [10.08098022198113, 76.21366024017335],
                    [10.081318244114522, 76.21537685394289],
                    [10.076205621480451, 76.21662139892578],
                    [10.072952092137607, 76.21657848358156],
                    [10.072191522103518, 76.20576381683351],
                    [10.07574083358408, 76.20245933532716]
                ],
                'city' => 'Kochi',
                'state' => 'Kerala',
                'is_active' => true,
                'delivery_charge' => 0.00,
                'min_order_amount' => 0.00,
                'verticals' => [
                    BusinessVertical::DailyFresh->value,
                    BusinessVertical::SocietyFresh->value,
                ],
            ]
        );
    }
}
