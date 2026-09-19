<?php

namespace App\Modules\Telegram\Models;

use App\Modules\Auth\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TelegramTemplate extends Model
{
    protected $table = 'telegram_templates';

    protected $fillable = [
        'key',
        'label',
        'category',
        'body_en',
        'body_ar',
        'available_variables',
        'is_default_restored',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'available_variables' => 'array',
            'is_default_restored' => 'boolean',
        ];
    }

    public function updatedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
