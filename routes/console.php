<?php

use App\Services\OtpService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    app(OtpService::class)->cleanupExpiredOtps();
})->daily()->name('otp:cleanup');

// Subscription order generation - runs daily at 6 AM
Schedule::command('subscriptions:generate-orders')
    ->dailyAt('06:00')
    ->name('subscriptions:generate-orders')
    ->withoutOverlapping()
    ->onOneServer();

// Update next delivery dates - runs daily at 5 AM (before order generation)
Schedule::command('subscriptions:update-next-delivery')
    ->dailyAt('05:00')
    ->name('subscriptions:update-next-delivery')
    ->withoutOverlapping()
    ->onOneServer();
