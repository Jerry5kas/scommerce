<?php

namespace App\Http\Middleware;

use App\Enums\BusinessVertical;
use App\Models\Cart;
use App\Models\ThemeSetting;
use App\Models\User;
use App\Models\UserAddress;
use App\Support\VerticalContext;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $currentVertical = VerticalContext::current($request, BusinessVertical::DailyFresh->value);

        $customer = $request->user();
        if (! $customer instanceof User) {
            $customer = null;
        }

        $admin = $request->user('admin');

        // compute user's default zone for sharing (nullable)
        $zone = null;
        $location = null;
        $cartItemsCount = 0;

        if ($customer !== null) {
            $defaultAddress = $customer
                ->addresses()
                ->active()
                ->where('is_default', true)
                ->first();

            if ($defaultAddress === null || $defaultAddress->zone_id === null) {
                $fallbackAddress = $customer
                    ->addresses()
                    ->active()
                    ->whereNotNull('zone_id')
                    ->latest('id')
                    ->first();

                if ($fallbackAddress instanceof UserAddress && ($defaultAddress === null || $defaultAddress->id !== $fallbackAddress->id)) {
                    $customer->addresses()->active()->update(['is_default' => false]);
                    $fallbackAddress->update(['is_default' => true]);
                    $defaultAddress = $fallbackAddress;
                }
            }

            $userCart = Cart::query()
                ->notExpired()
                ->forUser($customer->id)
                ->latest('id')
                ->first();

            $cartItemsCount = $userCart?->itemCount() ?? 0;

            if ($defaultAddress) {
                if ($defaultAddress->zone) {
                    $zone = $defaultAddress->zone->only(['id', 'name', 'code']);
                }
                $location = [
                    'address_line_1' => $defaultAddress->address_line_1,
                    'city' => $defaultAddress->city,
                    'state' => $defaultAddress->state,
                    'pincode' => $defaultAddress->pincode,
                    'latitude' => (float) $defaultAddress->latitude,
                    'longitude' => (float) $defaultAddress->longitude,
                ];
            }
        } elseif (session('guest_zone_id')) {
            $guestZone = \App\Models\Zone::find(session('guest_zone_id'));
            if ($guestZone) {
                $zone = $guestZone->only(['id', 'name', 'code']);
            }
            if (session('guest_address')) {
                $location = session('guest_address');
            }

            $guestSessionId = $request->session()->getId();
            $guestCart = Cart::query()
                ->notExpired()
                ->forSession($guestSessionId)
                ->latest('id')
                ->first();

            $cartItemsCount = $guestCart?->itemCount() ?? 0;
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'csrf_token' => csrf_token(),
            'auth' => [
                'user' => $customer,
                'admin' => $admin,
                'wishlisted_products' => $customer ? $customer->wishlists()->pluck('product_id')->toArray() : [],
            ],
            'theme' => ThemeSetting::getTheme(),
            'cart' => [
                'items_count' => $cartItemsCount,
            ],
            'flash' => [
                'message' => session('message'),
            ],
            // zone is null when user is unauthenticated or has no default address
            'zone' => $zone,
            'location' => $location,
            'currentVertical' => $currentVertical,
            'googleMapsApiKey' => config('maps.google.api_key'),
        ];
    }
}
