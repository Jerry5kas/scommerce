<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\AddToTomorrowDeliveryRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\SubscriptionPlan;
use App\Services\CartService;
use App\Services\CheckoutService;
use App\Services\CouponService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        private CartService $cartService,
        private CouponService $couponService,
        private CheckoutService $checkoutService
    ) {}

    /**
     * Show cart page
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();

        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $cart->load(['items.product', 'items.variant', 'items.subscriptionPlan']);

        $summary = $this->cartService->getCartSummary($cart);

        // Get user addresses if authenticated
        $addresses = [];
        $availableCoupons = [];
        if ($user) {
            $addresses = $user->addresses()->active()->with('zone')->get();
            $availableCoupons = $this->couponService
                ->getAvailableCoupons($user)
                ->map(fn ($coupon) => [
                    'code' => $coupon->code,
                    'name' => $coupon->name,
                    'discount_label' => $coupon->getDiscountLabel(),
                    'min_order_amount' => $coupon->min_order_amount,
                ])
                ->values();
        }

        return Inertia::render('cart/index', [
            'cart' => $cart,
            'items' => $cart->items,
            'summary' => $summary,
            'addresses' => $addresses,
            'available_coupons' => $availableCoupons,
        ]);
    }

    /**
     * Get cart data (API)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();

        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $cart->load(['items.product', 'items.variant', 'items.subscriptionPlan']);

        return response()->json([
            'cart' => $cart,
            'items' => $cart->items,
            'summary' => $this->cartService->getCartSummary($cart),
        ]);
    }

    /**
     * Add product to cart
     */
    public function addItem(AddToCartRequest $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();
        $validated = $request->validated();

        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $product = Product::findOrFail($validated['product_id']);

        // Get user's zone for pricing
        $zone = null;
        if ($user) {
            $defaultAddress = $user->addresses()->active()->where('is_default', true)->first();
            $zone = $defaultAddress?->zone;
        }

        $isSubscription = $validated['is_subscription'] ?? false;
        $plan = $isSubscription && isset($validated['subscription_plan_id'])
            ? SubscriptionPlan::find($validated['subscription_plan_id'])
            : null;
        $variant = null;

        if (isset($validated['variant_id'])) {
            $variant = $product->variants()
                ->where('is_active', true)
                ->findOrFail($validated['variant_id']);
        }

        $item = $this->cartService->addProduct(
            $cart,
            $product,
            $validated['quantity'],
            $zone,
            $isSubscription,
            $plan,
            $variant
        );

        $item->load(['product', 'variant']);
        $cart->refresh();

        if ($this->shouldReturnJson($request)) {
            return response()->json([
                'success' => true,
                'message' => 'Product added to cart.',
                'item' => $item,
                'summary' => $this->cartService->getCartSummary($cart),
            ]);
        }

        return back()->with('message', 'Product added to cart.');
    }

    /**
     * Update cart item quantity
     */
    public function updateItem(UpdateCartItemRequest $request, CartItem $cartItem): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();

        // Verify ownership
        $cart = $cartItem->cart;
        if (($user && $cart->user_id !== $user->id) && $cart->session_id !== $sessionId) {
            return response()->json(['error' => 'Cart item not found.'], 404);
        }

        $validated = $request->validated();

        if ($validated['quantity'] <= 0) {
            $this->cartService->removeItem($cartItem);

            if (! $this->shouldReturnJson($request)) {
                return back()->with('message', 'Item removed from cart.');
            }

            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart.',
                'removed' => true,
                'summary' => $this->cartService->getCartSummary($cart->refresh()),
            ]);
        }

        $this->cartService->updateItem($cartItem, $validated['quantity']);
        $cartItem->refresh();
        $cartItem->load(['product', 'variant']);

        if (! $this->shouldReturnJson($request)) {
            return back()->with('message', 'Cart updated.');
        }

        return response()->json([
            'success' => true,
            'message' => 'Cart updated.',
            'item' => $cartItem,
            'summary' => $this->cartService->getCartSummary($cart->refresh()),
        ]);
    }

    /**
     * Remove item from cart
     */
    public function removeItem(Request $request, CartItem $cartItem): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();

        // Verify ownership
        $cart = $cartItem->cart;
        if (($user && $cart->user_id !== $user->id) && $cart->session_id !== $sessionId) {
            return response()->json(['error' => 'Cart item not found.'], 404);
        }

        $this->cartService->removeItem($cartItem);

        if (! $this->shouldReturnJson($request)) {
            return back()->with('message', 'Item removed from cart.');
        }

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart.',
            'summary' => $this->cartService->getCartSummary($cart->refresh()),
        ]);
    }

    /**
     * Clear entire cart
     */
    public function clear(Request $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();

        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $cart->clear();

        if (! $this->shouldReturnJson($request)) {
            return back()->with('message', 'Cart cleared.');
        }

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared.',
            'summary' => $this->cartService->getCartSummary($cart),
        ]);
    }

    /**
     * Add current cart items to the next available delivery run.
     */
    public function addToTomorrowDelivery(AddToTomorrowDeliveryRequest $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();
        $cart = $this->cartService->getOrCreateCart($user, $sessionId);

        if ($cart->isEmpty()) {
            if ($this->shouldReturnJson($request)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Your cart is empty.',
                ], 422);
            }

            return back()->with('error', 'Your cart is empty.');
        }

        $validated = $request->validated();

        $address = null;
        if (! empty($validated['user_address_id'])) {
            $address = $user->addresses()
                ->active()
                ->find($validated['user_address_id']);
        }

        $address ??= $user->addresses()
            ->active()
            ->where('is_default', true)
            ->first();

        $address ??= $user->addresses()->active()->first();

        if (! $address) {
            if ($this->shouldReturnJson($request)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Please add a delivery address first.',
                ], 422);
            }

            return back()->with('error', 'Please add a delivery address first.');
        }

        $result = $this->checkoutService->addCartToNextDelivery($cart, $user, $address, $validated);

        if (! $result['success']) {
            if ($this->shouldReturnJson($request)) {
                return response()->json([
                    'success' => false,
                    'error' => $result['error'] ?? 'Unable to add items to next delivery.',
                ], 422);
            }

            return back()->with('error', $result['error'] ?? 'Unable to add items to next delivery.');
        }

        $message = ($result['merged'] ?? false)
            ? 'Items added to your existing next delivery.'
            : 'Items scheduled for your next delivery.';

        if ($this->shouldReturnJson($request)) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'order_id' => $result['order']?->id,
                'scheduled_delivery_date' => $result['scheduled_delivery_date'] ?? null,
            ]);
        }

        return redirect()->route('orders.show', $result['order'])
            ->with('success', $message);
    }

    /**
     * Get mini cart data (for header)
     */
    public function miniCart(Request $request): JsonResponse
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();

        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $cart->load(['items.product', 'items.variant']);

        return response()->json([
            'items_count' => $cart->itemCount(),
            'total' => $cart->total,
            'items' => $cart->items->map(fn ($item) => [
                'id' => $item->id,
                'product_name' => $item->product->name,
                'product_image' => $item->product->image,
                'variant_name' => $item->variant?->name,
                'quantity' => $item->quantity,
                'subtotal' => $item->subtotal,
            ])->take(5),
        ]);
    }

    protected function shouldReturnJson(Request $request): bool
    {
        return $request->expectsJson() || $request->wantsJson();
    }
}
