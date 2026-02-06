<?php

namespace App\Services;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class OrderStatusService
{
    /**
     * Valid status transitions
     *
     * @var array<string, array<string>>
     */
    protected array $transitions = [
        Order::STATUS_PENDING => [Order::STATUS_CONFIRMED, Order::STATUS_CANCELLED],
        Order::STATUS_CONFIRMED => [Order::STATUS_PROCESSING, Order::STATUS_CANCELLED],
        Order::STATUS_PROCESSING => [Order::STATUS_OUT_FOR_DELIVERY, Order::STATUS_CANCELLED],
        Order::STATUS_OUT_FOR_DELIVERY => [Order::STATUS_DELIVERED, Order::STATUS_CANCELLED],
        Order::STATUS_DELIVERED => [Order::STATUS_REFUNDED],
        Order::STATUS_CANCELLED => [],
        Order::STATUS_REFUNDED => [],
    ];

    /**
     * Update order status
     *
     * @return array{success: bool, message: string}
     */
    public function updateStatus(Order $order, string $newStatus, ?string $notes = null): array
    {
        $oldStatus = $order->status;

        if (! $this->canTransitionTo($order, $newStatus)) {
            return [
                'success' => false,
                'message' => "Cannot transition from '{$oldStatus}' to '{$newStatus}'.",
            ];
        }

        $order->status = $newStatus;

        // Handle status-specific updates
        $this->handleStatusChange($order, $oldStatus, $newStatus);

        if ($notes) {
            $order->notes = ($order->notes ? $order->notes."\n" : '')."[{$newStatus}] {$notes}";
        }

        $order->save();

        Log::info('Order status updated', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
        ]);

        return [
            'success' => true,
            'message' => 'Status updated successfully.',
        ];
    }

    /**
     * Check if transition is valid
     */
    public function canTransitionTo(Order $order, string $newStatus): bool
    {
        $currentStatus = $order->status;

        if ($currentStatus === $newStatus) {
            return false;
        }

        return in_array($newStatus, $this->transitions[$currentStatus] ?? [], true);
    }

    /**
     * Get available status transitions
     *
     * @return array<string>
     */
    public function getAvailableStatuses(Order $order): array
    {
        return $this->transitions[$order->status] ?? [];
    }

    /**
     * Handle side effects of status change
     */
    protected function handleStatusChange(Order $order, string $oldStatus, string $newStatus): void
    {
        switch ($newStatus) {
            case Order::STATUS_DELIVERED:
                $order->delivered_at = Carbon::now();
                break;

            case Order::STATUS_CANCELLED:
                $order->cancelled_at = Carbon::now();
                // TODO: Handle inventory release if reserved
                // TODO: Handle refund if paid (Phase 7)
                break;

            case Order::STATUS_REFUNDED:
                // TODO: Handle refund processing (Phase 7)
                $order->payment_status = Order::PAYMENT_REFUNDED;
                break;

            case Order::STATUS_CONFIRMED:
                // Auto-transition from pending
                // Could send confirmation notification here
                break;
        }
    }

    /**
     * Confirm order
     */
    public function confirmOrder(Order $order, ?string $notes = null): array
    {
        return $this->updateStatus($order, Order::STATUS_CONFIRMED, $notes);
    }

    /**
     * Start processing order
     */
    public function startProcessing(Order $order, ?string $notes = null): array
    {
        return $this->updateStatus($order, Order::STATUS_PROCESSING, $notes);
    }

    /**
     * Mark order out for delivery
     */
    public function markOutForDelivery(Order $order, ?int $driverId = null, ?string $notes = null): array
    {
        if ($driverId) {
            $order->driver_id = $driverId;
        }

        return $this->updateStatus($order, Order::STATUS_OUT_FOR_DELIVERY, $notes);
    }

    /**
     * Mark order as delivered
     */
    public function markDelivered(Order $order, ?string $notes = null): array
    {
        return $this->updateStatus($order, Order::STATUS_DELIVERED, $notes);
    }

    /**
     * Cancel order
     */
    public function cancelOrder(Order $order, ?string $reason = null): array
    {
        $order->cancellation_reason = $reason;

        return $this->updateStatus($order, Order::STATUS_CANCELLED, $reason);
    }

    /**
     * Get status display info
     *
     * @return array{label: string, color: string, icon: string}
     */
    public function getStatusInfo(string $status): array
    {
        return match ($status) {
            Order::STATUS_PENDING => ['label' => 'Pending', 'color' => 'yellow', 'icon' => 'clock'],
            Order::STATUS_CONFIRMED => ['label' => 'Confirmed', 'color' => 'blue', 'icon' => 'check-circle'],
            Order::STATUS_PROCESSING => ['label' => 'Processing', 'color' => 'indigo', 'icon' => 'cog'],
            Order::STATUS_OUT_FOR_DELIVERY => ['label' => 'Out for Delivery', 'color' => 'purple', 'icon' => 'truck'],
            Order::STATUS_DELIVERED => ['label' => 'Delivered', 'color' => 'green', 'icon' => 'check'],
            Order::STATUS_CANCELLED => ['label' => 'Cancelled', 'color' => 'red', 'icon' => 'x-circle'],
            Order::STATUS_REFUNDED => ['label' => 'Refunded', 'color' => 'gray', 'icon' => 'refresh'],
            default => ['label' => ucfirst($status), 'color' => 'gray', 'icon' => 'question-mark'],
        };
    }

    /**
     * Get order timeline
     *
     * @return array<array{status: string, label: string, completed: bool, current: bool}>
     */
    public function getOrderTimeline(Order $order): array
    {
        $statusOrder = [
            Order::STATUS_PENDING,
            Order::STATUS_CONFIRMED,
            Order::STATUS_PROCESSING,
            Order::STATUS_OUT_FOR_DELIVERY,
            Order::STATUS_DELIVERED,
        ];

        if (in_array($order->status, [Order::STATUS_CANCELLED, Order::STATUS_REFUNDED], true)) {
            return [
                [
                    'status' => $order->status,
                    'label' => Order::statusOptions()[$order->status],
                    'completed' => true,
                    'current' => true,
                    'timestamp' => $order->status === Order::STATUS_CANCELLED
                        ? $order->cancelled_at?->format('M j, g:i A')
                        : null,
                ],
            ];
        }

        $currentIndex = array_search($order->status, $statusOrder, true);
        $timeline = [];

        foreach ($statusOrder as $index => $status) {
            $info = $this->getStatusInfo($status);
            $timeline[] = [
                'status' => $status,
                'label' => $info['label'],
                'completed' => $currentIndex !== false && $index <= $currentIndex,
                'current' => $index === $currentIndex,
                'timestamp' => $this->getStatusTimestamp($order, $status),
            ];
        }

        return $timeline;
    }

    /**
     * Get timestamp for a status
     */
    protected function getStatusTimestamp(Order $order, string $status): ?string
    {
        return match ($status) {
            Order::STATUS_PENDING => $order->created_at?->format('M j, g:i A'),
            Order::STATUS_DELIVERED => $order->delivered_at?->format('M j, g:i A'),
            Order::STATUS_CANCELLED => $order->cancelled_at?->format('M j, g:i A'),
            default => null,
        };
    }
}
