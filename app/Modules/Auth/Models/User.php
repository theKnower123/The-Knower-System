<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'avatar',
        'password',
        'role',
        'permissions',
        'status',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at'     => 'datetime',
            'password'          => 'hashed',
            'permissions'       => 'array',
        ];
    }

    // ─── Relationships ─────────────────────────────────────────────────────

    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public function assignedTickets()
    {
        return $this->hasMany(Ticket::class, 'assigned_to');
    }

    public function createdProjects()
    {
        return $this->hasMany(Project::class, 'created_by');
    }

    public function taskComments()
    {
        return $this->hasMany(TaskComment::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(\Spatie\Activitylog\Models\Activity::class, 'causer_id');
    }

    // ─── Helpers ───────────────────────────────────────────────────────────

    public function isOnline(): bool
    {
        return $this->last_login_at
            && $this->last_login_at->diffInMinutes(now()) < 15;
    }

    public function hasRole(string|array $roles): bool
    {
        if (is_string($roles)) {
            return $this->role === $roles;
        }
        return in_array($this->role, $roles);
    }

    public function hasPermissionTo(string $permission): bool
    {
        if ($this->hasRole('super_admin')) {
            return true;
        }
        $perms = $this->permissions ?? [];
        return in_array($permission, $perms);
    }
}
