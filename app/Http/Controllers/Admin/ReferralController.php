<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Referral;
use App\Services\ReferralService;
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
     * Display referrals list.
     */
    public function index(Request $request): Response
    {
        $query = Referral::with([
            'referrer:id,name,email,phone',
            'referred:id,name,email,phone,created_at',
        ]);

        // Filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('referral_code', 'like', "%{$search}%")
                    ->orWhereHas('referrer', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('referred', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('unpaid')) {
            $query->unpaidRewards();
        }

        $referrals = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        // Stats
        $stats = [
            'total_referrals' => Referral::count(),
            'pending_referrals' => Referral::pending()->count(),
            'completed_referrals' => Referral::completed()->count(),
            'total_rewards_paid' => Referral::completed()
                ->where('referrer_reward_paid', true)
                ->sum('referrer_reward'),
            'pending_rewards' => Referral::completed()
                ->where('referrer_reward_paid', false)
                ->sum('referrer_reward'),
        ];

        return Inertia::render('admin/referrals/index', [
            'referrals' => $referrals,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'unpaid']),
            'statusOptions' => Referral::statusOptions(),
        ]);
    }

    /**
     * Display referral details.
     */
    public function show(Referral $referral): Response
    {
        $referral->load([
            'referrer:id,name,email,phone,created_at',
            'referred:id,name,email,phone,created_at',
        ]);

        // Get referred user's orders
        $referredOrders = $referral->referred->orders()
            ->select('id', 'order_number', 'total', 'status', 'created_at')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        return Inertia::render('admin/referrals/show', [
            'referral' => $referral,
            'referredOrders' => $referredOrders,
        ]);
    }

    /**
     * Approve referral and process rewards.
     */
    public function approve(Referral $referral): RedirectResponse
    {
        if (! $referral->isPending()) {
            return back()->withErrors(['error' => 'Referral is not pending.']);
        }

        $referral->markAsCompleted();
        $this->referralService->processRewards($referral);

        return back()->with('success', 'Referral approved and rewards processed.');
    }

    /**
     * Reject referral.
     */
    public function reject(Request $request, Referral $referral): RedirectResponse
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        if (! $referral->isPending()) {
            return back()->withErrors(['error' => 'Referral is not pending.']);
        }

        $referral->cancel($request->reason);

        return back()->with('success', 'Referral rejected.');
    }

    /**
     * Process unpaid rewards.
     */
    public function processRewards(Referral $referral): RedirectResponse
    {
        if (! $referral->isCompleted()) {
            return back()->withErrors(['error' => 'Referral is not completed.']);
        }

        if (! $referral->hasUnpaidRewards()) {
            return back()->withErrors(['error' => 'All rewards have been paid.']);
        }

        $this->referralService->processRewards($referral);

        return back()->with('success', 'Rewards processed successfully.');
    }

    /**
     * Get referral reports.
     */
    public function reports(Request $request): Response
    {
        $startDate = $request->get('start_date', now()->subMonth()->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        // Daily referrals
        $dailyReferrals = Referral::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top referrers
        $topReferrers = Referral::selectRaw('referrer_id, COUNT(*) as referral_count, SUM(referrer_reward) as total_rewards')
            ->completed()
            ->with('referrer:id,name,email')
            ->groupBy('referrer_id')
            ->orderByDesc('referral_count')
            ->limit(10)
            ->get();

        // Conversion rate
        $totalReferrals = Referral::whereBetween('created_at', [$startDate, $endDate])->count();
        $completedReferrals = Referral::completed()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
        $conversionRate = $totalReferrals > 0 ? round(($completedReferrals / $totalReferrals) * 100, 2) : 0;

        return Inertia::render('admin/referrals/reports', [
            'dailyReferrals' => $dailyReferrals,
            'topReferrers' => $topReferrers,
            'conversionRate' => $conversionRate,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
