<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use App\Services\CouponService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function __construct(
        private CouponService $couponService,
        private CartService $cartService
    ) {}

    /**
     * Validate coupon code (API).
     */
    public function validate(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'min:3', 'max:50'],
        ]);

        $user = $request->user();
        $cart = $this->cartService->getOrCreateCart($user, $request->session()->getId());

        $result = $this->couponService->validateCoupon(
            strtoupper($request->code),
            $user,
            $cart
        );

        if (! $result['valid']) {
            return response()->json([
                'valid' => false,
                'error' => $result['error'],
            ], 422);
        }

        return response()->json([
            'valid' => true,
            'coupon' => [
                'code' => $result['coupon']->code,
                'name' => $result['coupon']->name,
                'discount_label' => $result['coupon']->getDiscountLabel(),
            ],
            'discount' => $result['discount'],
        ]);
    }

    /**
     * Apply coupon to cart.
     */
    public function apply(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'min:3', 'max:50'],
        ]);

        $user = $request->user();
        $cart = $this->cartService->getOrCreateCart($user, $request->session()->getId());

        $result = $this->couponService->applyCoupon(
            $cart,
            strtoupper($request->code),
            $user
        );

        if (! $result['success']) {
            return back()->withErrors(['code' => $result['error']]);
        }

        return back()->with('success', "Coupon applied! You saved ₹{$result['discount']}");
    }

    /**
     * Remove coupon from cart.
     */
    public function remove(Request $request): RedirectResponse
    {
        $user = $request->user();
        $cart = $this->cartService->getOrCreateCart($user, $request->session()->getId());

        $this->couponService->removeCoupon($cart);

        return back()->with('success', 'Coupon removed.');
    }
}
