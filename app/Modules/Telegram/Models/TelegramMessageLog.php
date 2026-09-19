<?php

namespace App\Modules\Telegram\Models;

use App\Modules\Auth\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TelegramMessageLog extends Model
{
    protected $table = 'telegram_message_logs';

    protected $fillable = [
        'user_id',
        'chat_id',
        'type',
        'status',
        'preview_text',
        'error_message',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
