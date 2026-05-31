<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AppointmentSlot extends Model
{
    protected $fillable = [
        'date',
        'time',
        'duration_minutes',
        'price_cents',
        'currency',
        'is_booked',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'is_booked' => 'boolean',
        ];
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function booking(): HasOne
    {
        return $this->hasOne(Booking::class)->latestOfMany();
    }
}
