<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Services\BookingConfirmationService;
use Illuminate\Console\Command;

class SendBookingConfirmationCommand extends Command
{
    protected $signature = 'booking:send-confirmation {booking : Booking ID} {--force : Resend even if already sent}';

    protected $description = 'Send booking confirmation emails (and create Google Meet if missing)';

    public function handle(BookingConfirmationService $confirmationService): int
    {
        $booking = Booking::query()->with('slot')->find($this->argument('booking'));

        if (! $booking) {
            $this->error('Booking not found.');

            return self::FAILURE;
        }

        if ($booking->status !== 'paid') {
            $this->error('Booking is not paid (status: '.$booking->status.').');

            return self::FAILURE;
        }

        if ($this->option('force')) {
            $booking->confirmation_email_sent_at = null;
            $booking->save();
        }

        $confirmationService->sendIfNeeded($booking->fresh(['slot']));

        $booking->refresh();

        $this->info('Customer email: '.($booking->email ?? '—'));
        $this->info('Admin email: '.config('booking.admin_email'));
        $this->info('Meet URL: '.($booking->google_meet_url ?? 'not created'));
        $this->info('Email sent at: '.($booking->confirmation_email_sent_at ?? 'not sent — check storage/logs/laravel.log'));

        return self::SUCCESS;
    }
}
