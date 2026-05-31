<?php

namespace App\Services;

use App\DTO\BookingCheckoutData;
use App\Models\AppointmentSlot;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;
use Throwable;

final class BookingsService
{
    public function __construct(
        private readonly StripeCheckoutService $stripeCheckoutService,
        private readonly BookingConfirmationService $bookingConfirmationService,
    ) {
    }

    /**
     * @return array{booking: Booking, checkout_url: string}
     *
     * @throws Throwable
     */
    public function startCheckout(BookingCheckoutData $data): array
    {
        return DB::transaction(function () use ($data): array {
            $slot = AppointmentSlot::query()
                ->whereKey($data->appointmentSlotId)
                ->lockForUpdate()
                ->first();

            if (! $slot) {
                abort(404, 'Slot not found.');
            }

            if ($slot->is_booked) {
                abort(422, 'Slot already booked.');
            }

            if ($this->slotHasActivePendingBooking($slot->id)) {
                abort(422, 'This slot is being checked out by another customer. Please try again shortly.');
            }

            $booking = Booking::query()->create([
                'appointment_slot_id' => $slot->id,
                'full_name' => $data->fullName,
                'email' => $data->email,
                'phone' => $data->phone,
                'status' => 'pending',
            ]);

            $session = $this->stripeCheckoutService->createSession($booking, $slot);

            $booking->stripe_checkout_session_id = $session->id;
            $booking->save();

            return [
                'booking' => $booking,
                'checkout_url' => $session->url,
            ];
        });
    }

    /**
     * Confirm payment and mark slot booked. Safe to call multiple times (webhook + success page).
     */
    public function fulfillCheckout(string $sessionId): ?Booking
    {
        $booking = Booking::query()
            ->where('stripe_checkout_session_id', $sessionId)
            ->first();

        if ($booking && $booking->status === 'paid') {
            $booking = $booking->load('slot');
            $this->bookingConfirmationService->sendIfNeeded($booking);

            return $booking;
        }

        $session = $this->stripeCheckoutService->retrieveSession($sessionId);

        if (! in_array($session->payment_status, ['paid', 'no_payment_required'], true)) {
            return null;
        }

        $bookingId = (int) ($session->metadata['booking_id'] ?? $session->client_reference_id ?? 0);

        if (! $booking && $bookingId > 0) {
            $booking = Booking::query()->find($bookingId);
        }

        if (! $booking) {
            return null;
        }

        return DB::transaction(function () use ($booking, $session): Booking {
            $booking = Booking::query()
                ->whereKey($booking->id)
                ->lockForUpdate()
                ->first();

            if ($booking->status === 'paid') {
                $booking = $booking->load('slot');
                $this->bookingConfirmationService->sendIfNeeded($booking);

                return $booking;
            }

            $slot = AppointmentSlot::query()
                ->whereKey($booking->appointment_slot_id)
                ->lockForUpdate()
                ->first();

            if (! $slot) {
                abort(404, 'Slot not found.');
            }

            if ($slot->is_booked && $booking->status !== 'paid') {
                $paidByOther = Booking::query()
                    ->where('appointment_slot_id', $slot->id)
                    ->where('status', 'paid')
                    ->where('id', '!=', $booking->id)
                    ->exists();

                if ($paidByOther) {
                    $booking->status = 'failed';
                    $booking->save();

                    return $booking->load('slot');
                }
            }

            $slot->is_booked = true;
            $slot->save();

            $booking->status = 'paid';
            $booking->stripe_payment_intent_id = is_string($session->payment_intent)
                ? $session->payment_intent
                : $session->payment_intent?->id;
            $booking->paid_at = now();
            $booking->save();

            $booking = $booking->load('slot');
            $this->bookingConfirmationService->sendIfNeeded($booking);

            return $booking;
        });
    }

    public function markCancelledBySession(string $sessionId): void
    {
        Booking::query()
            ->where('stripe_checkout_session_id', $sessionId)
            ->where('status', 'pending')
            ->update(['status' => 'cancelled']);
    }

    private function slotHasActivePendingBooking(int $slotId): bool
    {
        $minutes = config('stripe.pending_minutes', 30);

        return Booking::query()
            ->where('appointment_slot_id', $slotId)
            ->where('status', 'pending')
            ->where('created_at', '>=', now()->subMinutes($minutes))
            ->exists();
    }
}
