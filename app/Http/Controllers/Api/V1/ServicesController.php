<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ServiceIndexRequest;
use App\Http\Requests\Api\ServiceShowRequest;
use App\Http\Resources\Api\ServiceResource;
use App\Services\ServicesService;
use Illuminate\Http\JsonResponse;

class ServicesController extends Controller
{
    public function __construct(private readonly ServicesService $servicesService)
    {
    }

    public function index(ServiceIndexRequest $request): JsonResponse
    {
        $dto = \App\DTO\ServiceIndexData::fromValidated($request->validated());
        $paginator = $this->servicesService->paginate($dto);

        return response()->json([
            'data' => ServiceResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    public function show(ServiceShowRequest $request, string $slug): JsonResponse
    {
        $service = $this->servicesService->findPublishedBySlug($slug);

        if (! $service) {
            return response()->json(['message' => 'Service not found.'], 404);
        }

        return response()->json([
            'data' => ServiceResource::make($service),
        ]);
    }
}
