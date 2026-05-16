<?php

namespace App\Services;

use App\Models\Stat;
use Illuminate\Database\Eloquent\Collection;

final class StatsService
{
    /**
     * @return Collection<int, Stat>
     */
    public function listPublished(): Collection
    {
        return Stat::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();
    }
}

