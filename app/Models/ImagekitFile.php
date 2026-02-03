<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImagekitFile extends Model
{
    protected $fillable = [
        'file_hash',
        'file_id',
        'url',
        'file_path',
        'name',
        'size',
        'mime_type',
        'folder',
    ];

    protected $casts = [
        'size' => 'integer',
    ];
}
