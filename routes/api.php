<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', fn () => ['ok' => true]);

    Route::get('/settings', [\App\Http\Controllers\Api\V1\SettingsController::class, 'show']);
    Route::put('/settings', [\App\Http\Controllers\Api\V1\SettingsController::class, 'upsert']);

    Route::get('/services', [\App\Http\Controllers\Api\V1\ServicesController::class, 'index']);
    Route::get('/services/{slug}', [\App\Http\Controllers\Api\V1\ServicesController::class, 'show']);

    Route::get('/home', [\App\Http\Controllers\Api\V1\HomeController::class, 'show']);
    Route::get('/homepage', [\App\Http\Controllers\Api\V1\HomepageController::class, 'show']);
    Route::get('/stats', [\App\Http\Controllers\Api\V1\StatsController::class, 'index']);
    Route::post('/contact', [\App\Http\Controllers\Api\V1\ContactController::class, 'store']);

    Route::get('/availability', [\App\Http\Controllers\Api\V1\AvailabilityController::class, 'index']);
    Route::post('/bookings', [\App\Http\Controllers\Api\V1\BookingsController::class, 'store']);
});

