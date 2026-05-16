<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Service extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'image_path',
        'excerpt',
        'content',
        'features',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'is_published' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (self $service): void {
            if (! $service->slug && $service->title) {
                $service->slug = Str::slug($service->title);
            }
        });
    }
}
