<?php

namespace App\Services;

use App\Models\Delivery;
use App\Models\Driver;
use Illuminate\Support\Facades\Log;

class DeliveryStatusService
{
    /**
     * Status transitions map
     *
     * @var array<string, array<string>>
     */
    protected array $transitions = [
        Delivery::STATUS_PENDING => [Delivery::STATUS_ASSIGNED, Delivery::STATUS_CANCELLED],
        Delivery::STATUS_ASSIGNED => [Delivery::STATUS_OUT_FOR_DELIVERY, Delivery::STATUS_PENDING, Delivery::STATUS_CANCELLED],
        Delivery::STATUS_OUT_FOR_DELIVERY => [Delivery::STATUS_DELIVERED, Delivery::STATUS_FAILED],
        Delivery::STATUS_DELIVERED => [],
        Delivery::STATUS_FAILED => [Delivery::STATUS_PENDING, Delivery::STATUS_ASSIGNED],
        Delivery::STATUS_CANCELLED => [],
    ];

    /**
     * Update delivery status
     *
     * @param  array<string, mixed>  $data
     */
    public function updateStatus(Delivery $delivery, string $status, array $data = []): Delivery
    {
        if (! $this->canTransitionTo($delivery, $status)) {
            throw new \InvalidArgumentException("Cannot transition from {$delivery->status} to {$status}");
        }

        $oldStatus = $delivery->status;

        $updateData = ['status' => $status];

        // Handle status-specific data
        switch ($status) {
            case Delivery::STATUS_ASSIGNED:
                if (isset($data['driver_id'])) {
                    $updateData['driver_id'] = $data['driver_id'];
                    $updateData['assigned_at'] = now();
                }
                break;

            case Delivery::STATUS_OUT_FOR_DELIVERY:
                $updateData['dispatched_at'] = now();
                break;

            case Delivery::STATUS_DELIVERED:
                $updateData['delivered_at'] = now();
                if (isset($data['proof_image'])) {
                    $updateData['delivery_proof_image'] = $data['proof_image'];
                }
                break;

            case Delivery::STATUS_FAILED:
                $updateData['failure_reason'] = $data['reason'] ?? null;
                break;
        }

        // Add notes if provided
        if (isset($data['notes'])) {
            $updateData['notes'] = $data['notes'];
        }

        $delivery->update($updateData);

        // Handle side effects
        $this->handleStatusChange($delivery, $oldStatus, $status);

        Log::info('Delivery status updated', [
            'delivery_id' => $delivery->id,
            'old_status' => $oldStatus,
            'new_status' => $status,
        ]);

        return $delivery->fresh();
    }

    /**
     * Check if delivery can transition to new status
     */
    public function canTransitionTo(Delivery $delivery, string $newStatus): bool
    {
        $allowedTransitions = $this->transitions[$delivery->status] ?? [];

        return in_array($newStatus, $allowedTransitions, true);
    }

    /**
     * Get available status transitions
     *
     * @return array<string>
     */
    public function getAvailableStatuses(Delivery $delivery): array
    {
        return $this->transitions[$delivery->status] ?? [];
    }

    /**
     * Handle side effects of status change
     */
    protected function handleStatusChange(Delivery $delivery, string $oldStatus, string $newStatus): void
    {
        // Update order status based on delivery status
        $order = $delivery->order;

        switch ($newStatus) {
            case Delivery::STATUS_OUT_FOR_DELIVERY:
                $order->update(['status' => \App\Models\Order::STATUS_OUT_FOR_DELIVERY]);
                break;

            case Delivery::STATUS_DELIVERED:
                $order->markAsDelivered();
                break;

            case Delivery::STATUS_FAILED:
                // Keep order status as is - admin needs to decide what to do
                break;

            case Delivery::STATUS_CANCELLED:
                // Order should be cancelled separately
                break;
        }

        // TODO: Trigger notifications (Phase 12)
    }

    /**
     * Get status info for display
     *
     * @return array<string, mixed>
     */
    public function getStatusInfo(string $status): array
    {
        $info = [
            Delivery::STATUS_PENDING => [
                'label' => 'Pending',
                'color' => 'gray',
                'description' => 'Waiting for driver assignment',
            ],
            Delivery::STATUS_ASSIGNED => [
                'label' => 'Assigned',
                'color' => 'blue',
                'description' => 'Driver assigned, waiting for dispatch',
            ],
            Delivery::STATUS_OUT_FOR_DELIVERY => [
                'label' => 'Out for Delivery',
                'color' => 'yellow',
                'description' => 'Driver is on the way',
            ],
            Delivery::STATUS_DELIVERED => [
                'label' => 'Delivered',
                'color' => 'green',
                'description' => 'Successfully delivered',
            ],
            Delivery::STATUS_FAILED => [
                'label' => 'Failed',
                'color' => 'red',
                'description' => 'Delivery failed',
            ],
            Delivery::STATUS_CANCELLED => [
                'label' => 'Cancelled',
                'color' => 'gray',
                'description' => 'Delivery cancelled',
            ],
        ];

        return $info[$status] ?? ['label' => $status, 'color' => 'gray', 'description' => ''];
    }

    /**
     * Get delivery timeline
     *
     * @return array<array<string, mixed>>
     */
    public function getDeliveryTimeline(Delivery $delivery): array
    {
        $timeline = [];

        $timeline[] = [
            'status' => 'created',
            'label' => 'Order Placed',
            'timestamp' => $delivery->created_at,
            'completed' => true,
        ];

        $timeline[] = [
            'status' => Delivery::STATUS_ASSIGNED,
            'label' => 'Driver Assigned',
            'timestamp' => $delivery->assigned_at,
            'completed' => $delivery->assigned_at !== null,
        ];

        $timeline[] = [
            'status' => Delivery::STATUS_OUT_FOR_DELIVERY,
            'label' => 'Out for Delivery',
            'timestamp' => $delivery->dispatched_at,
            'completed' => $delivery->dispatched_at !== null,
        ];

        $timeline[] = [
            'status' => Delivery::STATUS_DELIVERED,
            'label' => 'Delivered',
            'timestamp' => $delivery->delivered_at,
            'completed' => $delivery->delivered_at !== null,
        ];

        return $timeline;
    }

    /**
     * Reassign delivery to a new driver
     */
    public function reassignDriver(Delivery $delivery, Driver $newDriver): Delivery
    {
        if (! in_array($delivery->status, [Delivery::STATUS_PENDING, Delivery::STATUS_ASSIGNED], true)) {
            throw new \InvalidArgumentException('Cannot reassign driver at this stage.');
        }

        $delivery->update([
            'driver_id' => $newDriver->id,
            'status' => Delivery::STATUS_ASSIGNED,
            'assigned_at' => now(),
        ]);

        Log::info('Delivery reassigned', [
            'delivery_id' => $delivery->id,
            'new_driver_id' => $newDriver->id,
        ]);

        return $delivery->fresh();
    }
}
