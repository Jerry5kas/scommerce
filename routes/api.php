<?php

/*
|--------------------------------------------------------------------------
| API routes (prefixed /api, api middleware)
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Api\PaymentWebhookController;
use App\Http\Controllers\Api\V1\Driver\BottleController as DriverBottleController;
use App\Http\Controllers\Api\V1\Driver\DeliveryController as DriverDeliveryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Payment Webhooks (no auth required)
|--------------------------------------------------------------------------
*/
Route::post('webhooks/payment/{gateway}', [PaymentWebhookController::class, 'handle'])
    ->name('webhooks.payment');

/*
|--------------------------------------------------------------------------
| Driver API v1 (authenticated via Sanctum)
|--------------------------------------------------------------------------
*/
Route::prefix('v1/driver')->name('api.driver.')->middleware(['auth:sanctum'])->group(function () {
    // Deliveries
    Route::get('deliveries', [DriverDeliveryController::class, 'index'])->name('deliveries.index');
    Route::get('deliveries/route', [DriverDeliveryController::class, 'getRoute'])->name('deliveries.route');
    Route::get('deliveries/{delivery}', [DriverDeliveryController::class, 'show'])->name('deliveries.show');
    Route::post('deliveries/{delivery}/start', [DriverDeliveryController::class, 'startDelivery'])->name('deliveries.start');
    Route::post('deliveries/{delivery}/location', [DriverDeliveryController::class, 'updateLocation'])->name('deliveries.location');
    Route::post('deliveries/{delivery}/complete', [DriverDeliveryController::class, 'completeDelivery'])->name('deliveries.complete');
    Route::post('deliveries/{delivery}/fail', [DriverDeliveryController::class, 'failDelivery'])->name('deliveries.fail');
    Route::post('location/batch', [DriverDeliveryController::class, 'batchUpdateLocation'])->name('location.batch');

    // Bottles
    Route::get('deliveries/{delivery}/bottles', [DriverBottleController::class, 'getDeliveryBottles'])->name('bottles.for-delivery');
    Route::post('deliveries/{delivery}/bottles/return', [DriverBottleController::class, 'returnBottle'])->name('bottles.return');
    Route::post('deliveries/{delivery}/bottles/issue', [DriverBottleController::class, 'issueBottle'])->name('bottles.issue');
    Route::post('deliveries/{delivery}/bottles/damaged', [DriverBottleController::class, 'markDamaged'])->name('bottles.damaged');
    Route::post('bottles/scan', [DriverBottleController::class, 'scanBarcode'])->name('bottles.scan');
});
