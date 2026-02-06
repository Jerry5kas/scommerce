<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function __construct(
        private WalletService $walletService
    ) {}

    /**
     * List all wallets
     */
    public function index(Request $request): Response
    {
        $query = Wallet::query()
            ->with('user');

        // Filter by status
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            } elseif ($request->status === 'low_balance') {
                $query->lowBalance();
            }
        }

        // Filter by auto-recharge
        if ($request->filled('auto_recharge')) {
            $query->where('auto_recharge_enabled', $request->boolean('auto_recharge'));
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->whereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%"));
        }

        $wallets = $query->orderByDesc('balance')->paginate(20);

        // Stats
        $stats = [
            'total_balance' => Wallet::sum('balance'),
            'total_wallets' => Wallet::count(),
            'active_wallets' => Wallet::active()->count(),
            'low_balance_wallets' => Wallet::lowBalance()->count(),
        ];

        return Inertia::render('admin/wallets/index', [
            'wallets' => $wallets,
            'stats' => $stats,
            'filters' => $request->only(['status', 'auto_recharge', 'search']),
        ]);
    }

    /**
     * Show wallet details
     */
    public function show(Wallet $wallet): Response
    {
        $wallet->load('user');

        $transactions = $wallet->transactions()
            ->orderByDesc('created_at')
            ->paginate(20);

        $summary = $this->walletService->getWalletSummary($wallet);

        return Inertia::render('admin/wallets/show', [
            'wallet' => $wallet,
            'transactions' => $transactions,
            'summary' => $summary,
            'transactionTypeOptions' => WalletTransaction::transactionTypeOptions(),
        ]);
    }

    /**
     * Admin balance adjustment
     */
    public function adjust(Request $request, Wallet $wallet): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'not_in:0'],
            'description' => ['required', 'string', 'max:500'],
        ]);

        $admin = $request->user();

        // Check if deduction would result in negative balance
        if ($validated['amount'] < 0 && ($wallet->balance + $validated['amount']) < 0) {
            return back()->with('error', 'Insufficient wallet balance for this deduction.');
        }

        $this->walletService->adminAdjustment(
            $wallet,
            $validated['amount'],
            $validated['description'],
            $admin
        );

        $action = $validated['amount'] > 0 ? 'credited' : 'debited';
        $absAmount = abs($validated['amount']);

        return back()->with('success', "₹{$absAmount} {$action} successfully.");
    }

    /**
     * Toggle wallet status
     */
    public function toggleStatus(Wallet $wallet): RedirectResponse
    {
        $wallet->update(['is_active' => ! $wallet->is_active]);

        $status = $wallet->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Wallet {$status} successfully.");
    }

    /**
     * Get wallet transactions (API)
     */
    public function transactions(Request $request, Wallet $wallet)
    {
        $type = $request->string('type')->toString();
        $transactionType = $request->string('transaction_type')->toString();

        $query = $wallet->transactions()->orderByDesc('created_at');

        if ($type && in_array($type, ['credit', 'debit'], true)) {
            $query->where('type', $type);
        }

        if ($transactionType) {
            $query->where('transaction_type', $transactionType);
        }

        return $query->paginate($request->integer('per_page', 20));
    }
}
