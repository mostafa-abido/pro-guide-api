<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Booking $booking,
        public readonly bool $forAdmin = false,
    ) {
        $this->booking->loadMissing('slot');
    }

    public function envelope(): Envelope
    {
        $slot = $this->booking->slot;
        $date = $slot?->date?->format('Y-m-d') ?? '';
        $time = $slot ? substr((string) $slot->time, 0, 5) : '';

        $subject = $this->forAdmin
            ? "New paid booking — {$this->booking->full_name} ({$date} {$time})"
            : "Your consultation is confirmed — {$date} at {$time}";

        return new Envelope(
            from: new Address(
                (string) config('mail.from.address'),
                (string) config('booking.from_name'),
            ),
            subject: $subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.booking-confirmed',
        );
    }
}
