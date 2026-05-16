<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ContactStoreRequest;
use App\Services\ContactService;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function __construct(private readonly ContactService $contactService)
    {
    }

    public function store(ContactStoreRequest $request): JsonResponse
    {
        $dto = \App\DTO\ContactMessageData::fromValidated($request->validated());
        $message = $this->contactService->store($dto);

        return response()->json([
            'data' => [
                'id' => $message->id,
                'status' => $message->status,
            ],
        ], 201);
    }
}
