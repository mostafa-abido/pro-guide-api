<?php

namespace App\Services;

use App\Models\Booking;
use Carbon\Carbon;
use Google\Client as GoogleClient;
use Google\Service\Calendar;
use Google\Service\Calendar\ConferenceData;
use Google\Service\Calendar\ConferenceSolutionKey;
use Google\Service\Calendar\CreateConferenceRequest;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\EventDateTime;
use Illuminate\Support\Str;

final class GoogleCalendarService
{
    public function isConfigured(): bool
    {
        return filled(config('google.calendar_id'))
            && ($this->usesOAuth() || $this->hasServiceAccountCredentials());
    }

    public function canCreateMeetLink(): bool
    {
        return $this->usesOAuth() || filled(config('google.impersonate'));
    }

    public function usesOAuth(): bool
    {
        $oauthPath = config('google.oauth_client_path');

        return filled(config('google.refresh_token'))
            && is_string($oauthPath)
            && file_exists($oauthPath);
    }

    /**
     * @return array{event_id: string, meet_url: string|null}
     */
    public function createConsultationEvent(Booking $booking): array
    {
        if (! $this->isConfigured()) {
            throw new \RuntimeException('Google Calendar is not configured.');
        }

        if (! $this->canCreateMeetLink()) {
            throw new \RuntimeException(
                'Google Meet requires OAuth for personal Gmail. Run: php artisan google:calendar-oauth'
            );
        }

        $booking->loadMissing('slot');

        $slot = $booking->slot;
        if (! $slot) {
            throw new \RuntimeException('Booking slot not found.');
        }

        $timezone = config('google.timezone', 'Africa/Cairo');
        $date = $slot->date?->format('Y-m-d') ?? '';
        $time = substr((string) $slot->time, 0, 8);
        if (strlen($time) === 5) {
            $time .= ':00';
        }

        $start = Carbon::parse("{$date} {$time}", $timezone);
        $end = $start->copy()->addMinutes((int) ($slot->duration_minutes ?: 30));

        $client = $this->makeClient();
        $service = new Calendar($client);

        $eventData = [
            'summary' => 'Germany Pro Guide — Consultation: '.$booking->full_name,
            'description' => $this->buildDescription($booking),
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
        ];

        // No attendees / sendUpdates — Meet link is sent only via BookingConfirmedMail
        // (avoids a second email from the calendar owner, e.g. "eng abido").
        $created = $service->events->insert(
            config('google.calendar_id'),
            new Event($eventData),
            ['conferenceDataVersion' => 1]
        );

        $meetUrl = $created->getHangoutLink()
            ?? $created->getConferenceData()?->getEntryPoints()[0]?->getUri();

        return [
            'event_id' => (string) $created->getId(),
            'meet_url' => $meetUrl,
        ];
    }

    private function buildDescription(Booking $booking): string
    {
        $slot = $booking->slot;
        $lines = [
            'Booking #'.$booking->id,
            'Customer: '.$booking->full_name,
            'Email: '.($booking->email ?? '—'),
            'Phone: '.($booking->phone ?? '—'),
        ];

        if ($slot) {
            $lines[] = 'Date: '.$slot->date?->format('Y-m-d');
            $lines[] = 'Time: '.substr((string) $slot->time, 0, 5);
            $lines[] = 'Duration: '.($slot->duration_minutes ?? 30).' min';
            $lines[] = 'Price: '.number_format($slot->price_cents / 100, 2).' '.$slot->currency;
        }

        return implode("\n", $lines);
    }

    private function hasServiceAccountCredentials(): bool
    {
        $path = config('google.credentials_path');

        return is_string($path) && file_exists($path);
    }

    private function makeClient(): GoogleClient
    {
        $client = new GoogleClient;
        $client->setApplicationName(config('app.name'));
        $client->setScopes([Calendar::CALENDAR_EVENTS]);

        if ($this->usesOAuth()) {
            $client->setAuthConfig(config('google.oauth_client_path'));
            $client->fetchAccessTokenWithRefreshToken((string) config('google.refresh_token'));

            return $client;
        }

        $client->setAuthConfig(config('google.credentials_path'));

        $impersonate = config('google.impersonate');
        if (filled($impersonate)) {
            $client->setSubject($impersonate);
        }

        return $client;
    }
}
