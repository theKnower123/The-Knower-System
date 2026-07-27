<?php

namespace App\Modules\AI\Models;

use Illuminate\Database\Eloquent\Model;

class AiConversation extends Model
{
    protected $fillable = ['source_type', 'source_id', 'role', 'message'];

    public function source()
    {
        return $this->morphTo();
    }
}
