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
        Schema::create('imagekit_files', function (Blueprint $table) {
            $table->id();
            $table->string('file_hash', 64)->unique()->comment('MD5 hash of the file content');
            $table->string('file_id', 255)->unique()->comment('ImageKit file ID');
            $table->string('url', 500)->comment('ImageKit CDN URL');
            $table->string('file_path', 500)->comment('ImageKit file path');
            $table->string('name', 255)->comment('Original filename');
            $table->unsignedBigInteger('size')->comment('File size in bytes');
            $table->string('mime_type', 100)->nullable();
            $table->string('folder', 255)->nullable()->comment('Folder path in ImageKit');
            $table->timestamps();

            $table->index('file_hash');
            $table->index('folder');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imagekit_files');
    }
};
