<?php

namespace App\Modules\Projects\Models;

use App\Modules\Auth\Models\User;

use Illuminate\Database\Eloquent\Model;

class TaskComment extends Model
{
    protected $table = 'task_comments';

    protected $fillable = [
        'task_id', 'user_id', 'comment',
    ];

    public $timestamps = false; // matching migration (only created_at timestamp)

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
