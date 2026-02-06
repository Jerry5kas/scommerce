<?php

namespace App\Http\Controllers;

use App\Services\LoyaltyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoyaltyController extends Controller
{
    public function __construct(
        private LoyaltyService $loyaltyService
    ) {}

    /**
     * Display loyalty dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $summary = $this->loyaltyService->getLoyaltySummary($user);

        $loyaltyAccount = $this->loyaltyService->getOrCreateLoyaltyAccount($user);
        $transactions = $loyaltyAccount->transactions()
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('loyalty/index', [
            'summary' => $summary,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Get loyalty balance (API).
     */
    public function balance(Request $request): JsonResponse
    {
        $user = $request->user();
        $summary = $this->loyaltyService->getLoyaltySummary($user);

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }

    /**
     * Get transaction history.
     */
    public function transactions(Request $request): Response
    {
        $user = $request->user();
        $loyaltyAccount = $this->loyaltyService->getOrCreateLoyaltyAccount($user);

        $transactions = $loyaltyAccount->transactions()
            ->orderByDesc('created_at')
            ->paginate(30);

        return Inertia::render('loyalty/transactions', [
            'transactions' => $transactions,
            'balance' => $loyaltyAccount->points,
        ]);
    }

    /**
     * Convert points to wallet.
     */
    public function convertToWallet(Request $request): RedirectResponse
    {
        $request->validate([
            'points' => ['required', 'integer', 'min:1'],
        ]);

        $user = $request->user();
        $result = $this->loyaltyService->convertPointsToWallet($user, $request->points);

        if (! $result['success']) {
            return back()->withErrors(['points' => $result['error']]);
        }

        return back()->with('success', "Converted {$result['points']} points to ₹{$result['amount']} wallet balance.");
    }
}
