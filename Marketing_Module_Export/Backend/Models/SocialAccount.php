<?php

namespace App\Modules\Marketing\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class SocialAccount extends Model
{
    use HandlesTrash;
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'workspace_tenancy_id', 'platform', 'handle',
        'access_token_encrypted', 'connected_by', 'status',
    ];

    protected $casts = [
        'access_token_encrypted' => 'encrypted',
    ];

    public function connectedBy()
    {
        return $this->belongsTo(User::class, 'connected_by');
    }

    public function assignedUsers()
    {
        return $this->belongsToMany(User::class, 'account_assignments')
            ->withPivot('role_on_account')
            ->withTimestamps();
    }

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'post_accounts');
    }
}
