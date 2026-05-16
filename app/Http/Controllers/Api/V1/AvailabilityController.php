<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AvailabilityIndexRequest;
use App\Http\Resources\Api\AppointmentSlotResource;
use App\Services\AvailabilityService;
use Illuminate\Http\JsonResponse;

class AvailabilityController extends Controller
{
    public function __construct(private readonly AvailabilityService $availabilityService)
    {
    }

    public function index(AvailabilityIndexRequest $request): JsonResponse
    {
        $dto = \App\DTO\AvailabilityIndexData::fromValidated($request->validated());
        $slots = $this->availabilityService->listByDate($dto);

        return response()->json([
            'data' => AppointmentSlotResource::collection($slots),
        ]);
    }
}
