<?php

namespace App\Http\Resources\Api;

use App\Models\AppointmentSlot;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin AppointmentSlot
 */
final class AppointmentSlotResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date?->format('Y-m-d'),
            'time' => substr((string) $this->time, 0, 5),
            'duration_minutes' => $this->duration_minutes,
            'price' => [
                'amount' => $this->price_cents / 100,
                'currency' => $this->currency,
            ],
            'is_booked' => $this->is_booked,
        ];
    }
}

