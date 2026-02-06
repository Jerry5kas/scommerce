<?php

namespace App\Services;

use App\Models\Delivery;
use App\Models\Driver;
use App\Models\Zone;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RouteAssignmentService
{
    protected int $defaultCapacity = 30; // Default deliveries per driver

    /**
     * Auto-assign deliveries for a date and zone
     *
     * @return array{success: bool, assigned: int, error?: string}
     */
    public function autoAssignDeliveries($date, ?int $zoneId = null): array
    {
        try {
            $query = Delivery::query()
                ->where('status', Delivery::STATUS_PENDING)
                ->whereNull('driver_id')
                ->whereDate('scheduled_date', $date);

            if ($zoneId) {
                $query->where('zone_id', $zoneId);
            }

            $deliveries = $query->get();

            if ($deliveries->isEmpty()) {
                return ['success' => true, 'assigned' => 0];
            }

            // Group by zone
            $byZone = $deliveries->groupBy('zone_id');
            $totalAssigned = 0;

            foreach ($byZone as $zoneDeliveries) {
                $zone = Zone::find($zoneDeliveries->first()->zone_id);
                $assigned = $this->assignDeliveriesInZone($zoneDeliveries, $zone, $date);
                $totalAssigned += $assigned;
            }

            Log::info('Auto-assigned deliveries', [
                'date' => $date,
                'zone_id' => $zoneId,
                'total_assigned' => $totalAssigned,
            ]);

            return ['success' => true, 'assigned' => $totalAssigned];
        } catch (\Exception $e) {
            Log::error('Auto-assign failed', [
                'date' => $date,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'assigned' => 0, 'error' => $e->getMessage()];
        }
    }

    /**
     * Assign deliveries within a zone
     */
    protected function assignDeliveriesInZone(Collection $deliveries, Zone $zone, $date): int
    {
        // Get available drivers in this zone
        $drivers = Driver::query()
            ->where('is_active', true)
            ->whereHas('zones', fn ($q) => $q->where('zones.id', $zone->id))
            ->get();

        if ($drivers->isEmpty()) {
            Log::warning('No drivers available for zone', ['zone_id' => $zone->id]);

            return 0;
        }

        // Get current assignment counts
        $driverCounts = Delivery::query()
            ->whereIn('driver_id', $drivers->pluck('id'))
            ->whereDate('scheduled_date', $date)
            ->whereNotIn('status', [Delivery::STATUS_CANCELLED])
            ->select('driver_id', DB::raw('count(*) as count'))
            ->groupBy('driver_id')
            ->pluck('count', 'driver_id')
            ->toArray();

        $assigned = 0;

        foreach ($deliveries as $delivery) {
            // Find driver with lowest count under capacity
            $selectedDriver = null;
            $minCount = PHP_INT_MAX;

            foreach ($drivers as $driver) {
                $count = $driverCounts[$driver->id] ?? 0;
                $capacity = $driver->max_deliveries_per_day ?? $this->defaultCapacity;

                if ($count < $capacity && $count < $minCount) {
                    $selectedDriver = $driver;
                    $minCount = $count;
                }
            }

            if ($selectedDriver) {
                $delivery->assignDriver($selectedDriver);
                $driverCounts[$selectedDriver->id] = ($driverCounts[$selectedDriver->id] ?? 0) + 1;
                $assigned++;
            }
        }

        return $assigned;
    }

    /**
     * Assign specific deliveries to a driver
     *
     * @param  array<int>  $deliveryIds
     * @return array{success: bool, assigned: int, error?: string}
     */
    public function assignDeliveriesToDriver(Driver $driver, array $deliveryIds): array
    {
        try {
            $deliveries = Delivery::whereIn('id', $deliveryIds)
                ->where(function ($q) {
                    $q->where('status', Delivery::STATUS_PENDING)
                        ->orWhere('status', Delivery::STATUS_ASSIGNED);
                })
                ->get();

            $assigned = 0;
            $sequence = $this->getNextSequence($driver, now()->toDateString());

            foreach ($deliveries as $delivery) {
                $delivery->update([
                    'driver_id' => $driver->id,
                    'status' => Delivery::STATUS_ASSIGNED,
                    'assigned_at' => now(),
                    'sequence' => $sequence++,
                ]);
                $assigned++;
            }

            Log::info('Deliveries assigned to driver', [
                'driver_id' => $driver->id,
                'assigned' => $assigned,
            ]);

            return ['success' => true, 'assigned' => $assigned];
        } catch (\Exception $e) {
            Log::error('Assignment failed', [
                'driver_id' => $driver->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'assigned' => 0, 'error' => $e->getMessage()];
        }
    }

    /**
     * Get deliveries for a driver on a date
     */
    public function getDeliveriesForDriver(Driver $driver, $date): Collection
    {
        return Delivery::query()
            ->where('driver_id', $driver->id)
            ->whereDate('scheduled_date', $date)
            ->whereNotIn('status', [Delivery::STATUS_CANCELLED])
            ->with(['order', 'address', 'user', 'zone'])
            ->orderBy('sequence')
            ->get();
    }

    /**
     * Get delivery route for driver (optimized order)
     *
     * @return array{deliveries: Collection, stats: array<string, mixed>}
     */
    public function getDriverRoute(Driver $driver, $date): array
    {
        $deliveries = $this->getDeliveriesForDriver($driver, $date);

        // Calculate stats
        $stats = [
            'total' => $deliveries->count(),
            'pending' => $deliveries->where('status', Delivery::STATUS_ASSIGNED)->count(),
            'out_for_delivery' => $deliveries->where('status', Delivery::STATUS_OUT_FOR_DELIVERY)->count(),
            'delivered' => $deliveries->where('status', Delivery::STATUS_DELIVERED)->count(),
            'failed' => $deliveries->where('status', Delivery::STATUS_FAILED)->count(),
            'total_distance' => $deliveries->sum('estimated_distance'),
            'total_time' => $deliveries->sum('estimated_time'),
        ];

        return [
            'deliveries' => $deliveries,
            'stats' => $stats,
        ];
    }

    /**
     * Reassign delivery to a new driver
     */
    public function reassignDelivery(Delivery $delivery, Driver $newDriver): bool
    {
        if (! $delivery->canAssignDriver()) {
            return false;
        }

        $delivery->assignDriver($newDriver);

        Log::info('Delivery reassigned', [
            'delivery_id' => $delivery->id,
            'new_driver_id' => $newDriver->id,
        ]);

        return true;
    }

    /**
     * Update delivery sequence
     *
     * @param  array<int, int>  $sequences  [delivery_id => sequence]
     */
    public function updateDeliverySequences(array $sequences): bool
    {
        try {
            foreach ($sequences as $deliveryId => $sequence) {
                Delivery::where('id', $deliveryId)->update(['sequence' => $sequence]);
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to update sequences', ['error' => $e->getMessage()]);

            return false;
        }
    }

    /**
     * Get next available sequence for driver
     */
    protected function getNextSequence(Driver $driver, $date): int
    {
        $maxSequence = Delivery::where('driver_id', $driver->id)
            ->whereDate('scheduled_date', $date)
            ->max('sequence');

        return ($maxSequence ?? 0) + 1;
    }

    /**
     * Get driver capacity status
     *
     * @return array<string, mixed>
     */
    public function getDriverCapacity(Driver $driver, $date): array
    {
        $assigned = Delivery::where('driver_id', $driver->id)
            ->whereDate('scheduled_date', $date)
            ->whereNotIn('status', [Delivery::STATUS_CANCELLED])
            ->count();

        $capacity = $driver->max_deliveries_per_day ?? $this->defaultCapacity;

        return [
            'driver_id' => $driver->id,
            'driver_name' => $driver->name,
            'assigned' => $assigned,
            'capacity' => $capacity,
            'available' => $capacity - $assigned,
            'utilization' => $capacity > 0 ? round(($assigned / $capacity) * 100, 1) : 0,
        ];
    }

    /**
     * Get zone summary for a date
     *
     * @return array<string, mixed>
     */
    public function getZoneSummary(Zone $zone, $date): array
    {
        $deliveries = Delivery::where('zone_id', $zone->id)
            ->whereDate('scheduled_date', $date)
            ->get();

        return [
            'zone_id' => $zone->id,
            'zone_name' => $zone->name,
            'total' => $deliveries->count(),
            'pending' => $deliveries->where('status', Delivery::STATUS_PENDING)->count(),
            'assigned' => $deliveries->where('status', Delivery::STATUS_ASSIGNED)->count(),
            'out_for_delivery' => $deliveries->where('status', Delivery::STATUS_OUT_FOR_DELIVERY)->count(),
            'delivered' => $deliveries->where('status', Delivery::STATUS_DELIVERED)->count(),
            'failed' => $deliveries->where('status', Delivery::STATUS_FAILED)->count(),
            'unassigned' => $deliveries->where('status', Delivery::STATUS_PENDING)->whereNull('driver_id')->count(),
        ];
    }

    /**
     * Get upcoming deliveries summary
     *
     * @return array<string, mixed>
     */
    public function getUpcomingDeliveriesSummary(int $days = 7): array
    {
        $summary = [];
        $startDate = now()->toDateString();
        $endDate = now()->addDays($days)->toDateString();

        $deliveries = Delivery::whereBetween('scheduled_date', [$startDate, $endDate])
            ->select('scheduled_date', 'status', DB::raw('count(*) as count'))
            ->groupBy('scheduled_date', 'status')
            ->get();

        foreach ($deliveries->groupBy('scheduled_date') as $date => $group) {
            $summary[$date] = [
                'total' => $group->sum('count'),
                'by_status' => $group->pluck('count', 'status')->toArray(),
            ];
        }

        return $summary;
    }
}
