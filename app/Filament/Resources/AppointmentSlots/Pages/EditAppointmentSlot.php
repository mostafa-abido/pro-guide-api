<?php

namespace App\Filament\Resources\AppointmentSlots\Pages;

use App\Filament\Resources\AppointmentSlots\AppointmentSlotResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAppointmentSlot extends EditRecord
{
    protected static string $resource = AppointmentSlotResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
