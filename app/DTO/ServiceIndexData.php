<?php

namespace App\DTO;

final readonly class ServiceIndexData
{
    public function __construct(
        public bool $publishedOnly,
        public int $perPage,
    ) {
    }

    /**
     * @param array<string, mixed> $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            publishedOnly: (bool) ($validated['published_only'] ?? true),
            perPage: (int) ($validated['per_page'] ?? 50),
        );
    }
}

