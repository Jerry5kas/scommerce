<?php

use App\Enums\BusinessVertical;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('zones', function (Blueprint $table) {
            $table->json('verticals')->nullable()->after('is_active');
        });

        $both = json_encode(BusinessVertical::values());
        DB::table('zones')->update(['verticals' => $both]);
    }

    public function down(): void
    {
        Schema::table('zones', function (Blueprint $table) {
            $table->dropColumn('verticals');
        });
    }
};
