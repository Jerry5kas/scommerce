<?php

return [
    /*
    |--------------------------------------------------------------------------
    | ImageKit Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for ImageKit file storage and CDN service.
    | All file uploads (images, videos, PDFs, etc.) will be stored in ImageKit.
    |
    */

    'public_key' => env('IMAGEKIT_PUBLIC_KEY', 'public_2A0pqkjuGD6Pd6Seq2tGcxCuEHY='),

    'private_key' => env('IMAGEKIT_PRIVATE_KEY', 'private_t+FPuCBCTFVQs5L+fGfP2+dMxZg='),

    'url_endpoint' => env('IMAGEKIT_URL_ENDPOINT', 'https://ik.imagekit.io/imagestoragetech/'),

    /*
    |--------------------------------------------------------------------------
    | Upload Settings
    |--------------------------------------------------------------------------
    */

    'upload_folder' => env('IMAGEKIT_UPLOAD_FOLDER', 'scommerce'),

    'use_unique_filename' => env('IMAGEKIT_USE_UNIQUE_FILENAME', true),

    /*
    |--------------------------------------------------------------------------
    | Image Transformation Settings
    |--------------------------------------------------------------------------
    */

    'default_quality' => env('IMAGEKIT_DEFAULT_QUALITY', 80),

    'auto_format' => env('IMAGEKIT_AUTO_FORMAT', true),

    'compression' => [
        'enabled' => env('IMAGEKIT_COMPRESSION_ENABLED', true),
        'quality' => env('IMAGEKIT_COMPRESSION_QUALITY', 80),
    ],

    /*
    |--------------------------------------------------------------------------
    | CDN Settings
    |--------------------------------------------------------------------------
    */

    'cdn_enabled' => env('IMAGEKIT_CDN_ENABLED', true),

    'cdn_url' => env('IMAGEKIT_CDN_URL', 'https://ik.imagekit.io/imagestoragetech/'),

    /*
    |--------------------------------------------------------------------------
    | Allowed File Types
    |--------------------------------------------------------------------------
    */

    'allowed_mime_types' => [
        // Images
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        // Videos
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/quicktime',
        // Documents
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        // Other
        'text/plain',
        'application/json',
    ],

    'max_file_size' => env('IMAGEKIT_MAX_FILE_SIZE', 10485760), // 10MB in bytes

    /*
    |--------------------------------------------------------------------------
    | Transformation Presets
    |--------------------------------------------------------------------------
    */

    'presets' => [
        'thumbnail' => [
            'width' => 300,
            'height' => 300,
            'quality' => 80,
            'format' => 'auto',
        ],
        'medium' => [
            'width' => 800,
            'height' => 800,
            'quality' => 85,
            'format' => 'auto',
        ],
        'large' => [
            'width' => 1200,
            'height' => 1200,
            'quality' => 90,
            'format' => 'auto',
        ],
    ],
];
