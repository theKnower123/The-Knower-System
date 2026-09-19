<?php

namespace App\Modules\Telegram\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Models\User;
use App\Modules\Telegram\Models\TelegramMessageLog;
use App\Modules\Telegram\Models\TelegramSecurityEvent;
use App\Modules\Telegram\Models\TelegramTemplate;
use App\Modules\Telegram\Services\TelegramService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TelegramController extends Controller
{
    /**
     * Render the main Telegram Server control page
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Platform User Counts & Percentages
        $totalUsers = User::count();
        $linkedUsers = User::whereNotNull('telegram_chat_id')->count();

        // Clients
        $totalClients = User::where('role', 'client')->count();
        $linkedClients = User::where('role', 'client')->whereNotNull('telegram_chat_id')->count();

        // Team (Tech & Delivery)
        $teamRoles = [
            'developer', 'backend_developer', 'frontend_developer', 'full_stack_developer',
            'mobile_developer', 'designer', 'qa', 'project_manager', 'team_leader', 'devops'
        ];
        $totalTeam = User::whereIn('role', $teamRoles)->count();
        $linkedTeam = User::whereIn('role', $teamRoles)->whereNotNull('telegram_chat_id')->count();

        // Management & Operations (Admin, CEO, HR, Finance, Marketing, Support)
        $mgmtRoles = [
            'super_admin', 'administrator', 'admin', 'ceo', 'hr', 'accountant',
            'marketing_admin', 'social_manager', 'ads_specialist', 'content_creator',
            'support', 'support_manager'
        ];
        $totalMgmt = User::whereIn('role', $mgmtRoles)->count();
        $linkedMgmt = User::whereIn('role', $mgmtRoles)->whereNotNull('telegram_chat_id')->count();

        // Live Bot Ping Status
        $pingResult = TelegramService::ping();

        // Tab counts
        $deliveryLogsCount = TelegramMessageLog::count();
        $linkedAccountsCount = $linkedUsers;
        $userTemplatesCount = TelegramTemplate::where('category', 'user')->count();
        $adminTemplatesCount = TelegramTemplate::where('category', 'admin')->count();
        $securityEventsCount = TelegramSecurityEvent::count();

        // Distinct template types for filter
        $templateTypes = TelegramTemplate::pluck('key')->toArray();

        return Inertia::render('Admin/TelegramServer', [
            'bot_status' => [
                'connected' => $pingResult['connected'],
                'latency_ms' => $pingResult['latency_ms'],
                'error' => $pingResult['error'],
                'bot_username' => $pingResult['bot']['username'] ?? TelegramService::getBotUsername() ?? 'Not Configured',
                'bot_name' => $pingResult['bot']['first_name'] ?? 'The Knower Bot',
                'bot_id' => isset($pingResult['bot']['id']) ? (string) $pingResult['bot']['id'] : '---',
                'token_scope' => 'Server-Side Secret',
            ],
            'stats' => [
                'total' => [
                    'linked' => $linkedUsers,
                    'total' => $totalUsers,
                    'percentage' => $totalUsers > 0 ? (int) round(($linkedUsers / $totalUsers) * 100) : 0,
                ],
                'clients' => [
                    'linked' => $linkedClients,
                    'total' => $totalClients,
                    'percentage' => $totalClients > 0 ? (int) round(($linkedClients / $totalClients) * 100) : 0,
                ],
                'team' => [
                    'linked' => $linkedTeam,
                    'total' => $totalTeam,
                    'percentage' => $totalTeam > 0 ? (int) round(($linkedTeam / $totalTeam) * 100) : 0,
                ],
                'management' => [
                    'linked' => $linkedMgmt,
                    'total' => $totalMgmt,
                    'percentage' => $totalMgmt > 0 ? (int) round(($linkedMgmt / $totalMgmt) * 100) : 0,
                ],
            ],
            'counts' => [
                'logs' => $deliveryLogsCount,
                'linked_accounts' => $linkedAccountsCount,
                'templates_user' => $userTemplatesCount,
                'templates_admin' => $adminTemplatesCount,
                'security_events' => $securityEventsCount,
            ],
            'admin_account' => [
                'is_linked' => !empty($user->telegram_chat_id),
                'telegram_username' => $user->telegram_username,
                'telegram_chat_id' => $user->telegram_chat_id,
            ],
            'template_types' => $templateTypes,
        ]);
    }

    /**
     * Live Ping Telegram Bot API
     */
    public function ping(): JsonResponse
    {
        $result = TelegramService::ping();
        return response()->json($result);
    }

    /**
     * Re-register webhook
     */
    public function syncWebhook(Request $request): JsonResponse
    {
        $customUrl = $request->input('url');
        $result = TelegramService::syncWebhook($customUrl);
        return response()->json($result);
    }

    /**
     * Paginated Delivery Logs with filters
     */
    public function logs(Request $request): JsonResponse
    {
        $query = TelegramMessageLog::with('user:id,name,email,avatar,role')
            ->latest('id');

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('chat_id', 'like', "%{$search}%")
                  ->orWhere('preview_text', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $logs = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }

    /**
     * Retry a failed message dispatch
     */
    public function retryLog(int $id): JsonResponse
    {
        $log = TelegramMessageLog::findOrFail($id);
        $result = TelegramService::retryMessage($log);

        return response()->json($result);
    }

    /**
     * Paginated Linked Accounts with filters
     */
    public function linkedAccounts(Request $request): JsonResponse
    {
        $query = User::whereNotNull('telegram_chat_id')
            ->select('id', 'name', 'email', 'avatar', 'role', 'telegram_chat_id', 'telegram_username', 'telegram_linked_at')
            ->latest('telegram_linked_at');

        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('telegram_username', 'like', "%{$search}%")
                  ->orWhere('telegram_chat_id', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Disconnect/Unlink a user's Telegram account
     */
    public function disconnectAccount(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $oldChatId = $user->telegram_chat_id;
        $oldUsername = $user->telegram_username;

        $user->forceFill([
            'telegram_chat_id' => null,
            'telegram_username' => null,
            'telegram_linked_at' => null,
        ])->save();

        TelegramService::logSecurityEvent(
            'account_unlinked',
            $user->email,
            $user->role,
            'success',
            [
                'previous_chat_id' => $oldChatId,
                'previous_username' => $oldUsername,
                'unlinked_by_user_id' => $request->user()->id,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Telegram account disconnected successfully.',
        ]);
    }

    /**
     * Retrieve list of templates with optional category filter
     */
    public function templates(Request $request): JsonResponse
    {
        $query = TelegramTemplate::with('updatedByUser:id,name')->orderBy('label');

        if ($request->filled('category') && in_array($request->category, ['user', 'admin'])) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('label', 'like', "%{$search}%")
                  ->orWhere('key', 'like', "%{$search}%");
            });
        }

        $templates = $query->get();

        return response()->json([
            'success' => true,
            'data' => $templates,
        ]);
    }

    /**
     * Update an existing message template
     */
    public function updateTemplate(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'body_ar' => 'required|string',
            'body_en' => 'nullable|string',
        ]);

        $template = TelegramTemplate::findOrFail($id);
        $template->update([
            'body_ar' => $request->body_ar,
            'body_en' => $request->input('body_en', ''),
            'updated_by' => $request->user()->id,
            'is_default_restored' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Template updated successfully.',
            'data' => $template->load('updatedByUser:id,name'),
        ]);
    }

    /**
     * Restore a template to its seeded default
     */
    public function restoreTemplateDefault(Request $request, int $id): JsonResponse
    {
        $template = TelegramTemplate::findOrFail($id);

        // Re-run the seeder logic specifically for this key
        $seeder = new \Database\Seeders\TelegramTemplateSeeder();
        $seeder->run();

        $restored = TelegramTemplate::with('updatedByUser:id,name')->findOrFail($id);
        $restored->update([
            'is_default_restored' => true,
            'updated_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Template restored to default successfully.',
            'data' => $restored,
        ]);
    }

    /**
     * Dispatch live test notification to the current logged-in admin
     */
    public function sendTestAlert(Request $request): JsonResponse
    {
        $user = $request->user();

        if (empty($user->telegram_chat_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Your personal account does not have a linked Telegram chat. Please link your account first.',
            ], 422);
        }

        $customMessage = $request->input('message');
        $start = microtime(true);

        if (!empty($customMessage)) {
            $res = TelegramService::sendMessage($user->telegram_chat_id, $customMessage);
            $latency = (int) round((microtime(true) - $start) * 1000);

            TelegramMessageLog::create([
                'user_id' => $user->id,
                'chat_id' => $user->telegram_chat_id,
                'type' => 'test_alert',
                'status' => $res['ok'] ? 'sent' : 'failed',
                'preview_text' => $customMessage,
                'error_message' => $res['ok'] ? null : ($res['error'] ?? 'Send failed'),
                'sent_at' => $res['ok'] ? now() : null,
            ]);

            if (!$res['ok']) {
                return response()->json([
                    'success' => false,
                    'message' => $res['error'] ?? 'Failed to send test alert.',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => "Test alert sent successfully in {$latency} ms!",
                'latency_ms' => $latency,
            ]);
        }

        // Use template
        $success = TelegramService::sendTemplateNotification(
            $user,
            'test_notification',
            [
                'user_name' => $user->name,
                'server_time' => now()->toDateTimeString(),
            ]
        );

        $latency = (int) round((microtime(true) - $start) * 1000);

        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to dispatch test notification.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => "Test notification dispatched successfully in {$latency} ms!",
            'latency_ms' => $latency,
        ]);
    }

    /**
     * Security & Password Recovery Audit Log
     */
    public function securityEvents(Request $request): JsonResponse
    {
        $query = TelegramSecurityEvent::latest('id');

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('event_type') && $request->event_type !== 'all') {
            $query->where('event_type', $request->event_type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%")
                  ->orWhere('event_type', 'like', "%{$search}%");
            });
        }

        $events = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }
}
