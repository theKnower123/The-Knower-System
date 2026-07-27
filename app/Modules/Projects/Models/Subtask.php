<?php

namespace App\Modules\Projects\Models;

use Illuminate\Database\Eloquent\Model;

class Subtask extends Model
{
    protected $fillable = ['task_id', 'title', 'is_done'];

    protected $casts = ['is_done' => 'boolean'];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
