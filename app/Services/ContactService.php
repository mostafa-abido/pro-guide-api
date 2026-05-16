<?php

namespace App\Services;

use App\DTO\ContactMessageData;
use App\Models\ContactMessage;

final class ContactService
{
    public function store(ContactMessageData $data): ContactMessage
    {
        return ContactMessage::query()->create($data->toCreateArray());
    }
}

