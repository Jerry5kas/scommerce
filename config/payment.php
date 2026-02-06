<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Payment Gateway
    |--------------------------------------------------------------------------
    |
    | This option controls the default payment gateway that will be used when
    | processing online payments. You may set this to any of the gateways
    | defined in the "gateways" array below.
    |
    */

    'default' => env('PAYMENT_GATEWAY', 'razorpay'),

    /*
    |--------------------------------------------------------------------------
    | Mock Payments (Testing)
    |--------------------------------------------------------------------------
    |
    | When enabled, payments will be mocked instead of actually processed
    | through the gateway. Useful for local development and testing.
    |
    */

    'mock' => env('PAYMENT_MOCK', false),

    /*
    |--------------------------------------------------------------------------
    | Payment Gateways
    |--------------------------------------------------------------------------
    |
    | Here you may configure all of the payment gateways used by your
    | application. Multiple gateways are supported.
    |
    */

    'gateways' => [
        'razorpay' => [
            'key_id' => env('RAZORPAY_KEY_ID'),
            'key_secret' => env('RAZORPAY_KEY_SECRET'),
            'webhook_secret' => env('RAZORPAY_WEBHOOK_SECRET'),
        ],

        'stripe' => [
            'secret_key' => env('STRIPE_SECRET_KEY'),
            'publishable_key' => env('STRIPE_PUBLISHABLE_KEY'),
            'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    |
    | Default currency for payments.
    |
    */

    'currency' => env('PAYMENT_CURRENCY', 'INR'),

    /*
    |--------------------------------------------------------------------------
    | Webhook URL
    |--------------------------------------------------------------------------
    |
    | Base URL for webhook callbacks.
    |
    */

    'webhook_url' => env('APP_URL').'/api/webhooks/payment',
];
