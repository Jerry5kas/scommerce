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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_address_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_plan_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['active', 'paused', 'cancelled', 'expired'])->default('active');
            $table->date('start_date');
            $table->date('end_date')->nullable(); // If has expiry
            $table->date('next_delivery_date')->nullable(); // Calculated next delivery
            $table->date('paused_until')->nullable(); // If paused temporarily
            $table->date('vacation_start')->nullable();
            $table->date('vacation_end')->nullable();
            $table->enum('billing_cycle', ['weekly', 'monthly'])->default('monthly');
            $table->boolean('auto_renew')->default(true);
            $table->text('notes')->nullable(); // Delivery instructions
            $table->string('vertical')->default('society_fresh'); // Business vertical
            $table->unsignedInteger('bottles_issued')->default(0);
            $table->unsignedInteger('bottles_returned')->default(0);
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'next_delivery_date']);
            $table->index('next_delivery_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
