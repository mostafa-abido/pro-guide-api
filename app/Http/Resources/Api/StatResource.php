<?php

namespace App\Http\Resources\Api;

use App\Models\Stat;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Stat
 */
final class StatResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'label' => $this->label,
            'value' => $this->value,
        ];
    }
}

