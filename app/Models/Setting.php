<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'site_name',
        'logo_path',
        'contact_email',
        'contact_phone',
        'contact_whatsapp',
        'social_links',
        'footer_text',
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
        ];
    }
}
