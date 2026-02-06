<?php

namespace App\Http\Controllers;

use App\Models\WalletTransaction;
use App\Services\PaymentService;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function __construct(
        private WalletService $walletService,
        private PaymentService $paymentService
    ) {}

    /**
     * Show wallet page with balance and transactions
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);

        $transactions = $wallet->transactions()
            ->orderByDesc('created_at')
            ->paginate(20);

        $summary = $this->walletService->getWalletSummary($wallet);

        return Inertia::render('wallet/index', [
            'wallet' => $wallet,
            'transactions' => $transactions,
            'summary' => $summary,
            'transactionTypeOptions' => WalletTransaction::transactionTypeOptions(),
        ]);
    }

    /**
     * Show recharge page
     */
    public function rechargeForm(Request $request): Response
    {
        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);

        return Inertia::render('wallet/recharge', [
            'wallet' => $wallet,
            'suggestedAmounts' => [100, 200, 500, 1000, 2000],
        ]);
    }

    /**
     * Process wallet recharge
     */
    public function recharge(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:10', 'max:50000'],
            'payment_method' => ['required', 'string', 'in:gateway,upi'],
        ]);

        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);

        // TODO: Process payment via gateway
        // For now, mock successful recharge
        $result = $this->walletService->recharge($wallet, $validated['amount']);

        if (! $result['success']) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $result['error']], 422);
            }

            return back()->withErrors(['amount' => $result['error']]);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Wallet recharged successfully.',
                'balance' => $wallet->fresh()->balance,
            ]);
        }

        return redirect()->route('wallet.index')
            ->with('success', "₹{$validated['amount']} added to your wallet.");
    }

    /**
     * Get transaction history (API)
     */
    public function transactions(Request $request): JsonResponse
    {
        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);

        $type = $request->string('type')->toString();
        $transactionType = $request->string('transaction_type')->toString();

        $query = $wallet->transactions()->orderByDesc('created_at');

        if ($type && in_array($type, ['credit', 'debit'], true)) {
            $query->where('type', $type);
        }

        if ($transactionType) {
            $query->where('transaction_type', $transactionType);
        }

        $transactions = $query->paginate($request->integer('per_page', 20));

        return response()->json([
            'balance' => $wallet->balance,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Get wallet balance (API)
     */
    public function balance(Request $request): JsonResponse
    {
        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);

        return response()->json([
            'balance' => (float) $wallet->balance,
            'formatted_balance' => $wallet->getFormattedBalance(),
            'is_active' => $wallet->is_active,
            'is_low_balance' => $wallet->isLowBalance(),
        ]);
    }

    /**
     * Show auto-recharge settings page
     */
    public function autoRechargeSettings(Request $request): Response
    {
        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);

        return Inertia::render('wallet/auto-recharge', [
            'wallet' => $wallet,
        ]);
    }

    /**
     * Update auto-recharge settings
     */
    public function setAutoRecharge(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'enabled' => ['required', 'boolean'],
            'amount' => ['required_if:enabled,true', 'nullable', 'numeric', 'min:100', 'max:10000'],
            'threshold' => ['required_if:enabled,true', 'nullable', 'numeric', 'min:50', 'max:5000'],
        ]);

        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);

        $wallet->setAutoRecharge(
            $validated['enabled'],
            $validated['amount'] ?? null,
            $validated['threshold'] ?? null
        );

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => $validated['enabled']
                    ? 'Auto-recharge enabled.'
                    : 'Auto-recharge disabled.',
            ]);
        }

        return redirect()->route('wallet.index')
            ->with('success', $validated['enabled'] ? 'Auto-recharge enabled.' : 'Auto-recharge disabled.');
    }

    /**
     * Set low balance threshold
     */
    public function setLowBalanceThreshold(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'threshold' => ['required', 'numeric', 'min:0', 'max:10000'],
        ]);

        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);

        $wallet->update(['low_balance_threshold' => $validated['threshold']]);

        return response()->json([
            'success' => true,
            'message' => 'Low balance threshold updated.',
        ]);
    }
}
