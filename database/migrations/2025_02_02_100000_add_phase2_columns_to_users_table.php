<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        if (in_array($driver, ['mysql', 'pgsql'])) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('name')->nullable()->change();
                $table->string('email')->nullable()->change();
                $table->string('password')->nullable()->change();
            });
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 20)->default('customer');
            $table->string('preferred_language', 10)->default('en');
            $table->boolean('communication_consent')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->boolean('free_sample_used')->default(false);
            $table->string('device_fingerprint_hash', 64)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'preferred_language',
                'communication_consent',
                'is_active',
                'last_login_at',
                'free_sample_used',
                'device_fingerprint_hash',
            ]);
        });

        $driver = Schema::getConnection()->getDriverName();
        if (in_array($driver, ['mysql', 'pgsql'])) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('name')->nullable(false)->change();
                $table->string('email')->nullable(false)->change();
                $table->string('password')->nullable(false)->change();
            });
        }
    }
};
