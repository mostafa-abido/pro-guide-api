<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\BookingStoreRequest;
use App\Services\BookingsService;
use Illuminate\Http\JsonResponse;

class BookingsController extends Controller
{
    public function __construct(private readonly BookingsService $bookingsService)
    {
    }

    public function store(BookingStoreRequest $request): JsonResponse
    {
        $dto = \App\DTO\BookingData::fromValidated($request->validated());
        $booking = $this->bookingsService->book($dto);

        return response()->json([
            'data' => [
                'id' => $booking->id,
                'status' => $booking->status,
            ],
        ], 201);
    }
}
