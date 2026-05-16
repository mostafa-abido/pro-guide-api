<?php

namespace App\DTO;

use Carbon\CarbonImmutable;

final readonly class AvailabilityIndexData
{
    public function __construct(public CarbonImmutable $date)
    {
    }

    /**
     * @param array<string, mixed> $validated
     */
    public static function fromValidated(array $validated): self
    {
        /** @var string $date */
        $date = $validated['date'];

        return new self(CarbonImmutable::parse($date)->startOfDay());
    }
}

