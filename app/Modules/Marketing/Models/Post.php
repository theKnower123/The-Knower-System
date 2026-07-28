<?php

namespace App\Modules\Marketing\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class Post extends Model
{
    use HandlesTrash;
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'workspace_tenancy_id', 'content', 'media_path', 'status',
        'scheduled_at', 'published_at', 'created_by', 'approved_by',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    public function accounts()
    {
        return $this->belongsToMany(SocialAccount::class, 'post_accounts');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function submitForApproval(): void
    {
        $this->update(['status' => 'pending_approval']);
    }

    public function approve(User $approver): void
    {
        $this->update(['status' => 'scheduled', 'approved_by' => $approver->id]);
    }
}
