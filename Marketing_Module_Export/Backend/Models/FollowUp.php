<?php
namespace App\Modules\Marketing\Models;

use App\Modules\CRM\Models\Lead;
use App\Modules\Auth\Models\User;
use Illuminate\Database\Eloquent\Model;

class FollowUp extends Model
{
    protected $fillable = ['lead_id', 'date', 'channel', 'notes', 'next_follow_up_at', 'created_by'];
    protected $casts = ['date' => 'date', 'next_follow_up_at' => 'date'];

    public function lead() { return $this->belongsTo(Lead::class); }
    public function creator() { return $this->belongsTo(User::class, 'created_by'); }
}
