<?php

namespace App\Http\Controllers\Api\V1\Driver;

use App\Http\Controllers\Controller;
use App\Models\Bottle;
use App\Models\BottleLog;
use App\Models\Delivery;
use App\Services\BottleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BottleController extends Controller
{
    public function __construct(
        private BottleService $bottleService
    ) {}

    /**
     * Get bottles for a delivery (to be returned).
     */
    public function getDeliveryBottles(Request $request, Delivery $delivery): JsonResponse
    {
        $driver = $request->user();

        if ($delivery->driver_id !== $driver->id) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        // Get bottles issued to this user/subscription
        $bottles = Bottle::query()
            ->where('current_user_id', $delivery->user_id)
            ->issued()
            ->get()
            ->map(fn ($bottle) => [
                'id' => $bottle->id,
                'bottle_number' => $bottle->bottle_number,
                'barcode' => $bottle->barcode,
                'type' => $bottle->type,
                'capacity' => $bottle->capacity,
                'issued_at' => $bottle->issued_at?->toDateString(),
            ]);

        return response()->json([
            'success' => true,
            'bottles' => $bottles,
        ]);
    }

    /**
     * Return a bottle during delivery.
     */
    public function returnBottle(Request $request, Delivery $delivery): JsonResponse
    {
        $driver = $request->user();

        if ($delivery->driver_id !== $driver->id) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'bottle_id' => ['required', 'integer', 'exists:bottles,id'],
            'condition' => ['required', 'string', 'in:good,damaged'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $bottle = Bottle::findOrFail($request->bottle_id);

        if ($bottle->current_user_id !== $delivery->user_id) {
            return response()->json([
                'success' => false,
                'error' => 'This bottle is not issued to this customer.',
            ], 422);
        }

        $result = $this->bottleService->returnBottle($bottle, $request->condition, $delivery, [
            'action_by' => BottleLog::ACTION_BY_DRIVER,
            'action_by_id' => $driver->id,
            'notes' => $request->notes,
        ]);

        if (! $result['success']) {
            return response()->json(['success' => false, 'error' => $result['error']], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Bottle returned successfully.',
            'refund' => $result['refund'],
        ]);
    }

    /**
     * Issue a bottle during delivery.
     */
    public function issueBottle(Request $request, Delivery $delivery): JsonResponse
    {
        $driver = $request->user();

        if ($delivery->driver_id !== $driver->id) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'bottle_id' => ['required', 'integer', 'exists:bottles,id'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $bottle = Bottle::findOrFail($request->bottle_id);

        if (! $bottle->isAvailable()) {
            return response()->json([
                'success' => false,
                'error' => 'This bottle is not available.',
            ], 422);
        }

        $user = $delivery->user;
        $subscription = $delivery->order->subscription ?? null;

        $result = $this->bottleService->issueBottle($user, $bottle, $subscription, $delivery, [
            'action_by' => BottleLog::ACTION_BY_DRIVER,
            'action_by_id' => $driver->id,
            'notes' => $request->notes,
        ]);

        if (! $result['success']) {
            return response()->json(['success' => false, 'error' => $result['error']], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Bottle issued successfully.',
            'bottle' => [
                'id' => $bottle->id,
                'bottle_number' => $bottle->bottle_number,
            ],
        ]);
    }

    /**
     * Mark a bottle as damaged during delivery.
     */
    public function markDamaged(Request $request, Delivery $delivery): JsonResponse
    {
        $driver = $request->user();

        if ($delivery->driver_id !== $driver->id) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'bottle_id' => ['required', 'integer', 'exists:bottles,id'],
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $bottle = Bottle::findOrFail($request->bottle_id);

        $result = $this->bottleService->markAsDamaged($bottle, $request->reason, $delivery, [
            'action_by' => BottleLog::ACTION_BY_DRIVER,
            'action_by_id' => $driver->id,
        ]);

        if (! $result['success']) {
            return response()->json(['success' => false, 'error' => $result['error']], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Bottle marked as damaged.',
        ]);
    }

    /**
     * Scan barcode to find bottle.
     */
    public function scanBarcode(Request $request): JsonResponse
    {
        $request->validate(['barcode' => 'required|string']);

        $bottle = $this->bottleService->getBottleByBarcode($request->barcode);

        if (! $bottle) {
            return response()->json([
                'success' => false,
                'error' => 'Bottle not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'bottle' => [
                'id' => $bottle->id,
                'bottle_number' => $bottle->bottle_number,
                'barcode' => $bottle->barcode,
                'type' => $bottle->type,
                'status' => $bottle->status,
                'current_user_id' => $bottle->current_user_id,
            ],
        ]);
    }
}
