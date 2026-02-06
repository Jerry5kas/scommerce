<?php

namespace App\Http\Controllers\Api\V1\Driver;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompleteDeliveryRequest;
use App\Models\Delivery;
use App\Models\DeliveryTracking;
use App\Services\DeliveryProofService;
use App\Services\DeliveryStatusService;
use App\Services\RouteAssignmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    public function __construct(
        private DeliveryStatusService $statusService,
        private DeliveryProofService $proofService,
        private RouteAssignmentService $routeService
    ) {}

    /**
     * Get driver's assigned deliveries for today or specified date.
     */
    public function index(Request $request): JsonResponse
    {
        $driver = $request->user(); // Driver authenticated via Sanctum
        $date = $request->get('date', now()->toDateString());

        $route = $this->routeService->getDriverRoute($driver, $date);

        return response()->json([
            'success' => true,
            'date' => $date,
            'deliveries' => $route['deliveries']->map(fn ($d) => $this->formatDelivery($d)),
            'stats' => $route['stats'],
        ]);
    }

    /**
     * Get a specific delivery.
     */
    public function show(Request $request, Delivery $delivery): JsonResponse
    {
        $driver = $request->user();

        // Ensure delivery belongs to this driver
        if ($delivery->driver_id !== $driver->id) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        $delivery->load(['order.items', 'user', 'address', 'zone']);

        return response()->json([
            'success' => true,
            'delivery' => $this->formatDelivery($delivery, true),
        ]);
    }

    /**
     * Start delivery (mark as out for delivery).
     */
    public function startDelivery(Request $request, Delivery $delivery): JsonResponse
    {
        $driver = $request->user();

        if ($delivery->driver_id !== $driver->id) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        if ($delivery->status !== Delivery::STATUS_ASSIGNED) {
            return response()->json([
                'success' => false,
                'error' => 'Delivery must be assigned before starting.',
            ], 422);
        }

        try {
            $delivery->markAsOutForDelivery();

            return response()->json([
                'success' => true,
                'message' => 'Delivery started.',
                'delivery' => $this->formatDelivery($delivery->fresh()),
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 422);
        }
    }

    /**
     * Update driver location during delivery.
     */
    public function updateLocation(Request $request, Delivery $delivery): JsonResponse
    {
        $driver = $request->user();

        if ($delivery->driver_id !== $driver->id) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'accuracy' => ['nullable', 'numeric', 'min:0'],
            'speed' => ['nullable', 'numeric', 'min:0'],
            'heading' => ['nullable', 'numeric', 'between:0,360'],
        ]);

        DeliveryTracking::create([
            'delivery_id' => $delivery->id,
            'driver_id' => $driver->id,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'accuracy' => $request->accuracy,
            'speed' => $request->speed,
            'heading' => $request->heading,
            'status' => $delivery->status,
            'tracked_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Location updated.',
        ]);
    }

    /**
     * Complete delivery with proof image.
     */
    public function completeDelivery(CompleteDeliveryRequest $request, Delivery $delivery): JsonResponse
    {
        $driver = $request->user();

        if ($delivery->driver_id !== $driver->id) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        if ($delivery->status !== Delivery::STATUS_OUT_FOR_DELIVERY) {
            return response()->json([
                'success' => false,
                'error' => 'Delivery must be out for delivery to complete.',
            ], 422);
        }

        $result = $this->proofService->completeDeliveryWithProof(
            $delivery,
            $request->file('proof_image')
        );

        if (! $result['success']) {
            return response()->json(['success' => false, 'error' => $result['error']], 422);
        }

        // Add notes and signature if provided
        $updates = [];
        if ($request->filled('notes')) {
            $updates['notes'] = $request->notes;
        }
        if ($request->filled('customer_signature')) {
            $updates['customer_signature'] = $request->customer_signature;
        }
        if (! empty($updates)) {
            $delivery->update($updates);
        }

        return response()->json([
            'success' => true,
            'message' => 'Delivery completed successfully.',
            'delivery' => $this->formatDelivery($delivery->fresh()),
        ]);
    }

    /**
     * Mark delivery as failed.
     */
    public function failDelivery(Request $request, Delivery $delivery): JsonResponse
    {
        $driver = $request->user();

        if ($delivery->driver_id !== $driver->id) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        try {
            $delivery->markAsFailed($request->reason);

            return response()->json([
                'success' => true,
                'message' => 'Delivery marked as failed.',
                'delivery' => $this->formatDelivery($delivery->fresh()),
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 422);
        }
    }

    /**
     * Get delivery route for today.
     */
    public function getRoute(Request $request): JsonResponse
    {
        $driver = $request->user();
        $date = $request->get('date', now()->toDateString());

        $route = $this->routeService->getDriverRoute($driver, $date);

        // Build route with addresses
        $deliveries = $route['deliveries']->map(function ($delivery) {
            return [
                'id' => $delivery->id,
                'sequence' => $delivery->sequence,
                'status' => $delivery->status,
                'address' => [
                    'full_address' => $delivery->address->full_address ?? $delivery->address->address_line,
                    'latitude' => $delivery->address->latitude,
                    'longitude' => $delivery->address->longitude,
                ],
                'customer' => [
                    'name' => $delivery->user->name,
                    'phone' => $delivery->user->phone,
                ],
                'order_number' => $delivery->order->order_number,
                'time_slot' => $delivery->time_slot,
            ];
        });

        return response()->json([
            'success' => true,
            'date' => $date,
            'route' => $deliveries,
            'stats' => $route['stats'],
        ]);
    }

    /**
     * Batch update location for multiple deliveries.
     */
    public function batchUpdateLocation(Request $request): JsonResponse
    {
        $driver = $request->user();

        $request->validate([
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'accuracy' => ['nullable', 'numeric', 'min:0'],
            'speed' => ['nullable', 'numeric', 'min:0'],
            'heading' => ['nullable', 'numeric', 'between:0,360'],
        ]);

        // Get all active deliveries for this driver today
        $activeDeliveries = Delivery::where('driver_id', $driver->id)
            ->whereDate('scheduled_date', today())
            ->whereIn('status', [Delivery::STATUS_ASSIGNED, Delivery::STATUS_OUT_FOR_DELIVERY])
            ->get();

        foreach ($activeDeliveries as $delivery) {
            DeliveryTracking::create([
                'delivery_id' => $delivery->id,
                'driver_id' => $driver->id,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'accuracy' => $request->accuracy,
                'speed' => $request->speed,
                'heading' => $request->heading,
                'status' => $delivery->status,
                'tracked_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Location updated for '.$activeDeliveries->count().' deliveries.',
        ]);
    }

    /**
     * Format delivery for API response.
     *
     * @return array<string, mixed>
     */
    protected function formatDelivery(Delivery $delivery, bool $detailed = false): array
    {
        $data = [
            'id' => $delivery->id,
            'order_number' => $delivery->order->order_number,
            'status' => $delivery->status,
            'status_label' => $delivery->getStatusLabel(),
            'scheduled_date' => $delivery->scheduled_date->toDateString(),
            'scheduled_time' => $delivery->scheduled_time?->format('H:i'),
            'time_slot' => $delivery->time_slot,
            'sequence' => $delivery->sequence,
            'customer' => [
                'name' => $delivery->user->name,
                'phone' => $delivery->user->phone,
            ],
            'address' => [
                'address_line' => $delivery->address->address_line ?? null,
                'area' => $delivery->address->area ?? null,
                'city' => $delivery->address->city ?? null,
                'pincode' => $delivery->address->pincode ?? null,
                'latitude' => $delivery->address->latitude,
                'longitude' => $delivery->address->longitude,
            ],
            'delivery_instructions' => $delivery->delivery_instructions,
            'has_proof' => $delivery->hasProof(),
        ];

        if ($detailed) {
            $data['order'] = [
                'id' => $delivery->order->id,
                'total' => $delivery->order->total,
                'payment_method' => $delivery->order->payment_method,
                'payment_status' => $delivery->order->payment_status,
                'items_count' => $delivery->order->items->count(),
                'items' => $delivery->order->items->map(fn ($item) => [
                    'name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ]),
            ];
            $data['zone'] = [
                'name' => $delivery->zone->name,
            ];
            $data['assigned_at'] = $delivery->assigned_at?->toIso8601String();
            $data['dispatched_at'] = $delivery->dispatched_at?->toIso8601String();
            $data['delivered_at'] = $delivery->delivered_at?->toIso8601String();
            $data['notes'] = $delivery->notes;
        }

        return $data;
    }
}
