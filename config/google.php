<?php

return [

    'calendar_id' => env('GOOGLE_CALENDAR_ID'),

    'credentials_path' => (function (): string {
        $path = env(
            'GOOGLE_CALENDAR_CREDENTIALS_PATH',
            storage_path('app/google/calendar-credentials.json')
        );

        if ($path === null || $path === '') {
            return storage_path('app/google/calendar-credentials.json');
        }

        return str_starts_with($path, '/')
            ? $path
            : base_path($path);
    })(),

    /**
     * Google Workspace only: impersonate this user when creating events.
     * Leave empty when using a calendar shared with the service account.
     */
    'impersonate' => env('GOOGLE_CALENDAR_IMPERSONATE'),

    'timezone' => env('GOOGLE_CALENDAR_TIMEZONE', env('APP_TIMEZONE', 'Africa/Cairo')),

    /**
     * OAuth client JSON (Desktop app) — required for Google Meet on personal @gmail.com calendars.
     */
    'oauth_client_path' => (function (): string {
        $path = env(
            'GOOGLE_CALENDAR_OAUTH_CLIENT_PATH',
            storage_path('app/google/calendar-oauth-client.json')
        );

        if ($path === null || $path === '') {
            return storage_path('app/google/calendar-oauth-client.json');
        }

        return str_starts_with($path, '/')
            ? $path
            : base_path($path);
    })(),

    'refresh_token' => env('GOOGLE_CALENDAR_REFRESH_TOKEN'),

];
