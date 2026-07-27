<?php

namespace App\Modules\Projects\Models;

use App\Modules\Auth\Models\User;
use Illuminate\Database\Eloquent\Model;

class TeamAssignment extends Model
{
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
