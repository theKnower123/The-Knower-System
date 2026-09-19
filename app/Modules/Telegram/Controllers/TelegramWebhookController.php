<?php

namespace App\Modules\Telegram\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Models\User;
use App\Modules\Telegram\Services\TelegramService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TelegramWebhookController extends Controller
{
    /**
     * Handle incoming webhook updates from Telegram Bot API
     */
    public function handle(Request $request): JsonResponse
    {
        return $this->processUpdate($request->all());
    }

    /**
     * Process a raw Telegram update payload (used by both webhook and polling daemon)
     */
    public function processUpdate(array $update): JsonResponse
    {
        // Check for message update
        if (isset($update['message'])) {
            $msg = $update['message'];
            $chatId = (string) ($msg['chat']['id'] ?? '');
            $text = trim((string) ($msg['text'] ?? ''));
            $from = $msg['from'] ?? [];
            $username = $from['username'] ?? '';
            $firstName = $from['first_name'] ?? 'there';

            // Check if /start command
            if (str_starts_with($text, '/start')) {
                // Check if deep link parameter exists: e.g. /start link_{token}
                $parts = explode(' ', $text);
                $param = $parts[1] ?? null;

                if ($param && str_starts_with($param, 'link_')) {
                    $token = substr($param, 5);
                    $pendingUserId = Cache::get('tg_link_' . $token);

                    if ($pendingUserId) {
                        /** @var User|null $user */
                        $user = User::find($pendingUserId);

                        if ($user) {
                            // Check if chat_id already linked to another account
                            $existing = User::where('telegram_chat_id', $chatId)
                                ->where('id', '!=', $user->id)
                                ->first();

                            if ($existing) {
                                TelegramService::sendMessage(
                                    $chatId,
                                    "⚠️ *Connection Blocked*\n\nThis Telegram account is already associated with another user on *The Knower OS*."
                                );
                                TelegramService::logSecurityEvent(
                                    'link_blocked',
                                    $user->email,
                                    $user->role,
                                    'blocked',
                                    ['reason' => 'Chat ID already linked to another user', 'chat_id' => $chatId]
                                );
                                return response()->json(['ok' => true]);
                            }

                            // Check if user has a different linked chat_id
                            if (!empty($user->telegram_chat_id) && $user->telegram_chat_id !== $chatId) {
                                TelegramService::sendMessage(
                                    $chatId,
                                    "⚠️ *Connection Blocked*\n\nYour user account ({$user->email}) is already linked to another Telegram chat."
                                );
                                return response()->json(['ok' => true]);
                            }

                            // Perform link
                            $user->forceFill([
                                'telegram_chat_id' => $chatId,
                                'telegram_username' => $username ?: null,
                                'telegram_linked_at' => now(),
                            ])->save();

                            Cache::forget('tg_link_' . $token);

                            TelegramService::sendTemplateNotification(
                                $user,
                                'account_linked',
                                [
                                    'user_name' => $user->name,
                                    'platform_name' => 'The Knower OS',
                                ]
                            );

                            TelegramService::logSecurityEvent(
                                'account_linked',
                                $user->email,
                                $user->role,
                                'success',
                                ['chat_id' => $chatId, 'username' => $username]
                            );

                            return response()->json(['ok' => true]);
                        }
                    }
                }

                // Default /start flow: generate cryptographically signed link for web connection
                $sig = hash_hmac('sha256', $chatId . '|' . $username, config('app.key'));
                $appUrl = rtrim(config('app.url'), '/');
                $connectUrl = "{$appUrl}/telegram/connect?chat_id={$chatId}&username=" . urlencode($username) . "&sig={$sig}";

                $replyText = "👋 Hello *{$firstName}*!\n\nYour connection link is ready. Tap the button below to connect your Telegram account to *The Knower OS*.";

                $keyboard = [
                    'inline_keyboard' => [
                        [
                            [
                                'text' => '🔗 Connect Account',
                                'url' => $connectUrl,
                            ],
                        ],
                    ],
                ];

                TelegramService::sendMessage($chatId, $replyText, $keyboard);
            }
        }

        return response()->json(['ok' => true]);
    }
}
