<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('employee_id')->unique();
            $table->foreignId('zone_id')->nullable()->constrained()->nullOnDelete();
            $table->string('vehicle_number')->nullable();
            $table->string('vehicle_type')->nullable();
            $table->string('license_number')->nullable();
            $table->string('phone')->index();
            $table->boolean('is_active')->default(true);
            $table->decimal('current_latitude', 10, 8)->nullable();
            $table->decimal('current_longitude', 11, 8)->nullable();
            $table->timestamp('last_location_update')->nullable();
            $table->boolean('is_online')->default(false);
            $table->timestamps();

            $table->index('zone_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
