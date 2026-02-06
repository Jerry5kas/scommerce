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
        Schema::create('referrals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('referrer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('referred_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('referral_code')->index();
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->timestamp('completed_at')->nullable();
            $table->enum('completion_criteria', ['first_order', 'first_delivery', 'first_subscription'])->default('first_order');
            $table->decimal('referrer_reward', 10, 2)->nullable();
            $table->decimal('referred_reward', 10, 2)->nullable();
            $table->boolean('referrer_reward_paid')->default(false);
            $table->boolean('referred_reward_paid')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['referrer_id', 'status']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referrals');
    }
};
