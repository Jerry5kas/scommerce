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
        Schema::create('bottles', function (Blueprint $table) {
            $table->id();
            $table->string('bottle_number')->unique();
            $table->string('barcode')->unique()->nullable();
            $table->enum('type', ['standard', 'premium', 'custom'])->default('standard');
            $table->decimal('capacity', 5, 2)->nullable(); // Capacity in litres
            $table->enum('status', ['available', 'issued', 'returned', 'damaged', 'lost'])->default('available');
            $table->foreignId('current_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('current_subscription_id')->nullable()->constrained('subscriptions')->onDelete('set null');
            $table->decimal('purchase_cost', 10, 2)->nullable();
            $table->decimal('deposit_amount', 10, 2)->nullable();
            $table->timestamp('issued_at')->nullable();
            $table->timestamp('returned_at')->nullable();
            $table->timestamp('damaged_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('current_user_id');
            $table->index('current_subscription_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bottles');
    }
};
