<?php

namespace App\Console\Commands;

use App\Services\GoogleCalendarService;
use Carbon\Carbon;
use Google\Client as GoogleClient;
use Google\Service\Calendar;
use Google\Service\Calendar\ConferenceData;
use Google\Service\Calendar\ConferenceSolutionKey;
use Google\Service\Calendar\CreateConferenceRequest;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\EventDateTime;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GoogleCalendarTestCommand extends Command
{
    protected $signature = 'google:calendar-test';

    protected $description = 'Test Google Calendar API + Meet integration';

    public function handle(GoogleCalendarService $calendarService): int
    {
        $calendarId = config('google.calendar_id');
        $this->info('Project calendar: '.$calendarId);

        if ($calendarService->usesOAuth()) {
            $this->info('Auth: OAuth (calendar owner)');
            $this->info('OAuth client: '.config('google.oauth_client_path'));
        } else {
            $path = config('google.credentials_path');
            $this->info('Auth: service account');
            $this->info('Credentials: '.$path);

            if (! file_exists($path)) {
                $this->error('Credentials file missing.');

                return self::FAILURE;
            }

            $json = json_decode((string) file_get_contents($path), true);
            $this->info('Service account: '.($json['client_email'] ?? '?'));
            $this->info('GCP project_id: '.($json['project_id'] ?? '?'));
            $this->newLine();
            $this->warn('Share calendar with service account (Make changes to events):');
            $this->line($json['client_email'] ?? 'see credentials JSON');
        }

        try {
            $client = $this->makeTestClient($calendarService);
            $service = new Calendar($client);
            $service->events->listEvents($calendarId, ['maxResults' => 1]);
            $this->newLine();
            $this->info('Calendar API: OK — can access calendar.');
        } catch (\Throwable $e) {
            $this->newLine();
            $this->error('Calendar API failed:');
            $this->line(substr($e->getMessage(), 0, 600));

            return self::FAILURE;
        }

        if (! $calendarService->canCreateMeetLink()) {
            $this->warn('Meet: not available with service account on personal Gmail.');
            $this->line('1. APIs & Services → Credentials → Create OAuth client (Desktop)');
            $this->line('2. Save JSON as storage/app/google/calendar-oauth-client.json');
            $this->line('3. php artisan google:calendar-oauth');
            $this->line('4. Add GOOGLE_CALENDAR_REFRESH_TOKEN to .env');

            return self::SUCCESS;
        }

        try {
            $meetUrl = $this->createAndDeleteTestMeetEvent($calendarService);
            $this->info('Meet integration: OK'.($meetUrl ? ' — '.$meetUrl : ''));
        } catch (\Throwable $e) {
            $this->error('Meet test failed:');
            $this->line(substr($e->getMessage(), 0, 600));

            return self::FAILURE;
        }

        return self::SUCCESS;
    }

    private function makeTestClient(GoogleCalendarService $calendarService): GoogleClient
    {
        $client = new GoogleClient;
        $client->setApplicationName(config('app.name'));
        $client->setScopes([Calendar::CALENDAR_EVENTS]);

        if ($calendarService->usesOAuth()) {
            $client->setAuthConfig(config('google.oauth_client_path'));
            $client->fetchAccessTokenWithRefreshToken((string) config('google.refresh_token'));

            return $client;
        }

        $client->setAuthConfig(config('google.credentials_path'));
        if (filled(config('google.impersonate'))) {
            $client->setSubject(config('google.impersonate'));
        }

        return $client;
    }

    private function createAndDeleteTestMeetEvent(GoogleCalendarService $calendarService): ?string
    {
        $client = $this->makeTestClient($calendarService);
        $service = new Calendar($client);
        $timezone = config('google.timezone', 'Africa/Cairo');
        $start = Carbon::now($timezone)->addDay()->setTime(10, 0);
        $end = $start->copy()->addMinutes(15);

        $event = new Event([
            'summary' => 'Germany Pro Guide — API Meet test (delete me)',
            'start' => new EventDateTime([
                'dateTime' => $start->toRfc3339String(),
                'timeZone' => $timezone,
            ]),
            'end' => new EventDateTime([
                'dateTime' => $end->toRfc3339String(),
                'timeZone' => $timezone,
            ]),
            'conferenceData' => new ConferenceData([
                'createRequest' => new CreateConferenceRequest([
                    'requestId' => Str::uuid()->toString(),
                    'conferenceSolutionKey' => new ConferenceSolutionKey([
                        'type' => 'hangoutsMeet',
                    ]),
                ]),
            ]),
        ]);

        $created = $service->events->insert(
            config('google.calendar_id'),
            $event,
            ['conferenceDataVersion' => 1]
        );

        $meetUrl = $created->getHangoutLink()
            ?? $created->getConferenceData()?->getEntryPoints()[0]?->getUri();

        $service->events->delete(config('google.calendar_id'), $created->getId());

        return $meetUrl;
    }
}
