<?php

namespace App\Services;

use App\DTO\BookingData;
use App\Models\AppointmentSlot;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;
use Throwable;

final class BookingsService
{
    /**
     * Books an existing slot if available.
     *
     * @throws Throwable
     */
    public function book(BookingData $data): Booking
    {
        return DB::transaction(function () use ($data): Booking {
            $slot = AppointmentSlot::query()
                ->whereDate('date', $data->date->toDateString())
                ->where('time', $data->time)
                ->lockForUpdate()
                ->first();

            if (! $slot) {
                abort(404, 'Slot not found.');
            }

            if ($slot->is_booked) {
                abort(422, 'Slot already booked.');
            }

            $slot->is_booked = true;
            $slot->save();

            return Booking::query()->create([
                'appointment_slot_id' => $slot->id,
                'full_name' => $data->fullName,
                'email' => $data->email,
                'phone' => $data->phone,
                'status' => 'confirmed',
            ]);
        });
    }
}

