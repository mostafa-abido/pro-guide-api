<?php

namespace App\Services;

use App\DTO\ServiceIndexData;
use App\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ServicesService
{
    public function paginate(ServiceIndexData $data): LengthAwarePaginator
    {
        $query = Service::query()
            ->orderBy('sort_order')
            ->orderByDesc('id');

        if ($data->publishedOnly) {
            $query->where('is_published', true);
        }

        return $query->paginate(perPage: $data->perPage);
    }

    public function findPublishedBySlug(string $slug): ?Service
    {
        return Service::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->first();
    }
}

