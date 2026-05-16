<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $spaIndex = public_path('spa/index.html');

    // Built React app (local test or production) — works on port 8000
    if (file_exists($spaIndex)) {
        return response()->file($spaIndex);
    }

    // Local dev without build: open Vite directly
    if (app()->environment('local')) {
        return redirect()->away(config('app.frontend_dev_url', 'http://127.0.0.1:3000'));
    }

    return view('welcome');
});
