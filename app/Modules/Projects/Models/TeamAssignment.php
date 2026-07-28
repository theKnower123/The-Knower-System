<?php

namespace App\Modules\Projects\Models;

use App\Modules\Auth\Models\User;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class TeamAssignment extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    protected $fillable = ['project_id', 'user_id', 'role_in_project'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
