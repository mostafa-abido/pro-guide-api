<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\BookingCheckoutData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\BookingCheckoutRequest;
use App\Http\Resources\Api\BookingResource;
use App\Services\BookingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingsController extends Controller
{
    public function __construct(private readonly BookingsService $bookingsService)
    {
    }

    public function checkout(BookingCheckoutRequest $request): JsonResponse
    {
        $dto = BookingCheckoutData::fromValidated($request->validated());
        $result = $this->bookingsService->startCheckout($dto);

        return response()->json([
            'data' => [
                'booking_id' => $result['booking']->id,
                'checkout_url' => $result['checkout_url'],
            ],
        ], 201);
    }

    public function success(Request $request): JsonResponse
    {
        $sessionId = $request->query('session_id');

        if (! is_string($sessionId) || $sessionId === '') {
            return response()->json([
                'message' => 'Missing session_id.',
            ], 422);
        }

        $booking = $this->bookingsService->fulfillCheckout($sessionId);

        if (! $booking) {
            return response()->json([
                'message' => 'Payment not completed yet.',
            ], 402);
        }

        return response()->json([
            'data' => new BookingResource($booking),
        ]);
    }
}
