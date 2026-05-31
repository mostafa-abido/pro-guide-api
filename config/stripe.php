<?php

return [

    'key' => env('STRIPE_KEY'),

    'secret' => env('STRIPE_SECRET'),

    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),

    'currency' => env('STRIPE_CURRENCY', 'eur'),

    'frontend_url' => rtrim(env('FRONTEND_URL', env('APP_URL', 'http://localhost')), '/'),

    'success_url' => env(
        'STRIPE_SUCCESS_URL',
        rtrim(env('FRONTEND_URL', env('APP_URL', 'http://localhost')), '/').'/?booking_success=1&session_id={CHECKOUT_SESSION_ID}'
    ),

    'cancel_url' => env(
        'STRIPE_CANCEL_URL',
        rtrim(env('FRONTEND_URL', env('APP_URL', 'http://localhost')), '/').'/?booking_cancelled=1'
    ),

    'pending_minutes' => (int) env('BOOKING_PENDING_MINUTES', 30),

];
