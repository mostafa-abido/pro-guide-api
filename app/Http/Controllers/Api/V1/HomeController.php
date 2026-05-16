<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\HomeSectionResource;
use App\Services\HomeService;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function __construct(private readonly HomeService $homeService)
    {
    }

    public function show(): JsonResponse
    {
        $sections = $this->homeService->listPublished();

        return response()->json([
            'data' => HomeSectionResource::collection($sections),
        ]);
    }
}
