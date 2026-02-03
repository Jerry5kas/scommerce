<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'gtm' => [
        'id' => env('GTM_ID'),
    ],

    'meta_pixel' => [
        'id' => env('META_PIXEL_ID'),
    ],

    'google_ads' => [
        'id' => env('GOOGLE_ADS_ID'),
    ],

    'sms' => [
        'driver' => env('SMS_DRIVER', 'log'),
        'msg91_key' => env('MSG91_AUTH_KEY'),
        'twilio_sid' => env('TWILIO_SID'),
        'twilio_token' => env('TWILIO_AUTH_TOKEN'),
    ],

    'whatsapp' => [
        'api_url' => env('WHATSAPP_API_URL'),
        'token' => env('WHATSAPP_TOKEN'),
    ],

    'firebase' => [
        'credentials' => env('FIREBASE_CREDENTIALS'),
    ],

    'payment' => [
        'razorpay_key' => env('RAZORPAY_KEY_ID'),
        'razorpay_secret' => env('RAZORPAY_KEY_SECRET'),
    ],

    'imagekit' => [
        'public_key' => env('IMAGEKIT_PUBLIC_KEY'),
        'private_key' => env('IMAGEKIT_PRIVATE_KEY'),
        'url_endpoint' => env('IMAGEKIT_URL_ENDPOINT'),
    ],

];
