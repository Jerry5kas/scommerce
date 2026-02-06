<?php

namespace App\Http\Controllers;

use App\Services\ReferralService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReferralController extends Controller
{
    public function __construct(
        private ReferralService $referralService
    ) {}

    /**
     * Display referral dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $stats = $this->referralService->getReferralStats($user);
        $referrals = $this->referralService->getUserReferrals($user, 20);

        return Inertia::render('referrals/index', [
            'stats' => $stats,
            'referrals' => $referrals,
        ]);
    }

    /**
     * Get referral stats (API).
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        $stats = $this->referralService->getReferralStats($user);

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Get referral list.
     */
    public function referrals(Request $request): Response
    {
        $user = $request->user();
        $referrals = $this->referralService->getUserReferrals($user, 50);

        return Inertia::render('referrals/list', [
            'referrals' => $referrals,
        ]);
    }

    /**
     * Apply referral code.
     */
    public function applyCode(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'min:3', 'max:20'],
        ]);

        $user = $request->user();

        // Check if user already has a referral
        if ($user->referred_by_id) {
            return back()->withErrors(['code' => 'You have already used a referral code.']);
        }

        $result = $this->referralService->applyReferralCode($user, strtoupper($request->code));

        if (! $result['success']) {
            return back()->withErrors(['code' => $result['error']]);
        }

        return back()->with('success', 'Referral code applied successfully! Complete your first order to receive your reward.');
    }

    /**
     * Validate referral code (API).
     */
    public function validateCode(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $valid = $this->referralService->validateReferralCode(strtoupper($request->code));

        return response()->json([
            'valid' => $valid,
        ]);
    }
}
