<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add variant-specific pricing to subscription plans.
     *
     * Stores a JSON object keyed by variant size (e.g. "480ml", "1L").
     * Each entry holds:
     *   - units          : int    — number of deliveries committed
     *   - price_per_unit : float  — discounted price per unit
     *   - total_price    : float  — price_per_unit × units
     *   - mrp_per_unit   : float  — retail / MRP price per unit (for "X% OFF" badge)
     *
     * Example:
     * {
     *   "480ml": { "units": 30, "price_per_unit": 41, "total_price": 1230, "mrp_per_unit": 80 },
     *   "1L":    { "units": 30, "price_per_unit": 81, "total_price": 2430, "mrp_per_unit": 160 }
     * }
     */
    public function up(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->json('prices')->nullable()->after('discount_percent');
        });
    }

    public function down(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->dropColumn('prices');
        });
    }
};
