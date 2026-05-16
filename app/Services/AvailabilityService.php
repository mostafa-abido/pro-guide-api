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
        }

        return $query
            ->orderBy('date')
            ->orderBy('time')
            ->get();
    }
}
