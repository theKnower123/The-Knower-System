<?php

namespace App\Services;

use App\Modules\Auth\Models\UserActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class UserActivityLogger
{
    /**
     * Log a high-value, meaningful audit activity.
     *
     * @param int|string $userId The target user associated with this activity history
     * @param string $action Human readable action name (e.g. "Edited Client Profile")
     * @param string $category e.g. "security", "auth", "profile", "crud", "file", "admin"
     * @param string|null $targetEntity e.g. "Client #1024", "Invoice #801", "User Account #2"
     * @param string|null $description Detailed context
     * @param string|null $module Associated system module (e.g. "Users", "CRM", "Projects", "Finance", "Auth")
     * @param string|null $actionType Action classification (e.g. "create", "edit", "delete", "upload", "login", "freeze")
     * @param array|null $properties Data diff array e.g. ['before' => [...], 'after' => [...]]
     * @param int|string|null $causerUserId Who initiated the action
     * @param string|null $causerName Name of the actor
     * @param string|null $causerRole Role of the actor at time of action
     */
    public static function log(
        int|string $userId,
        string $action,
        string $category = 'general',
        ?string $targetEntity = null,
        ?string $description = null,
        ?string $module = null,
        ?string $actionType = null,
        ?array $properties = null,
        int|string|null $causerUserId = null,
        ?string $causerName = null,
        ?string $causerRole = null
    ): ?UserActivityLog {
        try {
            $currentUser = Auth::user();

            $causer = $causerUserId ?? ($currentUser ? $currentUser->id : null);
            $actorName = $causerName ?? ($currentUser ? $currentUser->name : 'System Administrator');
            $actorRole = $causerRole ?? ($currentUser ? ($currentUser->role ?? 'user') : 'system');

            $logEntry = UserActivityLog::create([
                'user_id'       => $userId,
                'causer_id'     => $causer,
                'causer_name'   => $actorName,
                'causer_role'   => $actorRole,
                'action'        => $action,
                'category'      => $category,
                'module'        => $module ?? 'Auth',
                'action_type'   => $actionType ?? 'general',
                'target_entity' => $targetEntity,
                'description'   => $description,
                'properties'    => $properties,
                'ip_address'    => Request::ip(),
                'user_agent'    => Request::userAgent(),
            ]);

            // Automatically dispatch notification to affected user or Super Admins
            $notificationCategory = strtolower($module ?? $category);
            $actionUrl = match(strtolower($module ?? '')) {
                'crm', 'clients' => '/crm/clients',
                'leads' => '/crm/leads',
                'projects' => '/projects',
                'support', 'tickets' => '/support/inbox',
                'users' => '/admin/users',
                default => '/notifications',
            };

            // Notify target user if different from actor
            if ($userId && $userId != $causer) {
                SystemNotificationService::notify(
                    (int)$userId,
                    $action,
                    $description ?: "{$actorName} performed {$action} on {$targetEntity}.",
                    $notificationCategory,
                    $actionUrl
                );
            }

            // Also notify super admins for high-value admin/security actions
            if (in_array(strtolower($category), ['security', 'admin', 'freeze', 'delete', 'auth'])) {
                SystemNotificationService::notifySuperAdmins(
                    "Security Event: {$action}",
                    "{$actorName} ({$actorRole}): " . ($description ?: $action),
                    'security',
                    '/notifications'
                );
            }

            return $logEntry;
        } catch (\Exception $e) {
            // Silently catch exceptions so logging never breaks primary database operations
            \Log::error('UserActivityLogger Exception: ' . $e->getMessage());
            return null;
        }
    }
}
