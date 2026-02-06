<?php

namespace App\Http\Controllers;

use App\Services\TrackingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrackingController extends Controller
{
    public function __construct(
        private TrackingService $trackingService
    ) {}

    /**
     * Track an event (API endpoint for frontend).
     */
    public function track(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_name' => ['required', 'string', 'max:100'],
            'properties' => ['nullable', 'array'],
        ]);

        $user = $request->user();

        $event = $this->trackingService->track(
            $validated['event_name'],
            $validated['properties'] ?? [],
            $user,
            $request
        );

        return response()->json([
            'success' => true,
            'event_id' => $event->id,
        ]);
    }

    /**
     * Track page view.
     */
    public function pageView(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'url' => ['required', 'string'],
            'title' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();

        $this->trackingService->trackPageView(
            $validated['url'],
            $validated['title'] ?? null,
            $user
        );

        return response()->json(['success' => true]);
    }
}
