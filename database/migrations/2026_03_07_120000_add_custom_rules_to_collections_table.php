<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('collections', function (Blueprint $table) {
            $table->string('product_selection_mode')->default('category');
            $table->string('category_selection_mode')->default('all');
            $table->json('category_ids')->nullable();
            $table->json('product_ids')->nullable();
            $table->unsignedInteger('random_products_limit')->default(12);
        });
    }

    public function down(): void
    {
        Schema::table('collections', function (Blueprint $table) {
            $table->dropColumn([
                'product_selection_mode',
                'category_selection_mode',
                'category_ids',
                'product_ids',
                'random_products_limit',
            ]);
        });
    }
};
