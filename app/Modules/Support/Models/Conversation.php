<?php

namespace App\Modules\Support\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Auth\Models\User;
use App\Modules\HR\Models\Department;
use App\Modules\Settings\Models\Workspace;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class Conversation extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    protected $guarded = ['id'];

    protected $casts = [
        'sla_due_at' => 'datetime',
        'last_message_at' => 'datetime',
        'unread' => 'boolean',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function assignedAgent()
    {
        return $this->belongsTo(User::class, 'assigned_agent_id');
    }

    public function contact()
    {
        return $this->belongsTo(User::class, 'contact_id');
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
