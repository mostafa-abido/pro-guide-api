<?php

namespace App\Services;

use App\DTO\AvailabilityIndexData;
use App\Models\AppointmentSlot;
use Illuminate\Database\Eloquent\Collection;

final class AvailabilityService
{
    /**
     * @return Collection<int, AppointmentSlot>
     */
    public function listFromNow(AvailabilityIndexData $data): Collection
    {
        $now = now();
        $today = $now->toDateString();

        $query = AppointmentSlot::query()
            ->where(function ($query) use ($now, $today): void {
                $query->where('date', '>', $today)
                    ->orWhere(function ($query) use ($now, $today): void {
                        $query->where('date', $today)
                            ->whereTime('time', '>=', $now);
                    });
            });

        if (! $data->includeBooked) {
            $query->where('is_booked', false);

            $minutes = config('stripe.pending_minutes', 30);
            $query->whereDoesntHave('bookings', function ($q) use ($minutes): void {
                $q->where('status', 'pending')
                    ->where('created_at', '>=', now()->subMinutes($minutes));
            });
        }

        return $query
            ->orderBy('date')
            ->orderBy('time')
            ->get();
    }
}
