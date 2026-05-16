<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\HomeSectionResource;
use App\Http\Resources\Api\ServiceResource;
use App\Http\Resources\Api\SettingsResource;
use App\Http\Resources\Api\StatResource;
use App\Services\HomepageService;
use App\Services\ServicesService;
use Illuminate\Http\JsonResponse;

final class HomepageController extends Controller
{
    public function __construct(
        private readonly HomepageService $homepageService,
        private readonly ServicesService $servicesService,
    ) {
    }

    public function show(): JsonResponse
    {
        $data = $this->homepageService->get();

        // Use existing pagination logic but return just the collection.
        $services = $this->servicesService->paginate(new \App\DTO\ServiceIndexData(publishedOnly: true, perPage: 100))->items();

        return response()->json([
            'data' => [
                'settings' => $data['settings'] ? SettingsResource::make($data['settings']) : null,
                'sections' => HomeSectionResource::collection($data['sections']),
                'services' => ServiceResource::collection($services),
                'stats' => StatResource::collection($data['stats']),
            ],
        ]);
    }
}

