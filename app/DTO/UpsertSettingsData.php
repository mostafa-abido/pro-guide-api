<?php

namespace App\DTO;

final readonly class UpsertSettingsData
{
    /**
     * @param array<string, string>|null $socialLinks
     */
    public function __construct(
        public ?string $siteName,
        public ?string $logoPath,
        public ?string $contactEmail,
        public ?string $contactPhone,
        public ?string $contactWhatsapp,
        public ?array $socialLinks,
        public ?string $footerText,
    ) {
    }

    /**
     * @param array<string, mixed> $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            siteName: $validated['site_name'] ?? null,
            logoPath: $validated['logo_path'] ?? null,
            contactEmail: $validated['contact_email'] ?? null,
            contactPhone: $validated['contact_phone'] ?? null,
            contactWhatsapp: $validated['contact_whatsapp'] ?? null,
            socialLinks: $validated['social_links'] ?? null,
            footerText: $validated['footer_text'] ?? null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toFillableArray(): array
    {
        return [
            'site_name' => $this->siteName,
            'logo_path' => $this->logoPath,
            'contact_email' => $this->contactEmail,
            'contact_phone' => $this->contactPhone,
            'contact_whatsapp' => $this->contactWhatsapp,
            'social_links' => $this->socialLinks,
            'footer_text' => $this->footerText,
        ];
    }
}

