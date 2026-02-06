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
        Schema::create('bottle_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bottle_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('delivery_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('action', ['issued', 'returned', 'damaged', 'lost', 'found', 'transferred']);
            $table->enum('action_by', ['system', 'driver', 'admin', 'customer']);
            $table->unsignedBigInteger('action_by_id')->nullable(); // User/Driver/Admin ID
            $table->string('condition')->nullable(); // Condition at return (good, damaged, etc.)
            $table->text('notes')->nullable();
            $table->decimal('deposit_amount', 10, 2)->nullable(); // Deposit charged at issue
            $table->decimal('refund_amount', 10, 2)->nullable(); // Refund at return
            $table->timestamps();

            $table->index('bottle_id');
            $table->index('user_id');
            $table->index(['action', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bottle_logs');
    }
};
