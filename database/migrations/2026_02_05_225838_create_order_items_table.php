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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('product_name'); // Snapshot of product name
            $table->string('product_sku'); // Snapshot of SKU
            $table->string('product_image')->nullable(); // Snapshot of image
            $table->unsignedInteger('quantity');
            $table->decimal('price', 10, 2); // Price at time of order
            $table->decimal('subtotal', 10, 2);
            $table->boolean('is_free_sample')->default(false);
            $table->foreignId('free_sample_id')->nullable(); // Phase 4
            $table->timestamps();

            $table->index('order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
