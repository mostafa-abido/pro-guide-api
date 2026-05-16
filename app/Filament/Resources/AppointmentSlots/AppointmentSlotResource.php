<?php

namespace App\Filament\Resources\AppointmentSlots;

use App\Filament\Resources\AppointmentSlots\Pages\CreateAppointmentSlot;
use App\Filament\Resources\AppointmentSlots\Pages\EditAppointmentSlot;
use App\Filament\Resources\AppointmentSlots\Pages\ListAppointmentSlots;
use App\Filament\Resources\AppointmentSlots\Schemas\AppointmentSlotForm;
use App\Filament\Resources\AppointmentSlots\Tables\AppointmentSlotsTable;
use App\Models\AppointmentSlot;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class AppointmentSlotResource extends Resource
{
    protected static ?string $model = AppointmentSlot::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return AppointmentSlotForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AppointmentSlotsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListAppointmentSlots::route('/'),
            'create' => CreateAppointmentSlot::route('/create'),
            'edit' => EditAppointmentSlot::route('/{record}/edit'),
        ];
    }
}
