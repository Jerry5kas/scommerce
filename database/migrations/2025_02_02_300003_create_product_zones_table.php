<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('zone_id')->constrained('zones')->cascadeOnDelete();
            $table->boolean('is_available')->default(true);
            $table->decimal('price_override', 10, 2)->nullable();
            $table->unsignedInteger('stock_quantity')->nullable();
            $table->timestamps();

            $table->unique(['product_id', 'zone_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_zones');
    }
};
