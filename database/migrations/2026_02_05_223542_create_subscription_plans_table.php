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
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Daily", "Alternate Days"
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('frequency_type', ['daily', 'alternate_days', 'weekly', 'custom'])->default('daily');
            $table->unsignedInteger('frequency_value')->nullable(); // For custom (e.g., every 3 days)
            $table->json('days_of_week')->nullable(); // For weekly/custom schedule [0-6] where 0=Sunday
            $table->decimal('discount_percent', 5, 2)->default(0); // Plan discount percentage
            $table->unsignedInteger('min_deliveries')->nullable(); // Minimum deliveries commitment
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'display_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
