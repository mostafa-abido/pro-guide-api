<?php

namespace App\Http\Resources\Api;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Booking
 */
final class BookingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $slot = $this->slot;

        return [
            'id' => $this->id,
            'status' => $this->status,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'paid_at' => $this->paid_at?->toIso8601String(),
            'google_meet_url' => $this->google_meet_url,
            'slot' => $slot ? [
                'id' => $slot->id,
                'date' => $slot->date?->format('Y-m-d'),
                'time' => substr((string) $slot->time, 0, 5),
                'duration_minutes' => $slot->duration_minutes,
                'price' => [
                    'amount' => $slot->price_cents / 100,
                    'currency' => $slot->currency,
                ],
            ] : null,
        ];
    }
}
