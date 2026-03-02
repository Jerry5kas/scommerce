<?php

namespace App\Http\Middleware;

use App\Models\UserAddress;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ensures the user has a default address in a serviceable zone (Phase 3).
 * Redirect to location selection if missing.
 */
class EnsureUserHasLocation
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            if (session('guest_zone_id')) {
                return $next($request);
            }

            if ($request->routeIs('login') || $request->routeIs('welcome') || $request->routeIs('home') || $request->routeIs('auth.*')) {
                return $next($request);
            }

            if ($request->expectsJson()) {
                return response()->json(['message' => 'Please login to continue.'], 401);
            }

            return redirect()->route('login');
        }

        $addressQuery = $request->user()
            ->addresses()
            ->active();

        $defaultAddress = $this->resolveAddressForLocation($addressQuery);

        if ($defaultAddress === null || $defaultAddress->zone_id === null) {
            // Development bypass: if in debug mode and address exists, try to auto-assign zone
            if (config('app.debug') && $defaultAddress !== null && $defaultAddress->zone_id === null) {
                $defaultAddress->autoAssignZone();
                $defaultAddress->refresh();
                if ($defaultAddress->zone_id !== null) {
                    return $next($request);
                }
            }

            // Allow access to catalog routes without address for authenticated users too
            if ($request->routeIs('location.*') || $request->routeIs('catalog.*') || $request->routeIs('products.*')) {
                return $next($request);
            }

            if ($request->expectsJson()) {
                return response()->json(['message' => 'Please set a delivery location.'], 422);
            }

            return redirect()->route('location.select');
        }

        return $next($request);
    }

    private function resolveAddressForLocation(Builder|HasMany $addressQuery): ?UserAddress
    {
        $defaultAddress = (clone $addressQuery)
            ->where('is_default', true)
            ->first();

        if ($defaultAddress !== null && $defaultAddress->zone_id !== null) {
            return $defaultAddress;
        }

        $fallbackAddress = (clone $addressQuery)
            ->whereNotNull('zone_id')
            ->latest('id')
            ->first();

        if ($fallbackAddress !== null && ($defaultAddress === null || $defaultAddress->id !== $fallbackAddress->id)) {
            $addressQuery->update(['is_default' => false]);
            $fallbackAddress->update(['is_default' => true]);

            return $fallbackAddress;
        }

        return $defaultAddress;
    }
}
