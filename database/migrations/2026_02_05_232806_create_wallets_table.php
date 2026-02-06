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
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->decimal('balance', 10, 2)->default(0);
            $table->string('currency', 3)->default('INR');
            $table->boolean('is_active')->default(true);
            $table->decimal('low_balance_threshold', 10, 2)->default(100)->comment('For reminders');
            $table->boolean('auto_recharge_enabled')->default(false);
            $table->decimal('auto_recharge_amount', 10, 2)->nullable();
            $table->decimal('auto_recharge_threshold', 10, 2)->nullable();
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};
