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
    public function listByDate(AvailabilityIndexData $data): Collection
    {
        return AppointmentSlot::query()
            ->whereDate('date', $data->date->toDateString())
            ->orderBy('time')
            ->get();
    }
}

