<?php

namespace App\DTO;

final readonly class BookingCheckoutData
{
    public function __construct(
        public int $appointmentSlotId,
        public string $fullName,
        public string $email,
        public ?string $phone,
    ) {
    }

    /**
     * @param array<string, mixed> $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            appointmentSlotId: (int) $validated['appointment_slot_id'],
            fullName: $validated['full_name'],
            email: $validated['email'],
            phone: $validated['phone'] ?? null,
        );
    }
}
