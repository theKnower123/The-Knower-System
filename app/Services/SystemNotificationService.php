<?php

namespace App\Services;

use App\Modules\Auth\Models\User;
use Illuminate\Support\Facades\DB;

class SystemNotificationService
{
    /**
     * Send a notification to specific user or group of users.
     */
    public static function notify(
        array|int|User $targetUsers,
        string $title,
        string $message,
        string $category = 'system', // clients, projects, leads, support, developer, security, system
        ?string $actionUrl = null,
        array $extraData = []
    ): void {
        try {
            $userIds = [];

            if ($targetUsers instanceof User) {
                $userIds = [$targetUsers->id];
            } elseif (is_int($targetUsers)) {
                $userIds = [$targetUsers];
            } elseif (is_array($targetUsers)) {
                foreach ($targetUsers as $u) {
                    if ($u instanceof User) {
                        $userIds[] = $u->id;
                    } elseif (is_numeric($u)) {
                        $userIds[] = (int) $u;
                    }
                }
            }

            $userIds = array_values(array_unique($userIds));

            foreach ($userIds as $uid) {
                DB::table('notifications')->insert([
                    'id'              => (string) \Illuminate\Support\Str::uuid(),
                    'type'            => 'App\\Notifications\\GenericSystemNotification',
                    'notifiable_type' => 'App\\Modules\\Auth\\Models\\User',
                    'notifiable_id'   => $uid,
                    'data'            => json_encode([
                        'title'      => $title,
                        'message'    => $message,
                        'category'   => $category,
                        'action_url' => $actionUrl,
                        'extra'      => $extraData,
                        'created_at' => now()->toDateTimeString(),
                    ]),
                    'read_at'         => null,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ]);
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('SystemNotificationService Error: ' . $e->getMessage());
        }
    }

    /**
     * Send notification to all Super Admins.
     */
    public static function notifySuperAdmins(
        string $title,
        string $message,
        string $category = 'system',
        ?string $actionUrl = null,
        array $extraData = []
    ): void {
        $adminIds = User::whereIn('role', ['super_admin', 'admin', 'Super Admin'])
            ->pluck('id')
            ->toArray();

        if (!empty($adminIds)) {
            self::notify($adminIds, $title, $message, $category, $actionUrl, $extraData);
        }
    }

    /**
     * Notify specific module stakeholders.
     */
    public static function notifyModule(
        string $module,
        string $title,
        string $message,
        ?string $actionUrl = null,
        array $extraData = []
    ): void {
        self::notifySuperAdmins($title, $message, $module, $actionUrl, $extraData);
    }
}
