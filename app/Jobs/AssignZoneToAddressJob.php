<?php

namespace App\Jobs;

use App\Models\UserAddress;
use App\Services\LocationService;

class AssignZoneToAddressJob extends BaseJob
{
    public function __construct(
        public UserAddress $address
    ) {}

    public function handle(LocationService $locationService): void
    {
        $zone = $locationService->validateAddress($this->address, $this->address->user_id);
        if ($zone !== null) {
            $this->address->update(['zone_id' => $zone->id]);
        }
    }
}
