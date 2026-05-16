<?php

namespace App\Services;

use App\Models\HomeSection;
use Illuminate\Database\Eloquent\Collection;

final class HomeService
{
    /**
     * @return Collection<int, HomeSection>
     */
    public function listPublished(): Collection
    {
        return HomeSection::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();
    }
}

