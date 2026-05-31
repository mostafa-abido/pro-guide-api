<?php

namespace App\Services;

use App\Models\AppointmentSlot;
use App\Models\Booking;
use Stripe\Checkout\Session;
use Stripe\Stripe;

final class StripeCheckoutService
{
    public function __construct()
    {
        Stripe::setApiKey(config('stripe.secret'));
    }

    public function createSession(Booking $booking, AppointmentSlot $slot): Session
    {
        $date = $slot->date?->format('Y-m-d') ?? '';
        $time = substr((string) $slot->time, 0, 5);

        return Session::create([
            'mode' => 'payment',
            'client_reference_id' => (string) $booking->id,
            'customer_email' => $booking->email,
            'line_items' => [
                [
                    'quantity' => 1,
                    'price_data' => [
                        'currency' => strtolower($slot->currency ?: config('stripe.currency')),
                        'unit_amount' => $slot->price_cents,
                        'product_data' => [
                            'name' => "Consultation — {$date} {$time}",
                            'description' => "Duration: {$slot->duration_minutes} minutes",
                        ],
                    ],
                ],
            ],
            'metadata' => [
                'booking_id' => (string) $booking->id,
                'appointment_slot_id' => (string) $slot->id,
            ],
            'success_url' => config('stripe.success_url'),
            'cancel_url' => config('stripe.cancel_url'),
        ]);
    }

    public function retrieveSession(string $sessionId): Session
    {
        return Session::retrieve($sessionId, [
            'expand' => ['line_items'],
        ]);
    }
}
