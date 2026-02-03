<?php

/*
|--------------------------------------------------------------------------
| Admin routes (prefixed /admin, web middleware)
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Admin\Auth\LoginController as AdminLoginController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CollectionController as AdminCollectionController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DriverController as AdminDriverController;
use App\Http\Controllers\Admin\FileUploadController as AdminFileUploadController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ZoneController as AdminZoneController;
use App\Http\Controllers\Admin\ZoneOverrideController as AdminZoneOverrideController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('admin.guest')->group(function () {
        Route::get('/login', [AdminLoginController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [AdminLoginController::class, 'login'])->name('login.store');
    });

    Route::middleware('admin.auth')->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::post('/logout', [AdminLoginController::class, 'logout'])->name('logout');

        Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
        Route::get('users/{user}', [AdminUserController::class, 'show'])->name('users.show');
        Route::get('users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
        Route::put('users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::put('users/{user}/addresses/{address}', [AdminUserController::class, 'updateAddress'])->name('users.addresses.update');

        Route::resource('zones', AdminZoneController::class)->names('zones');
        Route::post('zones/{zone}/toggle-status', [AdminZoneController::class, 'toggleStatus'])->name('zones.toggle-status');
        Route::get('zones/{zone}/overrides/create', [AdminZoneOverrideController::class, 'create'])->name('zones.overrides.create');
        Route::post('zones/{zone}/overrides', [AdminZoneOverrideController::class, 'store'])->name('zones.overrides.store');
        Route::get('zone-overrides/{zoneOverride}/edit', [AdminZoneOverrideController::class, 'edit'])->name('zone-overrides.edit');
        Route::put('zone-overrides/{zoneOverride}', [AdminZoneOverrideController::class, 'update'])->name('zone-overrides.update');
        Route::delete('zone-overrides/{zoneOverride}', [AdminZoneOverrideController::class, 'destroy'])->name('zone-overrides.destroy');

        Route::resource('drivers', AdminDriverController::class)->names('drivers');
        Route::post('drivers/{driver}/assign-zone', [AdminDriverController::class, 'assignZone'])->name('drivers.assign-zone');
        Route::post('drivers/{driver}/toggle-status', [AdminDriverController::class, 'toggleStatus'])->name('drivers.toggle-status');

        Route::resource('categories', AdminCategoryController::class)->names('categories');
        Route::post('categories/{category}/toggle-status', [AdminCategoryController::class, 'toggleStatus'])->name('categories.toggle-status');

        Route::resource('collections', AdminCollectionController::class)->names('collections');
        Route::post('collections/{collection}/toggle-status', [AdminCollectionController::class, 'toggleStatus'])->name('collections.toggle-status');

        Route::resource('products', AdminProductController::class)->names('products');
        Route::post('products/{product}/toggle-status', [AdminProductController::class, 'toggleStatus'])->name('products.toggle-status');
        Route::get('products/{product}/zones', [AdminProductController::class, 'manageZones'])->name('products.manage-zones');
        Route::put('products/{product}/zones', [AdminProductController::class, 'updateZones'])->name('products.update-zones');

        // File upload routes
        Route::post('files/upload', [AdminFileUploadController::class, 'upload'])->name('files.upload');
        Route::post('files/upload-multiple', [AdminFileUploadController::class, 'uploadMultiple'])->name('files.upload-multiple');
        Route::delete('files/delete', [AdminFileUploadController::class, 'delete'])->name('files.delete');
        Route::delete('files/delete-by-url', [AdminFileUploadController::class, 'deleteByUrl'])->name('files.delete-by-url');
        Route::get('files/transform', [AdminFileUploadController::class, 'getTransformedUrl'])->name('files.transform');
    });
});
