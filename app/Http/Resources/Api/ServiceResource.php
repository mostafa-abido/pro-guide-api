<?php

namespace App\Http\Resources\Api;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Service
 */
final class ServiceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'image_url' => $this->image_path ? url('storage/'.$this->image_path) : null,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'features' => $this->features ?? [],
        ];
    }
}

