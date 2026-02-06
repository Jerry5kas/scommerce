<?php

/*
|--------------------------------------------------------------------------
| Admin routes (prefixed /admin, web middleware)
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Admin\AnalyticsController as AdminAnalyticsController;
use App\Http\Controllers\Admin\Auth\LoginController as AdminLoginController;
use App\Http\Controllers\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Admin\BottleController as AdminBottleController;
use App\Http\Controllers\Admin\CampaignController as AdminCampaignController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CollectionController as AdminCollectionController;
use App\Http\Controllers\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DeliveryController as AdminDeliveryController;
use App\Http\Controllers\Admin\DriverController as AdminDriverController;
use App\Http\Controllers\Admin\FileUploadController as AdminFileUploadController;
use App\Http\Controllers\Admin\LoyaltyController as AdminLoyaltyController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ReferralController as AdminReferralController;
use App\Http\Controllers\Admin\SubscriptionController as AdminSubscriptionController;
use App\Http\Controllers\Admin\SubscriptionPlanController as AdminSubscriptionPlanController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\WalletController as AdminWalletController;
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

        // Orders (Phase 6)
        Route::resource('orders', AdminOrderController::class)->names('orders');
        Route::post('orders/{order}/cancel', [AdminOrderController::class, 'cancel'])->name('orders.cancel');
        Route::post('orders/{order}/assign-driver', [AdminOrderController::class, 'assignDriver'])->name('orders.assign-driver');
        Route::post('orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');

        // Subscriptions (Phase 5)
        Route::resource('subscriptions', AdminSubscriptionController::class)->names('subscriptions');
        Route::post('subscriptions/{subscription}/pause', [AdminSubscriptionController::class, 'pause'])->name('subscriptions.pause');
        Route::post('subscriptions/{subscription}/resume', [AdminSubscriptionController::class, 'resume'])->name('subscriptions.resume');
        Route::post('subscriptions/{subscription}/cancel', [AdminSubscriptionController::class, 'cancel'])->name('subscriptions.cancel');
        Route::get('subscriptions/{subscription}/schedule', [AdminSubscriptionController::class, 'schedule'])->name('subscriptions.schedule');
        Route::get('subscriptions/upcoming-deliveries', [AdminSubscriptionController::class, 'upcomingDeliveries'])->name('subscriptions.upcoming-deliveries');
        Route::post('subscriptions/generate-orders', [AdminSubscriptionController::class, 'generateOrders'])->name('subscriptions.generate-orders');

        // Subscription Plans (Phase 5)
        Route::resource('subscription-plans', AdminSubscriptionPlanController::class)->names('subscription-plans');
        Route::post('subscription-plans/{subscriptionPlan}/toggle-status', [AdminSubscriptionPlanController::class, 'toggleStatus'])->name('subscription-plans.toggle-status');

        // Payments (Phase 7)
        Route::resource('payments', AdminPaymentController::class)->only(['index', 'show'])->names('payments');
        Route::post('payments/{payment}/refund', [AdminPaymentController::class, 'refund'])->name('payments.refund');
        Route::post('payments/{payment}/retry', [AdminPaymentController::class, 'retry'])->name('payments.retry');

        // Wallets (Phase 7)
        Route::resource('wallets', AdminWalletController::class)->only(['index', 'show'])->names('wallets');
        Route::post('wallets/{wallet}/adjust', [AdminWalletController::class, 'adjustBalance'])->name('wallets.adjust');
        Route::get('wallets/{wallet}/transactions', [AdminWalletController::class, 'transactions'])->name('wallets.transactions');

        // Deliveries (Phase 8)
        Route::get('deliveries', [AdminDeliveryController::class, 'index'])->name('deliveries.index');
        Route::get('deliveries/calendar', [AdminDeliveryController::class, 'calendar'])->name('deliveries.calendar');
        Route::get('deliveries/stats', [AdminDeliveryController::class, 'stats'])->name('deliveries.stats');
        Route::post('deliveries/auto-assign', [AdminDeliveryController::class, 'autoAssign'])->name('deliveries.auto-assign');
        Route::post('deliveries/bulk-assign', [AdminDeliveryController::class, 'bulkAssign'])->name('deliveries.bulk-assign');
        Route::get('deliveries/{delivery}', [AdminDeliveryController::class, 'show'])->name('deliveries.show');
        Route::post('deliveries/{delivery}/assign-driver', [AdminDeliveryController::class, 'assignDriver'])->name('deliveries.assign-driver');
        Route::post('deliveries/{delivery}/status', [AdminDeliveryController::class, 'updateStatus'])->name('deliveries.update-status');
        Route::post('deliveries/{delivery}/verify-proof', [AdminDeliveryController::class, 'verifyProof'])->name('deliveries.verify-proof');
        Route::post('deliveries/{delivery}/override-proof', [AdminDeliveryController::class, 'overrideProof'])->name('deliveries.override-proof');

        // Bottles (Phase 9)
        Route::resource('bottles', AdminBottleController::class)->names('bottles');
        Route::post('bottles/{bottle}/issue', [AdminBottleController::class, 'issue'])->name('bottles.issue');
        Route::post('bottles/{bottle}/return', [AdminBottleController::class, 'return'])->name('bottles.return');
        Route::post('bottles/{bottle}/mark-damaged', [AdminBottleController::class, 'markDamaged'])->name('bottles.mark-damaged');
        Route::post('bottles/{bottle}/mark-lost', [AdminBottleController::class, 'markLost'])->name('bottles.mark-lost');
        Route::get('bottles/{bottle}/logs', [AdminBottleController::class, 'logs'])->name('bottles.logs');
        Route::get('bottles/reports', [AdminBottleController::class, 'reports'])->name('bottles.reports');
        Route::post('bottles/scan-barcode', [AdminBottleController::class, 'scanBarcode'])->name('bottles.scan-barcode');

        // Loyalty (Phase 10)
        Route::get('loyalty', [AdminLoyaltyController::class, 'index'])->name('loyalty.index');
        Route::get('loyalty/{loyaltyPoint}', [AdminLoyaltyController::class, 'show'])->name('loyalty.show');
        Route::post('loyalty/{loyaltyPoint}/adjust', [AdminLoyaltyController::class, 'adjustPoints'])->name('loyalty.adjust');
        Route::post('loyalty/{loyaltyPoint}/toggle-status', [AdminLoyaltyController::class, 'toggleStatus'])->name('loyalty.toggle-status');
        Route::get('loyalty/transactions', [AdminLoyaltyController::class, 'transactions'])->name('loyalty.transactions');

        // Referrals (Phase 10)
        Route::get('referrals', [AdminReferralController::class, 'index'])->name('referrals.index');
        Route::get('referrals/{referral}', [AdminReferralController::class, 'show'])->name('referrals.show');
        Route::post('referrals/{referral}/approve', [AdminReferralController::class, 'approve'])->name('referrals.approve');
        Route::post('referrals/{referral}/reject', [AdminReferralController::class, 'reject'])->name('referrals.reject');
        Route::post('referrals/{referral}/process-rewards', [AdminReferralController::class, 'processRewards'])->name('referrals.process-rewards');
        Route::get('referrals/reports', [AdminReferralController::class, 'reports'])->name('referrals.reports');

        // Coupons (Phase 11)
        Route::resource('coupons', AdminCouponController::class)->names('coupons');
        Route::post('coupons/{coupon}/toggle-status', [AdminCouponController::class, 'toggleStatus'])->name('coupons.toggle-status');
        Route::get('coupons/{coupon}/usages', [AdminCouponController::class, 'usages'])->name('coupons.usages');

        // Campaigns (Phase 12)
        Route::resource('campaigns', AdminCampaignController::class)->names('campaigns');
        Route::post('campaigns/{campaign}/send', [AdminCampaignController::class, 'send'])->name('campaigns.send');
        Route::post('campaigns/{campaign}/cancel', [AdminCampaignController::class, 'cancel'])->name('campaigns.cancel');

        // Banners (Phase 12)
        Route::resource('banners', AdminBannerController::class)->names('banners');
        Route::post('banners/{banner}/toggle-status', [AdminBannerController::class, 'toggleStatus'])->name('banners.toggle-status');
        Route::post('banners/reorder', [AdminBannerController::class, 'reorder'])->name('banners.reorder');

        // Notifications (Phase 12)
        Route::get('notifications', [AdminNotificationController::class, 'index'])->name('notifications.index');
        Route::get('notifications/{notification}', [AdminNotificationController::class, 'show'])->name('notifications.show');
        Route::post('notifications/{notification}/retry', [AdminNotificationController::class, 'retry'])->name('notifications.retry');
        Route::get('notifications/stats', [AdminNotificationController::class, 'stats'])->name('notifications.stats');

        // Analytics (Phase 13)
        Route::get('analytics', [AdminAnalyticsController::class, 'dashboard'])->name('analytics.dashboard');
        Route::get('analytics/events', [AdminAnalyticsController::class, 'events'])->name('analytics.events');
        Route::get('analytics/funnel', [AdminAnalyticsController::class, 'funnel'])->name('analytics.funnel');
        Route::get('analytics/revenue', [AdminAnalyticsController::class, 'revenue'])->name('analytics.revenue');
        Route::get('analytics/products', [AdminAnalyticsController::class, 'products'])->name('analytics.products');
    });
});
