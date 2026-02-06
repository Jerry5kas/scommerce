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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('price', 10, 2); // Price at time of add
            $table->decimal('subtotal', 10, 2); // quantity * price
            $table->string('vertical')->default('daily_fresh'); // daily_fresh or society_fresh
            $table->boolean('is_subscription')->default(false);
            $table->foreignId('subscription_plan_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->unique(['cart_id', 'product_id', 'is_subscription']);
            $table->index(['cart_id', 'vertical']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
