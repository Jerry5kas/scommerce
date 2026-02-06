<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyPoint;
use App\Models\LoyaltyTransaction;
use App\Services\LoyaltyService;
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
     * Display loyalty accounts list.
     */
    public function index(Request $request): Response
    {
        $query = LoyaltyPoint::with('user:id,name,email,phone');

        // Filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        if ($request->filled('min_points')) {
            $query->where('points', '>=', $request->min_points);
        }

        $accounts = $query->orderByDesc('points')->paginate(20)->withQueryString();

        // Stats
        $stats = [
            'total_accounts' => LoyaltyPoint::count(),
            'active_accounts' => LoyaltyPoint::active()->count(),
            'total_points' => LoyaltyPoint::sum('points'),
            'total_earned' => LoyaltyPoint::sum('total_earned'),
            'total_redeemed' => LoyaltyPoint::sum('total_redeemed'),
        ];

        return Inertia::render('admin/loyalty/index', [
            'accounts' => $accounts,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'min_points']),
        ]);
    }

    /**
     * Display loyalty account details.
     */
    public function show(LoyaltyPoint $loyaltyPoint): Response
    {
        $loyaltyPoint->load('user:id,name,email,phone');

        $transactions = $loyaltyPoint->transactions()
            ->orderByDesc('created_at')
            ->paginate(20);

        $summary = [
            'points' => $loyaltyPoint->points,
            'total_earned' => $loyaltyPoint->total_earned,
            'total_redeemed' => $loyaltyPoint->total_redeemed,
            'is_active' => $loyaltyPoint->is_active,
        ];

        return Inertia::render('admin/loyalty/show', [
            'loyaltyPoint' => $loyaltyPoint,
            'transactions' => $transactions,
            'summary' => $summary,
        ]);
    }

    /**
     * Adjust loyalty points.
     */
    public function adjust(Request $request, LoyaltyPoint $loyaltyPoint): RedirectResponse
    {
        $request->validate([
            'points' => ['required', 'integer', 'not_in:0'],
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $result = $this->loyaltyService->adminAdjustment(
            $loyaltyPoint->user,
            $request->points,
            $request->reason
        );

        if (! $result['success']) {
            return back()->withErrors(['points' => $result['error']]);
        }

        $action = $request->points > 0 ? 'Added' : 'Deducted';

        return back()->with('success', "{$action} ".abs($request->points).' points.');
    }

    /**
     * Toggle account status.
     */
    public function toggleStatus(LoyaltyPoint $loyaltyPoint): RedirectResponse
    {
        $loyaltyPoint->update(['is_active' => ! $loyaltyPoint->is_active]);

        $status = $loyaltyPoint->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Loyalty account {$status}.");
    }

    /**
     * Get all transactions.
     */
    public function transactions(Request $request): Response
    {
        $query = LoyaltyTransaction::with(['user:id,name,email']);

        // Filters
        if ($request->filled('type')) {
            $query->byType($request->type);
        }

        if ($request->filled('source')) {
            $query->bySource($request->source);
        }

        if ($request->filled('user_id')) {
            $query->forUser($request->user_id);
        }

        $transactions = $query->orderByDesc('created_at')->paginate(30)->withQueryString();

        return Inertia::render('admin/loyalty/transactions', [
            'transactions' => $transactions,
            'filters' => $request->only(['type', 'source', 'user_id']),
            'typeOptions' => LoyaltyTransaction::typeOptions(),
            'sourceOptions' => LoyaltyTransaction::sourceOptions(),
        ]);
    }
}
