<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Services\DeliveryProofService;
use App\Services\DeliveryStatusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DeliveryController extends Controller
{
    public function __construct(
        private DeliveryStatusService $statusService,
        private DeliveryProofService $proofService
    ) {}

    /**
     * Display a listing of user's deliveries.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Delivery::query()
            ->where('user_id', $user->id)
            ->with(['order', 'driver', 'address']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $deliveries = $query->latest('scheduled_date')
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('deliveries/index', [
            'deliveries' => $deliveries,
            'filters' => $request->only(['status']),
            'statusOptions' => Delivery::statusOptions(),
        ]);
    }

    /**
     * Display the specified delivery.
     */
    public function show(Request $request, Delivery $delivery): Response
    {
        $user = $request->user();

        // Ensure user owns this delivery
        if ($delivery->user_id !== $user->id) {
            abort(403);
        }

        $delivery->load(['order.items', 'driver', 'address', 'zone']);

        $timeline = $this->statusService->getDeliveryTimeline($delivery);

        return Inertia::render('deliveries/show', [
            'delivery' => $delivery,
            'timeline' => $timeline,
            'proofUrl' => $this->proofService->getProofUrl($delivery),
        ]);
    }

    /**
     * Track a delivery (live location page).
     */
    public function track(Request $request, Delivery $delivery): Response
    {
        $user = $request->user();

        // Ensure user owns this delivery
        if ($delivery->user_id !== $user->id) {
            abort(403);
        }

        $delivery->load(['order', 'driver', 'address', 'zone']);

        $timeline = $this->statusService->getDeliveryTimeline($delivery);
        $latestLocation = $delivery->getLatestLocation();

        return Inertia::render('deliveries/track', [
            'delivery' => $delivery,
            'timeline' => $timeline,
            'initialLocation' => $latestLocation?->getCoordinates(),
            'deliveryAddress' => [
                'lat' => $delivery->address->latitude ?? null,
                'lng' => $delivery->address->longitude ?? null,
            ],
        ]);
    }

    /**
     * Get delivery status (API endpoint).
     */
    public function getStatus(Request $request, Delivery $delivery): JsonResponse
    {
        $user = $request->user();

        // Ensure user owns this delivery
        if ($delivery->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $delivery->load(['driver']);
        $latestLocation = $delivery->getLatestLocation();

        return response()->json([
            'status' => $delivery->status,
            'status_label' => $delivery->getStatusLabel(),
            'driver' => $delivery->driver ? [
                'name' => $delivery->driver->name,
                'phone' => $delivery->driver->phone,
            ] : null,
            'location' => $latestLocation?->getCoordinates(),
            'dispatched_at' => $delivery->dispatched_at?->toIso8601String(),
            'delivered_at' => $delivery->delivered_at?->toIso8601String(),
            'proof_url' => $this->proofService->getProofUrl($delivery),
        ]);
    }

    /**
     * Get live tracking data (API endpoint).
     */
    public function liveTracking(Request $request, Delivery $delivery): JsonResponse
    {
        $user = $request->user();

        // Ensure user owns this delivery
        if ($delivery->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Only allow tracking for out-for-delivery status
        if ($delivery->status !== Delivery::STATUS_OUT_FOR_DELIVERY) {
            return response()->json([
                'tracking_available' => false,
                'status' => $delivery->status,
                'message' => 'Live tracking is only available when delivery is out for delivery.',
            ]);
        }

        $latestLocation = $delivery->getLatestLocation();

        return response()->json([
            'tracking_available' => true,
            'status' => $delivery->status,
            'location' => $latestLocation?->getCoordinates(),
            'accuracy' => $latestLocation?->accuracy,
            'speed' => $latestLocation?->speed,
            'last_update' => $latestLocation?->tracked_at?->toIso8601String(),
            'driver' => $delivery->driver ? [
                'name' => $delivery->driver->name,
                'phone' => $delivery->driver->phone,
            ] : null,
        ]);
    }
}
