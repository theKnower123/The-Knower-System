<?php

namespace App\Modules\Projects\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class Subtask extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    protected $fillable = ['task_id', 'title', 'is_done'];

    protected $casts = ['is_done' => 'boolean'];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
