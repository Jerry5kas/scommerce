<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE users MODIFY name VARCHAR(255) NULL, MODIFY email VARCHAR(255) NULL, MODIFY password VARCHAR(255) NULL');
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 20)->default('customer')->after('password');
            $table->string('preferred_language', 10)->default('en')->after('role');
            $table->boolean('communication_consent')->default(false)->after('preferred_language');
            $table->boolean('is_active')->default(true)->after('communication_consent');
            $table->timestamp('last_login_at')->nullable()->after('is_active');
            $table->boolean('free_sample_used')->default(false)->after('last_login_at');
            $table->string('device_fingerprint_hash', 64)->nullable()->after('free_sample_used');
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
        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE users MODIFY name VARCHAR(255) NOT NULL, MODIFY email VARCHAR(255) NOT NULL, MODIFY password VARCHAR(255) NOT NULL');
        }
    }
};
