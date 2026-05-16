<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Collection;

final class HomepageService
{
    public function __construct(
        private readonly SettingsService $settingsService,
        private readonly HomeService $homeService,
        private readonly StatsService $statsService,
    ) {
    }

    /**
     * @return array{settings: ?Setting, sections: \Illuminate\Database\Eloquent\Collection<int, \App\Models\HomeSection>, stats: \Illuminate\Database\Eloquent\Collection<int, \App\Models\Stat>}
     */
    public function get(): array
    {
        return [
            'settings' => $this->settingsService->get(),
            'sections' => $this->homeService->listPublished(),
            'stats' => $this->statsService->listPublished(),
        ];
    }
}

