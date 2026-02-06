<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WalletService
{
    /**
     * Get or create wallet for user
     */
    public function getOrCreateWallet(User $user): Wallet
    {
        return Wallet::firstOrCreate(
            ['user_id' => $user->id],
            [
                'balance' => 0,
                'currency' => 'INR',
                'is_active' => true,
                'low_balance_threshold' => 100,
            ]
        );
    }

    /**
     * Recharge wallet with payment
     *
     * @return array{success: bool, transaction?: WalletTransaction, error?: string}
     */
    public function recharge(Wallet $wallet, float $amount, ?Payment $payment = null): array
    {
        if ($amount <= 0) {
            return ['success' => false, 'error' => 'Amount must be greater than zero.'];
        }

        if (! $wallet->is_active) {
            return ['success' => false, 'error' => 'Wallet is not active.'];
        }

        try {
            return DB::transaction(function () use ($wallet, $amount, $payment) {
                $transaction = $wallet->recharge(
                    $amount,
                    'Wallet recharge',
                    $payment ? (string) $payment->id : null
                );

                Log::info('Wallet recharged', [
                    'wallet_id' => $wallet->id,
                    'user_id' => $wallet->user_id,
                    'amount' => $amount,
                    'new_balance' => $wallet->balance,
                ]);

                return [
                    'success' => true,
                    'transaction' => $transaction,
                ];
            });
        } catch (\Exception $e) {
            Log::error('Wallet recharge failed', [
                'wallet_id' => $wallet->id,
                'amount' => $amount,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to recharge wallet.'];
        }
    }

    /**
     * Deduct from wallet for order payment
     *
     * @return array{success: bool, transaction?: WalletTransaction, error?: string}
     */
    public function deductForOrder(Wallet $wallet, Order $order, ?float $amount = null): array
    {
        $amountToDeduct = $amount ?? $order->total;

        if (! $wallet->hasSufficientBalance($amountToDeduct)) {
            return ['success' => false, 'error' => 'Insufficient wallet balance.'];
        }

        try {
            return DB::transaction(function () use ($wallet, $order, $amountToDeduct) {
                $transaction = $wallet->payForOrder($amountToDeduct, $order);

                Log::info('Wallet payment processed', [
                    'wallet_id' => $wallet->id,
                    'order_id' => $order->id,
                    'amount' => $amountToDeduct,
                    'new_balance' => $wallet->balance,
                ]);

                return [
                    'success' => true,
                    'transaction' => $transaction,
                ];
            });
        } catch (\Exception $e) {
            Log::error('Wallet payment failed', [
                'wallet_id' => $wallet->id,
                'order_id' => $order->id,
                'amount' => $amountToDeduct,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to process wallet payment.'];
        }
    }

    /**
     * Add refund to wallet
     *
     * @return array{success: bool, transaction?: WalletTransaction, error?: string}
     */
    public function addRefund(Wallet $wallet, Order $order, float $amount, ?string $description = null): array
    {
        if ($amount <= 0) {
            return ['success' => false, 'error' => 'Refund amount must be greater than zero.'];
        }

        try {
            return DB::transaction(function () use ($wallet, $order, $amount, $description) {
                $transaction = $wallet->refund(
                    $amount,
                    $description ?? "Refund for Order #{$order->order_number}",
                    (string) $order->id
                );

                Log::info('Wallet refund processed', [
                    'wallet_id' => $wallet->id,
                    'order_id' => $order->id,
                    'amount' => $amount,
                    'new_balance' => $wallet->balance,
                ]);

                return [
                    'success' => true,
                    'transaction' => $transaction,
                ];
            });
        } catch (\Exception $e) {
            Log::error('Wallet refund failed', [
                'wallet_id' => $wallet->id,
                'order_id' => $order->id,
                'amount' => $amount,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to process refund.'];
        }
    }

    /**
     * Add loyalty reward
     */
    public function addLoyaltyReward(Wallet $wallet, float $amount, string $description): WalletTransaction
    {
        return $wallet->add($amount, WalletTransaction::TRANSACTION_LOYALTY, $description);
    }

    /**
     * Add referral reward
     */
    public function addReferralReward(Wallet $wallet, float $amount, string $description, ?string $referenceId = null): WalletTransaction
    {
        return $wallet->add($amount, WalletTransaction::TRANSACTION_REFERRAL, $description, $referenceId);
    }

    /**
     * Add cashback
     */
    public function addCashback(Wallet $wallet, Order $order, float $amount, string $description): WalletTransaction
    {
        return $wallet->add(
            $amount,
            WalletTransaction::TRANSACTION_CASHBACK,
            $description,
            (string) $order->id,
            Order::class
        );
    }

    /**
     * Admin adjustment
     */
    public function adminAdjustment(Wallet $wallet, float $amount, string $description, User $admin): WalletTransaction
    {
        $type = $amount >= 0 ? 'credit' : 'debit';
        $absAmount = abs($amount);

        $balanceBefore = $wallet->balance;
        $wallet->balance += $amount;
        $wallet->save();

        return $wallet->transactions()->create([
            'user_id' => $wallet->user_id,
            'type' => $type,
            'amount' => $absAmount,
            'balance_before' => $balanceBefore,
            'balance_after' => $wallet->balance,
            'transaction_type' => WalletTransaction::TRANSACTION_ADMIN_ADJUSTMENT,
            'description' => $description." (by Admin: {$admin->name})",
            'status' => WalletTransaction::STATUS_COMPLETED,
        ]);
    }

    /**
     * Check if wallet is low balance and return threshold gap
     *
     * @return array{is_low: bool, balance: float, threshold: float, gap: float}
     */
    public function checkLowBalance(Wallet $wallet): array
    {
        $isLow = $wallet->isLowBalance();
        $gap = max(0, $wallet->low_balance_threshold - $wallet->balance);

        return [
            'is_low' => $isLow,
            'balance' => (float) $wallet->balance,
            'threshold' => (float) $wallet->low_balance_threshold,
            'gap' => $gap,
        ];
    }

    /**
     * Get wallet summary
     *
     * @return array<string, mixed>
     */
    public function getWalletSummary(Wallet $wallet): array
    {
        $recentTransactions = $wallet->transactions()
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        $monthlyStats = $wallet->transactions()
            ->where('created_at', '>=', now()->startOfMonth())
            ->selectRaw('type, SUM(amount) as total')
            ->groupBy('type')
            ->pluck('total', 'type')
            ->toArray();

        return [
            'balance' => (float) $wallet->balance,
            'formatted_balance' => $wallet->getFormattedBalance(),
            'currency' => $wallet->currency,
            'is_active' => $wallet->is_active,
            'is_low_balance' => $wallet->isLowBalance(),
            'low_balance_threshold' => (float) $wallet->low_balance_threshold,
            'auto_recharge_enabled' => $wallet->auto_recharge_enabled,
            'auto_recharge_amount' => $wallet->auto_recharge_amount,
            'auto_recharge_threshold' => $wallet->auto_recharge_threshold,
            'recent_transactions' => $recentTransactions,
            'monthly_credits' => $monthlyStats['credit'] ?? 0,
            'monthly_debits' => $monthlyStats['debit'] ?? 0,
        ];
    }

    /**
     * Get wallets needing auto-recharge
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, Wallet>
     */
    public function getWalletsNeedingAutoRecharge(): \Illuminate\Database\Eloquent\Collection
    {
        return Wallet::active()
            ->belowAutoRechargeThreshold()
            ->get();
    }
}
