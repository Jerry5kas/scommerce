<?php

/*
|--------------------------------------------------------------------------
| API routes (prefixed /api, api middleware)
|--------------------------------------------------------------------------
| Driver API lives under /api/v1/driver (Phase 15).
*/

use Illuminate\Support\Facades\Route;

Route::prefix('v1/driver')->name('api.driver.')->group(function () {
    // Driver API routes (Phase 15)
    Route::get('/', function () {
        return response()->json(['message' => 'Driver API v1']);
    })->name('index');
});
