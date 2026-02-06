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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique()->index(); // e.g., "FT-2024-001234"
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_address_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_id')->nullable()->constrained()->nullOnDelete();
            $table->string('vertical')->default('daily_fresh'); // daily_fresh or society_fresh
            $table->enum('type', ['one_time', 'subscription'])->default('one_time');
            $table->enum('status', ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'])->default('pending');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('delivery_charge', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->string('currency', 3)->default('INR');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->string('payment_method')->nullable(); // Phase 7
            $table->foreignId('coupon_id')->nullable(); // Phase 11
            $table->string('coupon_code')->nullable();
            $table->text('delivery_instructions')->nullable();
            $table->date('scheduled_delivery_date');
            $table->time('scheduled_delivery_time')->nullable();
            $table->foreignId('driver_id')->nullable(); // Phase 8
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->text('notes')->nullable(); // Internal notes
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'scheduled_delivery_date']);
            $table->index(['vertical', 'status']);
            $table->index('scheduled_delivery_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
