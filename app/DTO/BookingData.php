<?php

namespace App\DTO;

use Carbon\CarbonImmutable;

final readonly class BookingData
{
    public function __construct(
        public CarbonImmutable $date,
        public string $time, // HH:MM
        public string $fullName,
        public ?string $email,
        public ?string $phone,
    ) {
    }

    /**
     * @param array<string, mixed> $validated
     */
    public static function fromValidated(array $validated): self
    {
        /** @var string $date */
        $date = $validated['date'];

        return new self(
            date: CarbonImmutable::parse($date)->startOfDay(),
            time: $validated['time'],
            fullName: $validated['full_name'],
            email: $validated['email'] ?? null,
            phone: $validated['phone'] ?? null,
        );
    }
}

