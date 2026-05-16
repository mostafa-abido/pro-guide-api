<?php

namespace App\DTO;

final readonly class AvailabilityIndexData
{
    public function __construct(public bool $includeBooked = false)
    {
    }

    /**
     * @param array<string, mixed> $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            includeBooked: filter_var($validated['include_booked'] ?? false, FILTER_VALIDATE_BOOLEAN),
        );
    }
}
