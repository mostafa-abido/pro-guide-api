<?php

namespace App\Services;

use App\Mail\BookingConfirmedMail;
use App\Models\Booking;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

final class BookingConfirmationService
{
    public function __construct(
        private readonly GoogleCalendarService $googleCalendarService,
    ) {
    }

    public function sendIfNeeded(Booking $booking): void
    {
        $booking->refresh();

        if ($booking->status !== 'paid') {
            return;
        }

        if ($booking->confirmation_email_sent_at !== null) {
            return;
        }

        if (! filled($booking->email)) {
            Log::warning('Booking confirmation skipped: no customer email.', ['booking_id' => $booking->id]);

            return;
        }

        $this->ensureGoogleMeetLink($booking);
        $booking->refresh();

        $adminEmail = config('booking.admin_email');

        if (! filled(config('mail.mailers.smtp.password')) && config('mail.default') === 'smtp') {
            Log::error('MAIL_PASSWORD is empty. Cannot send booking confirmation emails.', [
                'booking_id' => $booking->id,
            ]);

            return;
        }

        try {
            Mail::to($booking->email)->send(new BookingConfirmedMail($booking, forAdmin: false));

            if (filled($adminEmail) && strtolower($adminEmail) !== strtolower((string) $booking->email)) {
                Mail::to($adminEmail)->send(new BookingConfirmedMail($booking->fresh(), forAdmin: true));
            }

            $booking->confirmation_email_sent_at = now();
            $booking->save();
        } catch (\Throwable $e) {
            Log::error('Failed to send booking confirmation emails.', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function ensureGoogleMeetLink(Booking $booking): void
    {
        if (filled($booking->google_meet_url)) {
            return;
        }

        if (! $this->googleCalendarService->isConfigured()) {
            Log::info('Google Calendar not configured; skipping Meet link.', ['booking_id' => $booking->id]);

            return;
        }

        try {
            $result = $this->googleCalendarService->createConsultationEvent($booking);

            $booking->google_calendar_event_id = $result['event_id'];
            $booking->google_meet_url = $result['meet_url'];
            $booking->save();
        } catch (\Throwable $e) {
            $message = $e->getMessage();
            if (str_contains($message, 'accessNotConfigured') || str_contains($message, 'Google Calendar API has not been used')) {
                Log::error('Enable Google Calendar API in Cloud Console (project germanyproguide), then share calendar with service account.', [
                    'booking_id' => $booking->id,
                    'help' => 'https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=germanyproguide',
                ]);
            } else {
                Log::error('Failed to create Google Calendar event.', [
                    'booking_id' => $booking->id,
                    'error' => $message,
                ]);
            }
        }
    }
}
