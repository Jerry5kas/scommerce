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
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['home', 'category', 'product', 'promotional'])->default('home');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('image');
            $table->string('mobile_image')->nullable();
            $table->string('link_url')->nullable();
            $table->enum('link_type', ['product', 'category', 'collection', 'external', 'none'])->default('none');
            $table->string('link_id')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->json('zones')->nullable();
            $table->timestamps();

            $table->index(['type', 'is_active']);
            $table->index('display_order');
            $table->index(['starts_at', 'ends_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
