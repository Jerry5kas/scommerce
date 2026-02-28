<?php

namespace App\Http\Middleware;

use App\Models\ThemeSetting;
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
        // compute user's default zone for sharing (nullable)
        $zone = null;
        $location = null;

        if ($request->user()) {
            $defaultAddress = $request->user()
                ->addresses()
                ->active()
                ->where('is_default', true)
                ->first();

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
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'csrf_token' => csrf_token(),
            'auth' => [
                'user' => $request->user(),
                'admin' => $request->user('admin'),
                'wishlisted_products' => $request->user() ? $request->user()->wishlists()->pluck('product_id')->toArray() : [],
            ],
            'theme' => ThemeSetting::getTheme(),
            'flash' => [
                'message' => session('message'),
            ],
            // zone is null when user is unauthenticated or has no default address
            'zone' => $zone,
            'location' => $location,
        ];
    }
}
