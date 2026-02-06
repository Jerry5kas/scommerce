<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\SubscriptionPlan;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        private CartService $cartService
    ) {}

    /**
     * Show cart page
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();

        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $cart->load(['items.product', 'items.subscriptionPlan']);

        $summary = $this->cartService->getCartSummary($cart);

        // Get user addresses if authenticated
        $addresses = [];
        if ($user) {
            $addresses = $user->addresses()->active()->with('zone')->get();
        }

        return Inertia::render('cart/index', [
            'cart' => $cart,
            'items' => $cart->items,
            'summary' => $summary,
            'addresses' => $addresses,
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
        $cart->load(['items.product', 'items.subscriptionPlan']);

        return response()->json([
            'cart' => $cart,
            'items' => $cart->items,
            'summary' => $this->cartService->getCartSummary($cart),
        ]);
    }

    /**
     * Add product to cart
     */
    public function addItem(AddToCartRequest $request): JsonResponse
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

        $item = $this->cartService->addProduct(
            $cart,
            $product,
            $validated['quantity'],
            $zone,
            $isSubscription,
            $plan
        );

        $item->load('product');
        $cart->refresh();

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart.',
            'item' => $item,
            'summary' => $this->cartService->getCartSummary($cart),
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function updateItem(UpdateCartItemRequest $request, CartItem $cartItem): JsonResponse
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

            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart.',
                'removed' => true,
                'summary' => $this->cartService->getCartSummary($cart->refresh()),
            ]);
        }

        $this->cartService->updateItem($cartItem, $validated['quantity']);
        $cartItem->refresh();
        $cartItem->load('product');

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
    public function removeItem(Request $request, CartItem $cartItem): JsonResponse
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();

        // Verify ownership
        $cart = $cartItem->cart;
        if (($user && $cart->user_id !== $user->id) && $cart->session_id !== $sessionId) {
            return response()->json(['error' => 'Cart item not found.'], 404);
        }

        $this->cartService->removeItem($cartItem);

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart.',
            'summary' => $this->cartService->getCartSummary($cart->refresh()),
        ]);
    }

    /**
     * Clear entire cart
     */
    public function clear(Request $request): JsonResponse
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();

        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $cart->clear();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared.',
            'summary' => $this->cartService->getCartSummary($cart),
        ]);
    }

    /**
     * Get mini cart data (for header)
     */
    public function miniCart(Request $request): JsonResponse
    {
        $user = $request->user();
        $sessionId = $request->session()->getId();

        $cart = $this->cartService->getOrCreateCart($user, $sessionId);
        $cart->load(['items.product']);

        return response()->json([
            'items_count' => $cart->itemCount(),
            'total' => $cart->total,
            'items' => $cart->items->map(fn ($item) => [
                'id' => $item->id,
                'product_name' => $item->product->name,
                'product_image' => $item->product->image,
                'quantity' => $item->quantity,
                'subtotal' => $item->subtotal,
            ])->take(5),
        ]);
    }
}
