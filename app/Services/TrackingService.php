<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\TrackingEvent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TrackingService
{
    /**
     * Track an event
     *
     * @param  array<string, mixed>  $properties
     */
    public function track(
        string $eventName,
        array $properties = [],
        ?User $user = null,
        ?Request $request = null
    ): TrackingEvent {
        $request ??= request();

        return TrackingEvent::create([
            'user_id' => $user?->id,
            'session_id' => $this->getSessionId($request),
            'event_name' => $eventName,
            'event_category' => $properties['category'] ?? null,
            'event_action' => $properties['action'] ?? null,
            'event_label' => $properties['label'] ?? null,
            'event_value' => $properties['value'] ?? null,
            'properties' => $properties,
            'page_url' => $request?->fullUrl(),
            'page_title' => $properties['page_title'] ?? null,
            'referrer' => $request?->header('referer'),
            'user_agent' => $request?->userAgent(),
            'ip_address' => $request?->ip(),
            'device_type' => $this->detectDeviceType($request),
            'browser' => $this->detectBrowser($request),
            'os' => $this->detectOS($request),
        ]);
    }

    /**
     * Track page view
     */
    public function trackPageView(string $url, ?string $title = null, ?User $user = null): TrackingEvent
    {
        return $this->track(TrackingEvent::EVENT_PAGE_VIEW, [
            'category' => TrackingEvent::CATEGORY_ENGAGEMENT,
            'action' => 'view',
            'page_title' => $title,
            'page_url' => $url,
        ], $user);
    }

    /**
     * Track product view
     */
    public function trackProductView(Product $product, ?User $user = null): TrackingEvent
    {
        return $this->track(TrackingEvent::EVENT_VIEW_ITEM, [
            'category' => TrackingEvent::CATEGORY_ECOMMERCE,
            'action' => 'view',
            'label' => $product->name,
            'value' => $product->price,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'product_price' => $product->price,
            'product_category' => $product->category?->name,
        ], $user);
    }

    /**
     * Track add to cart
     */
    public function trackAddToCart(Product $product, int $quantity, ?User $user = null): TrackingEvent
    {
        return $this->track(TrackingEvent::EVENT_ADD_TO_CART, [
            'category' => TrackingEvent::CATEGORY_ECOMMERCE,
            'action' => 'add',
            'label' => $product->name,
            'value' => $product->price * $quantity,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'quantity' => $quantity,
            'price' => $product->price,
        ], $user);
    }

    /**
     * Track remove from cart
     */
    public function trackRemoveFromCart(Product $product, int $quantity, ?User $user = null): TrackingEvent
    {
        return $this->track(TrackingEvent::EVENT_REMOVE_FROM_CART, [
            'category' => TrackingEvent::CATEGORY_ECOMMERCE,
            'action' => 'remove',
            'label' => $product->name,
            'value' => $product->price * $quantity,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'quantity' => $quantity,
        ], $user);
    }

    /**
     * Track checkout start
     */
    public function trackCheckout(float $value, int $itemCount, ?User $user = null): TrackingEvent
    {
        return $this->track(TrackingEvent::EVENT_BEGIN_CHECKOUT, [
            'category' => TrackingEvent::CATEGORY_ECOMMERCE,
            'action' => 'checkout',
            'value' => $value,
            'items_count' => $itemCount,
        ], $user);
    }

    /**
     * Track purchase
     */
    public function trackPurchase(Order $order, ?User $user = null): TrackingEvent
    {
        return $this->track(TrackingEvent::EVENT_PURCHASE, [
            'category' => TrackingEvent::CATEGORY_ECOMMERCE,
            'action' => 'purchase',
            'label' => $order->order_number,
            'value' => $order->total,
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'subtotal' => $order->subtotal,
            'discount' => $order->discount,
            'delivery_charge' => $order->delivery_charge,
            'total' => $order->total,
            'items_count' => $order->items()->count(),
            'payment_method' => $order->payment_method,
        ], $user ?? $order->user);
    }

    /**
     * Track subscription
     */
    public function trackSubscription(Subscription $subscription, ?User $user = null): TrackingEvent
    {
        return $this->track(TrackingEvent::EVENT_SUBSCRIBE, [
            'category' => TrackingEvent::CATEGORY_SUBSCRIPTION,
            'action' => 'subscribe',
            'label' => $subscription->plan?->name,
            'value' => $subscription->getTotalValue(),
            'subscription_id' => $subscription->id,
            'plan_name' => $subscription->plan?->name,
            'billing_cycle' => $subscription->billing_cycle,
        ], $user ?? $subscription->user);
    }

    /**
     * Track search
     */
    public function trackSearch(string $query, int $resultCount, ?User $user = null): TrackingEvent
    {
        return $this->track(TrackingEvent::EVENT_SEARCH, [
            'category' => TrackingEvent::CATEGORY_ENGAGEMENT,
            'action' => 'search',
            'label' => $query,
            'search_query' => $query,
            'result_count' => $resultCount,
        ], $user);
    }

    /**
     * Track login
     */
    public function trackLogin(User $user): TrackingEvent
    {
        return $this->track(TrackingEvent::EVENT_LOGIN, [
            'category' => TrackingEvent::CATEGORY_AUTHENTICATION,
            'action' => 'login',
        ], $user);
    }

    /**
     * Track signup
     */
    public function trackSignup(User $user): TrackingEvent
    {
        return $this->track(TrackingEvent::EVENT_SIGNUP, [
            'category' => TrackingEvent::CATEGORY_AUTHENTICATION,
            'action' => 'signup',
        ], $user);
    }

    /**
     * Get or create session ID
     */
    protected function getSessionId(?Request $request): string
    {
        if (! $request) {
            return Str::uuid()->toString();
        }

        $sessionId = $request->session()?->getId();

        return $sessionId ?: Str::uuid()->toString();
    }

    /**
     * Detect device type from user agent
     */
    protected function detectDeviceType(?Request $request): string
    {
        if (! $request) {
            return 'unknown';
        }

        $userAgent = strtolower($request->userAgent() ?? '');

        if (str_contains($userAgent, 'mobile') || str_contains($userAgent, 'android')) {
            return 'mobile';
        }

        if (str_contains($userAgent, 'tablet') || str_contains($userAgent, 'ipad')) {
            return 'tablet';
        }

        return 'desktop';
    }

    /**
     * Detect browser from user agent
     */
    protected function detectBrowser(?Request $request): string
    {
        if (! $request) {
            return 'unknown';
        }

        $userAgent = strtolower($request->userAgent() ?? '');

        if (str_contains($userAgent, 'chrome') && ! str_contains($userAgent, 'edge')) {
            return 'Chrome';
        }
        if (str_contains($userAgent, 'firefox')) {
            return 'Firefox';
        }
        if (str_contains($userAgent, 'safari') && ! str_contains($userAgent, 'chrome')) {
            return 'Safari';
        }
        if (str_contains($userAgent, 'edge')) {
            return 'Edge';
        }
        if (str_contains($userAgent, 'opera') || str_contains($userAgent, 'opr')) {
            return 'Opera';
        }

        return 'Other';
    }

    /**
     * Detect OS from user agent
     */
    protected function detectOS(?Request $request): string
    {
        if (! $request) {
            return 'unknown';
        }

        $userAgent = strtolower($request->userAgent() ?? '');

        if (str_contains($userAgent, 'windows')) {
            return 'Windows';
        }
        if (str_contains($userAgent, 'mac os') || str_contains($userAgent, 'macintosh')) {
            return 'macOS';
        }
        if (str_contains($userAgent, 'linux') && ! str_contains($userAgent, 'android')) {
            return 'Linux';
        }
        if (str_contains($userAgent, 'android')) {
            return 'Android';
        }
        if (str_contains($userAgent, 'iphone') || str_contains($userAgent, 'ipad')) {
            return 'iOS';
        }

        return 'Other';
    }
}
