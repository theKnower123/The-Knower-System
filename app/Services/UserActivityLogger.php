<?php

namespace App\Services;

use App\Modules\Auth\Models\UserActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class UserActivityLogger
{
    /** Personal security events — notify the account owner only, never admins. */
    private const PERSONAL_SECURITY_ACTIONS = [
        'Successful Login',
        'Failed Login Attempt',
        'Changed Account Password',
    ];

    private const PERSONAL_SECURITY_TEMPLATE_MAP = [
        'Successful Login' => 'login_success',
        'Failed Login Attempt' => 'login_failed',
        'Changed Account Password' => 'password_changed',
    ];

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
            $resolvedActionType = $actionType ?? 'general';
            $resolvedModule = $module ?? 'Auth';

            $logEntry = UserActivityLog::create([
                'user_id'       => $userId,
                'causer_id'     => $causer,
                'causer_name'   => $actorName,
                'causer_role'   => $actorRole,
                'action'        => $action,
                'category'      => $category,
                'module'        => $resolvedModule,
                'action_type'   => $resolvedActionType,
                'target_entity' => $targetEntity,
                'description'   => $description,
                'properties'    => $properties,
                'ip_address'    => Request::ip(),
                'user_agent'    => Request::userAgent(),
            ]);

            $notificationCategory = strtolower($resolvedModule ?: $category);
            $actionUrl = match (strtolower($resolvedModule)) {
                'crm', 'clients' => '/crm/clients',
                'leads' => '/crm/leads',
                'projects' => '/projects',
                'support', 'tickets' => '/support/inbox',
                'users' => '/admin/users',
                default => '/notifications',
            };

            $message = $description ?: "{$actorName} performed {$action}" . ($targetEntity ? " on {$targetEntity}" : '') . '.';
            $isPersonalSecurity = self::isPersonalSecurityEvent($action, $resolvedActionType);
            $isSystemMutation = self::isSystemMutation($resolvedActionType, $resolvedModule);
            $isAdminWorthyCategory = in_array(strtolower($category), ['admin', 'freeze', 'delete'], true);

            // Personal security (login / password): account owner only — never admins
            if ($isPersonalSecurity && $userId) {
                $templateKey = self::PERSONAL_SECURITY_TEMPLATE_MAP[$action] ?? 'system_alert';
                SystemNotificationService::notify(
                    (int) $userId,
                    $action,
                    $message,
                    'security',
                    $actionUrl,
                    [
                        'template_key' => $templateKey,
                        'title' => $action,
                        'message' => $message,
                        'timestamp' => now()->format('H:i:s d-m-Y'),
                        'ip_address' => Request::ip(),
                    ]
                );

                return $logEntry;
            }

            // Target user notified when someone else acted on their account/entity
            if ($userId && (int) $userId !== (int) $causer) {
                SystemNotificationService::notify(
                    (int) $userId,
                    $action,
                    $message,
                    $notificationCategory,
                    $actionUrl
                );
            }

            // System create/edit/delete: confirm to the actor
            if ($isSystemMutation && $causer) {
                SystemNotificationService::notify(
                    (int) $causer,
                    $action,
                    $message,
                    $notificationCategory,
                    $actionUrl,
                    [
                        'template_key' => 'activity_confirmation',
                        'title' => $action,
                        'message' => $message,
                        'action' => $action,
                        'target_entity' => $targetEntity ?? '',
                        'timestamp' => now()->format('H:i:s d-m-Y'),
                    ]
                );
            }

            // Admins: system mutations + admin/freeze/delete categories (NOT personal auth/security).
            // Skip create for Projects/Clients — those use dedicated notifyAdmins templates.
            $skipDedicatedCreate = in_array(strtolower($resolvedActionType), ['create'], true)
                && in_array(strtolower($resolvedModule), ['projects', 'clients'], true);

            if (($isAdminWorthyCategory || $isSystemMutation) && !$skipDedicatedCreate) {
                SystemNotificationService::notifySuperAdmins(
                    $action,
                    "{$actorName} ({$actorRole}): " . ($description ?: $action),
                    $isAdminWorthyCategory ? 'security' : $notificationCategory,
                    $actionUrl,
                    [
                        'template_key' => 'system_alert',
                        'title' => $action,
                        'message' => "{$actorName} ({$actorRole}): " . ($description ?: $action),
                        'timestamp' => now()->format('H:i:s d-m-Y'),
                    ]
                );
            }

            return $logEntry;
        } catch (\Exception $e) {
            // Silently catch exceptions so logging never breaks primary database operations
            \Log::error('UserActivityLogger Exception: ' . $e->getMessage());
            return null;
        }
    }

    private static function isPersonalSecurityEvent(string $action, string $actionType): bool
    {
        if (in_array($action, self::PERSONAL_SECURITY_ACTIONS, true)) {
            return true;
        }

        return strtolower($actionType) === 'login';
    }

    private static function isSystemMutation(string $actionType, string $module): bool
    {
        if (!in_array(strtolower($actionType), ['create', 'edit', 'delete'], true)) {
            return false;
        }

        $moduleLower = strtolower($module);

        // Profile/Auth password edits are personal, not system mutations for admin blast
        if (in_array($moduleLower, ['profile', 'auth', ''], true)) {
            return false;
        }

        return true;
    }
}
