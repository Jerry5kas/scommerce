<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Order;
use App\Services\OrderStatusService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private OrderStatusService $orderStatusService
    ) {}

    /**
     * List all orders with filters
     */
    public function index(Request $request): Response
    {
        $query = Order::query()
            ->with(['user', 'address.zone', 'items', 'driver.user']);

        // Filter by status
        if ($request->filled('status')) {
            $query->byStatus($request->string('status'));
        }

        // Filter by vertical
        if ($request->filled('vertical')) {
            $query->forVertical($request->string('vertical'));
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('scheduled_delivery_date', '>=', $request->date('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('scheduled_delivery_date', '<=', $request->date('date_to'));
        }

        // Filter by specific date
        if ($request->filled('date')) {
            $query->byDate(Carbon::parse($request->date('date')));
        }

        // Filter by driver
        if ($request->filled('driver_id')) {
            $query->where('driver_id', $request->integer('driver_id'));
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        $orders = $query->orderByDesc('created_at')->paginate(20);

        $drivers = Driver::with('user')->active()->get();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'drivers' => $drivers,
            'statusOptions' => Order::statusOptions(),
            'typeOptions' => Order::typeOptions(),
            'filters' => $request->only(['status', 'vertical', 'type', 'date_from', 'date_to', 'date', 'driver_id', 'search']),
        ]);
    }

    /**
     * Show order details
     */
    public function show(Order $order): Response
    {
        $order->load(['user', 'address.zone', 'items.product', 'subscription', 'driver.user']);

        $timeline = $this->orderStatusService->getOrderTimeline($order);
        $availableStatuses = $this->orderStatusService->getAvailableStatuses($order);

        $drivers = Driver::with('user')->active()->get();

        return Inertia::render('admin/orders/show', [
            'order' => $order,
            'timeline' => $timeline,
            'availableStatuses' => $availableStatuses,
            'statusOptions' => Order::statusOptions(),
            'paymentStatusOptions' => Order::paymentStatusOptions(),
            'drivers' => $drivers,
        ]);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,confirmed,processing,out_for_delivery,delivered,cancelled,refunded'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $result = $this->orderStatusService->updateStatus(
            $order,
            $validated['status'],
            $validated['notes'] ?? null
        );

        if (! $result['success']) {
            return back()->with('error', $result['message']);
        }

        return back()->with('success', 'Order status updated.');
    }

    /**
     * Update order details
     */
    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'scheduled_delivery_date' => ['sometimes', 'date'],
            'scheduled_delivery_time' => ['nullable', 'date_format:H:i'],
            'delivery_instructions' => ['nullable', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $order->update($validated);

        return back()->with('success', 'Order updated.');
    }

    /**
     * Assign driver to order
     */
    public function assignDriver(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'driver_id' => ['required', 'integer', 'exists:drivers,id'],
        ]);

        $order->driver_id = $validated['driver_id'];
        $order->save();

        return back()->with('success', 'Driver assigned.');
    }

    /**
     * Cancel order
     */
    public function cancel(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $result = $this->orderStatusService->cancelOrder(
            $order,
            $validated['reason'] ?? 'Cancelled by admin'
        );

        if (! $result['success']) {
            return back()->with('error', $result['message']);
        }

        return redirect()->route('admin.orders.index')
            ->with('success', 'Order cancelled.');
    }

    /**
     * Get orders for a specific date (API)
     */
    public function forDate(Request $request): JsonResponse
    {
        $date = $request->date('date', Carbon::today());

        $orders = Order::query()
            ->with(['user', 'address.zone', 'driver.user'])
            ->byDate($date)
            ->orderBy('scheduled_delivery_time')
            ->get();

        // Group by status
        $grouped = $orders->groupBy('status');

        return response()->json([
            'date' => $date->format('Y-m-d'),
            'total' => $orders->count(),
            'by_status' => $grouped->map->count(),
            'orders' => $orders,
        ]);
    }

    /**
     * Bulk update orders
     */
    public function bulkUpdate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'order_ids' => ['required', 'array'],
            'order_ids.*' => ['integer', 'exists:orders,id'],
            'action' => ['required', 'string', 'in:confirm,cancel,assign_driver'],
            'driver_id' => ['required_if:action,assign_driver', 'nullable', 'integer', 'exists:drivers,id'],
        ]);

        $count = 0;
        foreach ($validated['order_ids'] as $orderId) {
            $order = Order::find($orderId);
            if (! $order) {
                continue;
            }

            switch ($validated['action']) {
                case 'confirm':
                    $result = $this->orderStatusService->confirmOrder($order);
                    if ($result['success']) {
                        $count++;
                    }
                    break;

                case 'cancel':
                    $result = $this->orderStatusService->cancelOrder($order, 'Bulk cancelled by admin');
                    if ($result['success']) {
                        $count++;
                    }
                    break;

                case 'assign_driver':
                    $order->driver_id = $validated['driver_id'];
                    $order->save();
                    $count++;
                    break;
            }
        }

        return back()->with('success', "{$count} orders updated.");
    }

    /**
     * Dashboard stats
     */
    public function stats(Request $request): JsonResponse
    {
        $date = $request->date('date', Carbon::today());

        $stats = [
            'today' => [
                'total' => Order::byDate($date)->count(),
                'pending' => Order::byDate($date)->pending()->count(),
                'confirmed' => Order::byDate($date)->confirmed()->count(),
                'delivered' => Order::byDate($date)->delivered()->count(),
                'cancelled' => Order::byDate($date)->cancelled()->count(),
                'revenue' => Order::byDate($date)->delivered()->sum('total'),
            ],
            'this_week' => [
                'total' => Order::whereBetween('scheduled_delivery_date', [
                    $date->copy()->startOfWeek(),
                    $date->copy()->endOfWeek(),
                ])->count(),
                'revenue' => Order::whereBetween('scheduled_delivery_date', [
                    $date->copy()->startOfWeek(),
                    $date->copy()->endOfWeek(),
                ])->delivered()->sum('total'),
            ],
        ];

        return response()->json($stats);
    }
}
