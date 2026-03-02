<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        if (Schema::hasColumn('subscription_plans', 'slug') && DB::getDriverName() === 'sqlite') {
            Schema::table('subscription_plans', function (Blueprint $table) {
                try {
                    $table->dropUnique('subscription_plans_slug_unique');
                } catch (\Throwable) {
                }

                try {
                    $table->dropIndex('subscription_plans_is_active_display_order_index');
                } catch (\Throwable) {
                }
            });
        }

        // 1. Modify subscription_plans
        Schema::table('subscription_plans', function (Blueprint $table) {
            // Drop columns not in the new requirement
            // Existing: name, slug, description, frequency_type, frequency_value, days_of_week, discount_percent, min_deliveries, is_active, display_order, created_at, updated_at, prices

            if (Schema::hasColumn('subscription_plans', 'slug')) {
                $table->dropColumn('slug');
            }
            if (Schema::hasColumn('subscription_plans', 'frequency_value')) {
                $table->dropColumn('frequency_value');
            }
            if (Schema::hasColumn('subscription_plans', 'days_of_week')) {
                $table->dropColumn('days_of_week');
            }
            if (Schema::hasColumn('subscription_plans', 'discount_percent')) {
                $table->dropColumn('discount_percent');
            }
            if (Schema::hasColumn('subscription_plans', 'min_deliveries')) {
                $table->dropColumn('min_deliveries');
            }
            if (Schema::hasColumn('subscription_plans', 'display_order')) {
                $table->dropColumn('display_order');
            }
            if (Schema::hasColumn('subscription_plans', 'prices')) {
                $table->dropColumn('prices');
            }

            // Drop frequency_type to recreate it with new enum values
            if (Schema::hasColumn('subscription_plans', 'frequency_type')) {
                $table->dropColumn('frequency_type');
            }
        });

        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->enum('frequency_type', ['daily', 'alternate', 'weekly', 'custom'])->default('daily')->after('description');
            $table->enum('discount_type', ['none', 'percentage', 'flat'])->default('none')->after('frequency_type');
            $table->decimal('discount_value', 10, 2)->default(0)->after('discount_type');
            $table->integer('sort_order')->default(0)->after('is_active');
        });

        // 2. Create subscription_plan_items
        Schema::create('subscription_plan_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_plan_id')->constrained('subscription_plans')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->integer('units');
            $table->decimal('total_price', 10, 2);
            $table->decimal('per_unit_price', 10, 2);
            $table->timestamps();
        });

        // 3. Create subscription_plan_features
        Schema::create('subscription_plan_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_plan_id')->constrained('subscription_plans')->cascadeOnDelete();
            $table->string('title');
            $table->boolean('highlight')->default(false);
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('subscription_plan_features');
        Schema::dropIfExists('subscription_plan_items');

        // Revert subscription_plans changes (simplified revert)
        Schema::table('subscription_plans', function (Blueprint $table) {
            if (Schema::hasColumn('subscription_plans', 'discount_type')) {
                $table->dropColumn('discount_type');
            }
            if (Schema::hasColumn('subscription_plans', 'discount_value')) {
                $table->dropColumn('discount_value');
            }
            if (Schema::hasColumn('subscription_plans', 'sort_order')) {
                $table->dropColumn('sort_order');
            }
            if (Schema::hasColumn('subscription_plans', 'frequency_type')) {
                $table->dropColumn('frequency_type');
            }
        });

        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->string('slug')->nullable();
            $table->enum('frequency_type', ['daily', 'alternate_days', 'weekly', 'custom'])->default('daily');
            $table->unsignedInteger('frequency_value')->nullable();
            $table->json('days_of_week')->nullable();
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->unsignedInteger('min_deliveries')->nullable();
            $table->unsignedInteger('display_order')->default(0);
        });

        Schema::enableForeignKeyConstraints();
    }
};
