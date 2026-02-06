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
        Schema::create('loyalty_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loyalty_point_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['earned', 'redeemed', 'expired', 'adjusted']);
            $table->integer('points'); // Positive for earned, negative for redeemed
            $table->integer('balance_before');
            $table->integer('balance_after');
            $table->enum('source', ['delivery', 'purchase', 'referral', 'promotion', 'admin', 'conversion']);
            $table->string('reference_id')->nullable();
            $table->string('reference_type')->nullable();
            $table->text('description')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('completed');
            $table->timestamps();

            $table->index(['user_id', 'type']);
            $table->index(['type', 'created_at']);
            $table->index(['source', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loyalty_transactions');
    }
};
