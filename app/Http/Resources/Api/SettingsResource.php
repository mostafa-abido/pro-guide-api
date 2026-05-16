<?php

namespace App\Http\Resources\Api;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Setting
 */
final class SettingsResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'site_name' => $this->site_name,
            'logo_url' => $this->logo_path ? url('storage/'.$this->logo_path) : null,
            'contact' => [
                'email' => $this->contact_email,
                'phone' => $this->contact_phone,
                'whatsapp' => $this->contact_whatsapp,
            ],
            'social_links' => $this->social_links ?? [],
            'footer_text' => $this->footer_text,
        ];
    }
}

