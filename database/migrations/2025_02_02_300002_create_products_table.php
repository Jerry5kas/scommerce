<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('collection_id')->nullable()->constrained('collections')->nullOnDelete();
            $table->string('image');
            $table->json('images')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('compare_at_price', 10, 2)->nullable();
            $table->decimal('cost_price', 10, 2)->nullable();
            $table->unsignedInteger('stock_quantity')->default(0);
            $table->boolean('is_in_stock')->default(true);
            $table->boolean('is_subscription_eligible')->default(false);
            $table->boolean('requires_bottle')->default(false);
            $table->decimal('bottle_deposit', 10, 2)->nullable();
            $table->boolean('is_one_time_purchase')->default(true);
            $table->unsignedInteger('min_quantity')->default(1);
            $table->unsignedInteger('max_quantity')->nullable();
            $table->string('unit', 50)->default('piece');
            $table->decimal('weight', 10, 3)->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();

            $table->index('slug');
            $table->index('sku');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
