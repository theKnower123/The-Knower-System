<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

class TicketMessage extends Model
{
    protected $table = 'ticket_messages';

    protected $fillable = [
        'ticket_id', 'sender_id', 'message', 'attachment',
    ];

    public $timestamps = false; // only custom created_at timestamp in migration

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
