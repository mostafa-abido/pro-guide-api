<?php

namespace App\Filament\Resources\Services\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ServiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('slug')
                    ->helperText('If empty, it will be generated from title.')
                    ->nullable(),
                FileUpload::make('image_path')
                    ->image()
                    ->disk('public')
                    ->directory('services')
                    ->visibility('public'),
                Textarea::make('excerpt')
                    ->columnSpanFull(),
                Textarea::make('content')
                    ->columnSpanFull(),
                Repeater::make('features')
                    ->schema([
                        TextInput::make('text')
                            ->required(),
                    ])
                    ->itemLabel(fn (array $state): ?string => $state['text'] ?? null)
                    ->columnSpanFull()
                    ->default([])
                    ->mutateDehydratedStateUsing(function ($state) {
                        if (! is_array($state)) {
                            return [];
                        }

                        return array_values(array_filter(array_map(
                            fn ($row) => is_array($row) ? ($row['text'] ?? null) : null,
                            $state
                        )));
                    })
                    ->afterStateHydrated(function (Repeater $component, $state): void {
                        if (! is_array($state)) {
                            return;
                        }

                        // Convert stored ["a","b"] into repeater rows.
                        $component->state(array_map(fn ($text) => ['text' => $text], $state));
                    }),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_published')
                    ->required(),
            ]);
    }
}
