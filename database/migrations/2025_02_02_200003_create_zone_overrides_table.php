<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('zone_overrides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zone_id')->constrained('zones')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('address_id')->nullable()->constrained('user_addresses')->nullOnDelete();
            $table->text('reason');
            $table->foreignId('overridden_by')->constrained('admin_users')->cascadeOnDelete();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['zone_id', 'is_active']);
            $table->index(['user_id', 'is_active']);
            $table->index(['address_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('zone_overrides');
    }
};
