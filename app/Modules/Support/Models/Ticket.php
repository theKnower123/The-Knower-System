<?php

namespace App\Modules\Support\Models;

use App\Modules\CRM\Models\Client;
use App\Modules\Projects\Models\Project;
use App\Modules\Auth\Models\User;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class Ticket extends Model
{
    protected $fillable = [
        'client_id', 'project_id', 'assigned_to', 'subject', 'priority', 'status',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    
}

    public function project()
    {
        return $this->belongsTo(Project::class);
    
}

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    
}

    public function messages()
    {
        return $this->hasMany(TicketMessage::class);
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
