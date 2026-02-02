<?php

/*
|--------------------------------------------------------------------------
| Customer web routes (Inertia)
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserAddressController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ZoneController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::middleware('location')->group(function () {
    Route::get('/products', function () {
        return Inertia::render('products');
    })->name('products');

    Route::get('/products/{id}', function (string $id) {
        return Inertia::render('product-detail', ['id' => $id]);
    })->name('products.show');

    Route::get('/cart', function () {
        return Inertia::render('cart');
    })->name('cart');

    Route::get('/subscription', function () {
        return Inertia::render('subscription', ['planId' => request()->query('plan')]);
    })->name('subscription');
});

Route::get('/welcome', function () {
    return Inertia::render('welcome');
})->name('welcome');

/*
|--------------------------------------------------------------------------
| Location / Zone (customer-facing)
|--------------------------------------------------------------------------
*/
Route::get('/location', [ZoneController::class, 'index'])->name('location.select');
Route::post('/location/check-serviceability', [ZoneController::class, 'checkServiceability'])->name('location.check-serviceability');
Route::get('/location/zone/{pincode}', [ZoneController::class, 'getZoneByPincode'])->name('location.zone-by-pincode')->where('pincode', '[0-9]+');

/*
|--------------------------------------------------------------------------
| User login (customers): phone OTP → users table, web guard
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/auth/send-otp', [AuthController::class, 'sendOtp'])
        ->middleware('throttle:5,1')
        ->name('auth.send-otp');
    Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp'])
        ->middleware('throttle:10,1')
        ->name('auth.verify-otp');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/profile', [UserController::class, 'show'])->name('profile.index');
    Route::put('/profile', [UserController::class, 'update'])->name('profile.update');

    Route::get('/profile/addresses', [UserAddressController::class, 'index'])->name('profile.addresses');
    Route::post('/profile/addresses', [UserAddressController::class, 'store'])->name('profile.addresses.store');
    Route::put('/profile/addresses/{address}', [UserAddressController::class, 'update'])->name('profile.addresses.update');
    Route::delete('/profile/addresses/{address}', [UserAddressController::class, 'destroy'])->name('profile.addresses.destroy');
    Route::post('/profile/addresses/{address}/default', [UserAddressController::class, 'setDefault'])->name('profile.addresses.set-default');
});