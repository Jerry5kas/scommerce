<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;

class ConfigController
{
    public function googleMapsKey(): JsonResponse
    {
        return response()->json([
            'api_key' => config('services.google_maps.api_key'),
        ]);
    }
}
