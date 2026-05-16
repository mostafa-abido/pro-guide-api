<?php

namespace App\Filament\Resources\AppointmentSlots\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TimePicker;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class AppointmentSlotForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                DatePicker::make('date')
                    ->required(),
                TimePicker::make('time')
                    ->required(),
                TextInput::make('duration_minutes')
                    ->required()
                    ->numeric()
                    ->default(30),
                TextInput::make('price_cents')
                    ->required()
                    ->numeric()
                    ->default(3000),
                TextInput::make('currency')
                    ->required()
                    ->default('EUR'),
                Toggle::make('is_booked')
                    ->required(),
            ]);
    }
}
