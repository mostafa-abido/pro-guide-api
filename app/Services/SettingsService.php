<?php

namespace App\Services;

use App\DTO\UpsertSettingsData;
use App\Models\Setting;

final class SettingsService
{
    public function get(): ?Setting
    {
        return Setting::query()->first();
    }

    public function upsert(UpsertSettingsData $data): Setting
    {
        $setting = Setting::query()->first() ?? new Setting();
        $setting->fill($data->toFillableArray());
        $setting->save();

        return $setting;
    }
}

