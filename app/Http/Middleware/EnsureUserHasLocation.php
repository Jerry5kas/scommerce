<?php

namespace App\Http\Middleware;

use Closure;
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
            return $next($request);
        }

        $defaultAddress = $request->user()
            ->addresses()
            ->active()
            ->where('is_default', true)
            ->first();

        if ($defaultAddress === null || $defaultAddress->zone_id === null) {
            // Development bypass: if in debug mode and address exists, try to auto-assign zone
            if (config('app.debug') && $defaultAddress !== null && $defaultAddress->zone_id === null) {
                $defaultAddress->autoAssignZone();
                $defaultAddress->refresh();
                if ($defaultAddress->zone_id !== null) {
                    return $next($request);
                }
            }

            if ($request->expectsJson()) {
                return response()->json(['message' => 'Please set a delivery location.'], 422);
            }

            return redirect()->route('location.select');
        }

        return $next($request);
    }
}
