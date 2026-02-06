<?php

namespace App\Http\Controllers;

use App\Models\Bottle;
use App\Services\BottleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BottleController extends Controller
{
    public function __construct(
        private BottleService $bottleService
    ) {}

    /**
     * Display a listing of user's bottles.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $bottles = $this->bottleService->getUserBottles($user);
        $balance = $this->bottleService->getUserBottleBalance($user);

        return Inertia::render('bottles/index', [
            'bottles' => $bottles,
            'balance' => $balance,
        ]);
    }

    /**
     * Display the specified bottle.
     */
    public function show(Request $request, Bottle $bottle): Response
    {
        $user = $request->user();

        // Ensure user owns this bottle
        if ($bottle->current_user_id !== $user->id) {
            abort(403);
        }

        $bottle->load(['currentSubscription', 'logs' => fn ($q) => $q->forUser($user->id)->latest()->limit(10)]);

        return Inertia::render('bottles/show', [
            'bottle' => $bottle,
        ]);
    }

    /**
     * Get user's bottle balance (API endpoint).
     */
    public function getBalance(Request $request): JsonResponse
    {
        $user = $request->user();
        $balance = $this->bottleService->getUserBottleBalance($user);

        return response()->json([
            'success' => true,
            'balance' => $balance,
        ]);
    }

    /**
     * Get user's bottle history.
     */
    public function history(Request $request): Response
    {
        $user = $request->user();

        $logs = \App\Models\BottleLog::forUser($user->id)
            ->with(['bottle'])
            ->latest()
            ->paginate(20);

        return Inertia::render('bottles/history', [
            'logs' => $logs,
        ]);
    }
}
