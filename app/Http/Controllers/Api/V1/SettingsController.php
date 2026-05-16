<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UpsertSettingsRequest;
use App\Http\Resources\Api\SettingsResource;
use App\Services\SettingsService;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    public function __construct(private readonly SettingsService $settingsService)
    {
    }

    public function show(): JsonResponse
    {
        $setting = $this->settingsService->get();

        return response()->json([
            'data' => $setting ? SettingsResource::make($setting) : null,
        ]);
    }

    public function upsert(UpsertSettingsRequest $request): JsonResponse
    {
        $dto = \App\DTO\UpsertSettingsData::fromValidated($request->validated());
        $setting = $this->settingsService->upsert($dto);

        return response()->json([
            'data' => SettingsResource::make($setting),
        ]);
    }
}
