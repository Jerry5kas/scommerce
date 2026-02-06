<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class CouponService
{
    /**
     * Validate coupon code
     *
     * @return array{valid: bool, coupon?: Coupon, discount?: float, error?: string}
     */
    public function validateCoupon(string $code, User $user, Cart $cart): array
    {
        $coupon = Coupon::byCode($code)->first();

        if (! $coupon) {
            return ['valid' => false, 'error' => 'Invalid coupon code.'];
        }

        // Check if coupon is valid
        if (! $coupon->isValid()) {
            if ($coupon->isExpired()) {
                return ['valid' => false, 'error' => 'This coupon has expired.'];
            }
            if ($coupon->hasReachedLimit()) {
                return ['valid' => false, 'error' => 'This coupon has reached its usage limit.'];
            }

            return ['valid' => false, 'error' => 'This coupon is not active.'];
        }

        // Check user eligibility
        if (! $coupon->canBeUsedBy($user)) {
            if ($coupon->hasReachedUserLimit($user)) {
                return ['valid' => false, 'error' => 'You have already used this coupon.'];
            }
            if ($coupon->first_order_only) {
                return ['valid' => false, 'error' => 'This coupon is for first orders only.'];
            }
            if ($coupon->new_users_only) {
                return ['valid' => false, 'error' => 'This coupon is for new users only.'];
            }

            return ['valid' => false, 'error' => 'You are not eligible for this coupon.'];
        }

        // Check minimum order amount
        $cartTotal = $this->getEligibleCartTotal($coupon, $cart);
        if ($coupon->min_order_amount && $cartTotal < $coupon->min_order_amount) {
            return [
                'valid' => false,
                'error' => "Minimum order amount of ₹{$coupon->min_order_amount} required.",
            ];
        }

        // Check subscription exclusion
        if ($coupon->exclude_subscriptions && $this->cartHasSubscriptions($cart)) {
            return ['valid' => false, 'error' => 'This coupon cannot be used with subscriptions.'];
        }

        // Check free sample exclusion
        if ($coupon->exclude_free_samples && $this->cartHasFreeSamples($cart)) {
            return ['valid' => false, 'error' => 'This coupon cannot be used with free samples.'];
        }

        // Check product eligibility
        if (! $this->checkProductEligibility($coupon, $cart)) {
            return ['valid' => false, 'error' => 'This coupon is not applicable to items in your cart.'];
        }

        // Calculate discount
        $discount = $coupon->calculateDiscount($cartTotal);

        return [
            'valid' => true,
            'coupon' => $coupon,
            'discount' => $discount,
        ];
    }

    /**
     * Apply coupon to cart
     *
     * @return array{success: bool, discount?: float, error?: string}
     */
    public function applyCoupon(Cart $cart, string $code, User $user): array
    {
        $validation = $this->validateCoupon($code, $user, $cart);

        if (! $validation['valid']) {
            return ['success' => false, 'error' => $validation['error']];
        }

        $coupon = $validation['coupon'];
        $discount = $validation['discount'];

        // Update cart with coupon
        $cart->update([
            'coupon_id' => $coupon->id,
            'coupon_code' => $coupon->code,
            'discount' => $discount,
        ]);

        // Recalculate cart totals
        $cart->calculateTotals();

        Log::info('Coupon applied to cart', [
            'cart_id' => $cart->id,
            'user_id' => $user->id,
            'coupon_code' => $coupon->code,
            'discount' => $discount,
        ]);

        return [
            'success' => true,
            'discount' => $discount,
        ];
    }

    /**
     * Remove coupon from cart
     */
    public function removeCoupon(Cart $cart): bool
    {
        $cart->update([
            'coupon_id' => null,
            'coupon_code' => null,
            'discount' => 0,
        ]);

        $cart->calculateTotals();

        return true;
    }

    /**
     * Record coupon usage
     */
    public function recordUsage(
        Coupon $coupon,
        User $user,
        Order $order,
        float $discount,
        ?string $ipAddress = null
    ): CouponUsage {
        $usage = CouponUsage::create([
            'coupon_id' => $coupon->id,
            'user_id' => $user->id,
            'order_id' => $order->id,
            'discount_amount' => $discount,
            'order_amount' => $order->subtotal,
            'used_at' => now(),
            'ip_address' => $ipAddress,
        ]);

        // Increment coupon usage count
        $coupon->incrementUsage();

        Log::info('Coupon usage recorded', [
            'coupon_id' => $coupon->id,
            'user_id' => $user->id,
            'order_id' => $order->id,
            'discount' => $discount,
        ]);

        return $usage;
    }

    /**
     * Get eligible cart total (excluding non-applicable items)
     */
    protected function getEligibleCartTotal(Coupon $coupon, Cart $cart): float
    {
        if ($coupon->applicable_to === Coupon::APPLICABLE_ALL) {
            return (float) $cart->subtotal;
        }

        $total = 0;
        foreach ($cart->items as $item) {
            if ($item->product && $coupon->isApplicableToProduct($item->product)) {
                $total += $item->subtotal;
            }
        }

        return $total;
    }

    /**
     * Check if cart has subscriptions
     */
    protected function cartHasSubscriptions(Cart $cart): bool
    {
        return $cart->items()->where('is_subscription', true)->exists();
    }

    /**
     * Check if cart has free samples
     */
    protected function cartHasFreeSamples(Cart $cart): bool
    {
        return $cart->items()
            ->whereHas('product', fn ($q) => $q->where('is_free_sample', true))
            ->exists();
    }

    /**
     * Check product eligibility
     */
    protected function checkProductEligibility(Coupon $coupon, Cart $cart): bool
    {
        if ($coupon->applicable_to === Coupon::APPLICABLE_ALL) {
            return true;
        }

        // At least one product must be eligible
        foreach ($cart->items as $item) {
            if ($item->product && $coupon->isApplicableToProduct($item->product)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get available coupons for user
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, Coupon>
     */
    public function getAvailableCoupons(User $user): \Illuminate\Database\Eloquent\Collection
    {
        return Coupon::valid()
            ->get()
            ->filter(fn ($coupon) => $coupon->canBeUsedBy($user));
    }

    /**
     * Get coupon statistics
     *
     * @return array<string, mixed>
     */
    public function getCouponStats(Coupon $coupon): array
    {
        $usages = $coupon->usages;

        return [
            'total_uses' => $usages->count(),
            'total_discount' => $usages->sum('discount_amount'),
            'total_order_value' => $usages->sum('order_amount'),
            'unique_users' => $usages->unique('user_id')->count(),
            'average_discount' => $usages->count() > 0 ? $usages->avg('discount_amount') : 0,
            'average_order_value' => $usages->count() > 0 ? $usages->avg('order_amount') : 0,
            'remaining_uses' => $coupon->usage_limit ? $coupon->usage_limit - $coupon->used_count : null,
        ];
    }
}
