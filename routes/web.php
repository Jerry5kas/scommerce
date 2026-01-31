<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

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

Route::get('/welcome', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/auth/send-otp', [AuthController::class, 'sendOtp'])->name('auth.send-otp');
    Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp'])->name('auth.verify-otp');
});