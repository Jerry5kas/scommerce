<?php

/*
|--------------------------------------------------------------------------
| Customer web routes (Inertia)
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserAddressController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ZoneController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::middleware('location')->group(function () {
    // Catalog home
    Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog.home');

    // Catalog routes
    Route::get('/catalog/search', [CatalogController::class, 'search'])->name('catalog.search');
    Route::get('/categories/{category:slug}', [CatalogController::class, 'showCategory'])->name('catalog.category');
    Route::get('/collections/{collection:slug}', [CatalogController::class, 'showCollection'])->name('catalog.collection');
    Route::get('/products/{product:slug}', [CatalogController::class, 'showProduct'])->name('catalog.product');

    // Product routes
    Route::get('/products', [ProductController::class, 'index'])->name('products');
    Route::get('/products/{product}/related', [ProductController::class, 'relatedProducts'])->name('products.related');

    // Free sample routes
    Route::post('/products/{product}/free-sample/claim', [\App\Http\Controllers\FreeSampleController::class, 'claim'])->name('products.free-sample.claim');
    Route::get('/products/{product}/free-sample/check', [\App\Http\Controllers\FreeSampleController::class, 'checkEligibility'])->name('products.free-sample.check');

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
