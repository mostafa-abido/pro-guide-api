<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $fillable = [
        'appointment_slot_id',
        'full_name',
        'email',
        'phone',
        'status',
        'stripe_checkout_session_id',
        'stripe_payment_intent_id',
        'paid_at',
        'google_meet_url',
        'google_calendar_event_id',
        'confirmation_email_sent_at',
    ];

    protected function casts(): array
    {
        return [
            'paid_at' => 'datetime',
            'confirmation_email_sent_at' => 'datetime',
        ];
    }

    public function slot(): BelongsTo
    {
        return $this->belongsTo(AppointmentSlot::class, 'appointment_slot_id');
    }
}
