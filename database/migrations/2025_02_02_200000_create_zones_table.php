<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('zones', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->json('boundary_coordinates')->nullable();
            $table->json('pincodes')->nullable();
            $table->string('city');
            $table->string('state');
            $table->boolean('is_active')->default(true);
            $table->decimal('delivery_charge', 10, 2)->nullable();
            $table->decimal('min_order_amount', 10, 2)->nullable();
            $table->json('service_days')->nullable();
            $table->time('service_time_start')->nullable();
            $table->time('service_time_end')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('zones');
    }
};
