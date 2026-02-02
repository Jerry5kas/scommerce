<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ensures the authenticated user is a driver (Phase 15).
 * Use on driver API routes; reject or redirect non-drivers.
 */
class EnsureUserIsDriver
{
    public function handle(Request $request, Closure $next): Response
    {
        // TODO Phase 15: Check user role/driver model. Return 403 if not driver.
        return $next($request);
    }
}
