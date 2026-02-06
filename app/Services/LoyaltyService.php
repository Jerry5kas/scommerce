<?php

namespace App\Services;

use App\Models\Delivery;
use App\Models\LoyaltyPoint;
use App\Models\LoyaltyTransaction;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LoyaltyService
{
    // Configurable rates (could be moved to config/loyalty.php)
    protected const POINTS_PER_DELIVERY = 10;

    protected const POINTS_PER_ORDER_PERCENT = 1; // 1% of order value

    protected const POINTS_TO_RUPEE_RATE = 1; // 1 point = 1 rupee

    protected const MIN_ORDER_FOR_POINTS = 100;

    public function __construct(
        private WalletService $walletService
    ) {}

    /**
     * Get or create loyalty account for user
     */
    public function getOrCreateLoyaltyAccount(User $user): LoyaltyPoint
    {
        return LoyaltyPoint::firstOrCreate(
            ['user_id' => $user->id],
            [
                'points' => 0,
                'total_earned' => 0,
                'total_redeemed' => 0,
                'is_active' => true,
            ]
        );
    }

    /**
     * Award points for completed delivery
     *
     * @return array{success: bool, points?: int, transaction?: LoyaltyTransaction, error?: string}
     */
    public function awardPointsForDelivery(User $user, Delivery $delivery): array
    {
        try {
            $loyaltyAccount = $this->getOrCreateLoyaltyAccount($user);

            if (! $loyaltyAccount->is_active) {
                return ['success' => false, 'error' => 'Loyalty account is inactive.'];
            }

            $points = self::POINTS_PER_DELIVERY;

            $transaction = $loyaltyAccount->addPoints(
                $points,
                LoyaltyTransaction::SOURCE_DELIVERY,
                "Points for delivery #{$delivery->id}",
                $delivery
            );

            Log::info('Awarded loyalty points for delivery', [
                'user_id' => $user->id,
                'delivery_id' => $delivery->id,
                'points' => $points,
            ]);

            return [
                'success' => true,
                'points' => $points,
                'transaction' => $transaction,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to award delivery points', [
                'user_id' => $user->id,
                'delivery_id' => $delivery->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to award points.'];
        }
    }

    /**
     * Award points for completed order
     *
     * @return array{success: bool, points?: int, transaction?: LoyaltyTransaction, error?: string}
     */
    public function awardPointsForOrder(User $user, Order $order): array
    {
        try {
            if ($order->total < self::MIN_ORDER_FOR_POINTS) {
                return ['success' => false, 'error' => 'Order value below minimum for points.'];
            }

            $loyaltyAccount = $this->getOrCreateLoyaltyAccount($user);

            if (! $loyaltyAccount->is_active) {
                return ['success' => false, 'error' => 'Loyalty account is inactive.'];
            }

            $points = $this->calculatePointsForOrder($order);

            $transaction = $loyaltyAccount->addPoints(
                $points,
                LoyaltyTransaction::SOURCE_PURCHASE,
                "Points for order #{$order->order_number}",
                $order
            );

            Log::info('Awarded loyalty points for order', [
                'user_id' => $user->id,
                'order_id' => $order->id,
                'order_total' => $order->total,
                'points' => $points,
            ]);

            return [
                'success' => true,
                'points' => $points,
                'transaction' => $transaction,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to award order points', [
                'user_id' => $user->id,
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to award points.'];
        }
    }

    /**
     * Award points for referral
     *
     * @return array{success: bool, points?: int, transaction?: LoyaltyTransaction, error?: string}
     */
    public function awardPointsForReferral(User $user, int $points, ?string $description = null): array
    {
        try {
            $loyaltyAccount = $this->getOrCreateLoyaltyAccount($user);

            if (! $loyaltyAccount->is_active) {
                return ['success' => false, 'error' => 'Loyalty account is inactive.'];
            }

            $transaction = $loyaltyAccount->addPoints(
                $points,
                LoyaltyTransaction::SOURCE_REFERRAL,
                $description ?? 'Referral bonus'
            );

            Log::info('Awarded loyalty points for referral', [
                'user_id' => $user->id,
                'points' => $points,
            ]);

            return [
                'success' => true,
                'points' => $points,
                'transaction' => $transaction,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to award referral points', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to award points.'];
        }
    }

    /**
     * Redeem points for order discount
     *
     * @return array{success: bool, points?: int, discount?: float, transaction?: LoyaltyTransaction, error?: string}
     */
    public function redeemPoints(User $user, int $points, Order $order): array
    {
        try {
            $loyaltyAccount = $this->getOrCreateLoyaltyAccount($user);

            if (! $loyaltyAccount->hasSufficientPoints($points)) {
                return ['success' => false, 'error' => 'Insufficient points balance.'];
            }

            $discount = $this->convertPointsToMoney($points);

            $transaction = $loyaltyAccount->deductPoints(
                $points,
                LoyaltyTransaction::SOURCE_PURCHASE,
                "Redeemed for order #{$order->order_number}",
                $order
            );

            Log::info('Redeemed loyalty points', [
                'user_id' => $user->id,
                'order_id' => $order->id,
                'points' => $points,
                'discount' => $discount,
            ]);

            return [
                'success' => true,
                'points' => $points,
                'discount' => $discount,
                'transaction' => $transaction,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to redeem points', [
                'user_id' => $user->id,
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Convert points to wallet balance
     *
     * @return array{success: bool, points?: int, amount?: float, transaction?: LoyaltyTransaction, error?: string}
     */
    public function convertPointsToWallet(User $user, int $points): array
    {
        try {
            return DB::transaction(function () use ($user, $points) {
                $loyaltyAccount = $this->getOrCreateLoyaltyAccount($user);

                if (! $loyaltyAccount->hasSufficientPoints($points)) {
                    return ['success' => false, 'error' => 'Insufficient points balance.'];
                }

                $amount = $this->convertPointsToMoney($points);

                // Deduct points
                $transaction = $loyaltyAccount->deductPoints(
                    $points,
                    LoyaltyTransaction::SOURCE_CONVERSION,
                    "Converted to wallet balance: ₹{$amount}"
                );

                // Add to wallet
                $this->walletService->addLoyaltyReward($user, $amount, 'Loyalty points conversion');

                Log::info('Converted points to wallet', [
                    'user_id' => $user->id,
                    'points' => $points,
                    'amount' => $amount,
                ]);

                return [
                    'success' => true,
                    'points' => $points,
                    'amount' => $amount,
                    'transaction' => $transaction,
                ];
            });
        } catch (\Exception $e) {
            Log::error('Failed to convert points to wallet', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => 'Failed to convert points.'];
        }
    }

    /**
     * Calculate points for order based on total
     */
    public function calculatePointsForOrder(Order $order): int
    {
        return (int) floor($order->total * self::POINTS_PER_ORDER_PERCENT / 100);
    }

    /**
     * Convert points to money
     */
    public function convertPointsToMoney(int $points): float
    {
        return $points * self::POINTS_TO_RUPEE_RATE;
    }

    /**
     * Get user's loyalty summary
     *
     * @return array<string, mixed>
     */
    public function getLoyaltySummary(User $user): array
    {
        $loyaltyAccount = $this->getOrCreateLoyaltyAccount($user);

        return [
            'points' => $loyaltyAccount->points,
            'total_earned' => $loyaltyAccount->total_earned,
            'total_redeemed' => $loyaltyAccount->total_redeemed,
            'is_active' => $loyaltyAccount->is_active,
            'money_value' => $this->convertPointsToMoney($loyaltyAccount->points),
            'points_per_delivery' => self::POINTS_PER_DELIVERY,
            'points_per_order_percent' => self::POINTS_PER_ORDER_PERCENT,
            'conversion_rate' => self::POINTS_TO_RUPEE_RATE,
        ];
    }

    /**
     * Admin adjustment of points
     *
     * @return array{success: bool, transaction?: LoyaltyTransaction, error?: string}
     */
    public function adminAdjustment(User $user, int $points, string $reason): array
    {
        try {
            $loyaltyAccount = $this->getOrCreateLoyaltyAccount($user);

            $type = $points > 0 ? LoyaltyTransaction::TYPE_ADJUSTED : LoyaltyTransaction::TYPE_ADJUSTED;

            if ($points > 0) {
                $transaction = $loyaltyAccount->addPoints(
                    $points,
                    LoyaltyTransaction::SOURCE_ADMIN,
                    $reason
                );
            } else {
                $transaction = $loyaltyAccount->deductPoints(
                    abs($points),
                    LoyaltyTransaction::SOURCE_ADMIN,
                    $reason
                );
            }

            Log::info('Admin loyalty adjustment', [
                'user_id' => $user->id,
                'points' => $points,
                'reason' => $reason,
            ]);

            return ['success' => true, 'transaction' => $transaction];
        } catch (\Exception $e) {
            Log::error('Admin loyalty adjustment failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
