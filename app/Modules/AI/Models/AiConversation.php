<?php

namespace App\Modules\AI\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class AiConversation extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    protected $fillable = ['source_type', 'source_id', 'role', 'message'];

    public function source()
    {
        return $this->morphTo();
    }
}
