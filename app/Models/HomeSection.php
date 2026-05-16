<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeSection extends Model
{
    protected $fillable = [
        'key',
        'title',
        'subtitle',
        'image_path',
        'payload',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'is_published' => 'boolean',
        ];
    }
}
