<?php

namespace App\Http\Resources\Api;

use App\Models\HomeSection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin HomeSection
 */
final class HomeSectionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'key' => $this->key,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'image_url' => $this->image_path ? url('storage/'.$this->image_path) : null,
            'payload' => $this->payload ?? [],
        ];
    }
}

