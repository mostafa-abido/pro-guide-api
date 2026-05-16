<?php

namespace App\Filament\Resources\Settings\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class SettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('site_name'),
                FileUpload::make('logo_path')
                    ->image()
                    ->disk('public')
                    ->directory('settings')
                    ->visibility('public'),
                TextInput::make('contact_email')
                    ->email(),
                TextInput::make('contact_phone')
                    ->tel(),
                TextInput::make('contact_whatsapp'),
                KeyValue::make('social_links')
                    ->columnSpanFull()
                    ->addButtonLabel('Add link')
                    ->keyLabel('Platform')
                    ->valueLabel('URL'),
                Textarea::make('footer_text')
                    ->columnSpanFull(),
            ]);
    }
}
