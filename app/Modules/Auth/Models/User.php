<?php

namespace App\Modules\Auth\Models;

use App\Modules\HR\Models\Employee;
use App\Modules\Projects\Models\Task;
use App\Modules\Support\Models\Ticket;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Models\TaskComment;

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

    public function assignedConversations()
    {
        return $this->hasMany(\App\Modules\Support\Models\Conversation::class, 'assigned_agent_id');
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

        $defaultPerms = $this->getAllPermissions();
        $customPerms = $this->permissions ?? [];
        
        $allPerms = array_merge($defaultPerms, $customPerms);
        
        return in_array($permission, $allPerms);
    }

    public function getAllPermissions(): array
    {
        return match ($this->role) {
            'ceo' => [
                "dashboard.view", "crm.view", "client.manage", "project.view", 
                "finance.view", "report.view", "hr.view", "hosting.view", 
                "support.view", "ai.use"
            ],
            'sales' => [
                "dashboard.view", "crm.view", "lead.manage", "client.manage", 
                "quotation.manage", "contract.manage", "ai.use"
            ],
            'project_manager' => [
                "dashboard.view", "crm.view", "project.view", "project.manage", 
                "task.view", "task.manage", "bug.manage", "file.upload", 
                "report.view", "ai.use"
            ],
            'team_leader' => [
                "dashboard.view", "project.view", "task.view", "task.manage", 
                "code.review", "bug.manage", "file.upload", "ai.use"
            ],
            'developer' => [
                "dashboard.view", "project.view", "task.view", "task.update_status", 
                "bug.manage", "file.upload", "ai.use"
            ],
            'designer' => [
                "dashboard.view", "project.view", "task.view", "task.update_status", 
                "design.upload", "file.upload"
            ],
            'qa' => [
                "dashboard.view", "project.view", "task.view", "qa.test", 
                "bug.manage", "file.upload"
            ],
            'accountant' => [
                "dashboard.view", "finance.view", "invoice.manage", "payment.manage", 
                "expense.manage", "report.view"
            ],
            'hr' => [
                "dashboard.view", "hr.view", "hr.manage", "attendance.manage", 
                "leave.manage", "payroll.manage", "report.view"
            ],
            'support' => [
                "dashboard.view", "support.view", "ticket.manage", "ticket.reply", 
                "client.manage", "support.inbox", "support.tickets", "support.canned",
                "support.kb_read"
            ],
            'support_manager' => [
                "dashboard.view", "support.view", "ticket.manage", "ticket.reply",
                "client.manage", "support.inbox", "support.tickets", "support.canned",
                "support.kb_read", "support.manage"
            ],
            'client' => ["client_portal.view"],
            default => []
        };
    }
}
