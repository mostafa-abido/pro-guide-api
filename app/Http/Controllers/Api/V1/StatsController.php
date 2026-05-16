<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\StatResource;
use App\Services\StatsService;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function __construct(private readonly StatsService $statsService)
    {
    }

    public function index(): JsonResponse
    {
        $stats = $this->statsService->listPublished();

        return response()->json([
            'data' => StatResource::collection($stats),
        ]);
    }
}
