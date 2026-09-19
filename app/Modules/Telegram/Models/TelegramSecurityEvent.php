<?php

namespace App\Modules\Telegram\Models;

use Illuminate\Database\Eloquent\Model;

class TelegramSecurityEvent extends Model
{
    protected $table = 'telegram_security_events';

    protected $fillable = [
        'event_type',
        'email',
        'role',
        'status',
        'ip_address',
        'details',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'array',
        ];
    }
}
