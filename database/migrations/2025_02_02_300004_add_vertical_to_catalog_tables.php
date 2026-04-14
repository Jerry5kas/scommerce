<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->string('vertical', 50)->default('both');
        });
        Schema::table('collections', function (Blueprint $table) {
            $table->string('vertical', 50)->default('both');
        });
        Schema::table('products', function (Blueprint $table) {
            $table->string('vertical', 50)->default('both');
        });
    }

    public function down(): void
    {
        Schema::table('categories', fn (Blueprint $table) => $table->dropColumn('vertical'));
        Schema::table('collections', fn (Blueprint $table) => $table->dropColumn('vertical'));
        Schema::table('products', fn (Blueprint $table) => $table->dropColumn('vertical'));
    }
};
