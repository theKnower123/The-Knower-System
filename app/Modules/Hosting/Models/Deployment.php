<?php

namespace App\Modules\Hosting\Models;

use App\Modules\Auth\Models\User;
use App\Modules\Projects\Models\Project;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class Deployment extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    protected $fillable = ['project_id', 'server_id', 'version_tag', 'deployed_by', 'notes'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function server()
    {
        return $this->belongsTo(Server::class);
    }

    public function deployedBy()
    {
        return $this->belongsTo(User::class, 'deployed_by');
    }
}
