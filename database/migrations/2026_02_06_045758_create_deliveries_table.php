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
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('driver_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_address_id')->constrained()->onDelete('cascade');
            $table->foreignId('zone_id')->constrained()->onDelete('cascade');
            $table->enum('status', [
                'pending',
                'assigned',
                'out_for_delivery',
                'delivered',
                'failed',
                'cancelled',
            ])->default('pending');
            $table->date('scheduled_date');
            $table->time('scheduled_time')->nullable();
            $table->string('time_slot')->nullable(); // e.g., 'morning', 'evening'
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('dispatched_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->string('delivery_proof_image')->nullable();
            $table->boolean('delivery_proof_verified')->default(false);
            $table->unsignedBigInteger('delivery_proof_verified_by')->nullable();
            $table->timestamp('delivery_proof_verified_at')->nullable();
            $table->text('failure_reason')->nullable();
            $table->text('delivery_instructions')->nullable();
            $table->string('customer_signature')->nullable();
            $table->text('notes')->nullable();
            $table->integer('sequence')->nullable(); // Order in driver's route
            $table->decimal('estimated_distance', 8, 2)->nullable(); // In km
            $table->integer('estimated_time')->nullable(); // In minutes
            $table->timestamps();

            $table->index(['driver_id', 'scheduled_date']);
            $table->index(['zone_id', 'scheduled_date']);
            $table->index(['status', 'scheduled_date']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};
