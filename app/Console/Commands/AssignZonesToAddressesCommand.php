<?php

namespace App\Console\Commands;

use App\Models\UserAddress;
use Illuminate\Console\Command;

class AssignZonesToAddressesCommand extends Command
{
    protected $signature = 'zones:assign-addresses
                            {--chunk=100 : Number of addresses to process per batch}';

    protected $description = 'Retroactively assign zones to addresses with null zone_id';

    public function handle(): int
    {
        $chunk = (int) $this->option('chunk');
        $total = UserAddress::query()->whereNull('zone_id')->count();
        if ($total === 0) {
            $this->info('No addresses without zone.');

            return self::SUCCESS;
        }
        $this->info("Assigning zones to {$total} address(es).");
        $assigned = 0;
        UserAddress::query()
            ->whereNull('zone_id')
            ->chunkById($chunk, function ($addresses) use (&$assigned) {
                foreach ($addresses as $address) {
                    if ($address->autoAssignZone()) {
                        $assigned++;
                    }
                }
            });
        $this->info("Assigned zone to {$assigned} address(es).");

        return self::SUCCESS;
    }
}
