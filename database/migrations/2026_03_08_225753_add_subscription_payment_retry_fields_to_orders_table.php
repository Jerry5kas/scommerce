<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedInteger('payment_attempts')->default(0)->after('payment_status');
            $table->timestamp('next_payment_retry_at')->nullable()->after('payment_attempts');
            $table->timestamp('payment_failed_at')->nullable()->after('next_payment_retry_at');

            $table->index('next_payment_retry_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['next_payment_retry_at']);
            $table->dropColumn([
                'payment_attempts',
                'next_payment_retry_at',
                'payment_failed_at',
            ]);
        });
    }
};
