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
        if (!isset($update['message'])) {
            return response()->json(['ok' => true]);
        }

        $msg = $update['message'];
        $chatId = (string) ($msg['chat']['id'] ?? '');
        $text = trim((string) ($msg['text'] ?? ''));
        $from = $msg['from'] ?? [];
        $username = $from['username'] ?? '';
        $firstName = $from['first_name'] ?? 'there';

        if ($chatId === '') {
            return response()->json(['ok' => true]);
        }

        // Already linked to this chat — never re-offer connection flows
        $linkedUser = User::where('telegram_chat_id', $chatId)->first();
        if ($linkedUser) {
            if (str_starts_with($text, '/start')) {
                TelegramService::sendMessage(
                    $chatId,
                    "✅ *Already connected*\n\nHi *{$firstName}*! This Telegram account is already linked to *{$linkedUser->email}* on *The Knower OS*.\n\nYou will receive notifications here automatically."
                );
            } else {
                TelegramService::sendMessage(
                    $chatId,
                    "✅ Your Telegram is linked to *The Knower OS*.\n\nYour Chat ID: `{$chatId}`"
                );
            }

            return response()->json(['ok' => true]);
        }

        // /start deep-link from website: /start link_{token}
        if (str_starts_with($text, '/start')) {
            $parts = explode(' ', $text, 2);
            $param = isset($parts[1]) ? trim($parts[1]) : null;

            if ($param && str_starts_with($param, 'link_')) {
                $token = substr($param, 5);
                $pendingUserId = Cache::get('tg_link_' . $token);

                if (!$pendingUserId) {
                    TelegramService::sendMessage(
                        $chatId,
                        "⏳ *Link expired*\n\nThis connection link is invalid or has expired.\n\nPlease open *Connect Telegram* again from your profile on the website, then press Start.\n\nYour Chat ID (for manual link): `{$chatId}`"
                    );

                    return response()->json(['ok' => true]);
                }

                /** @var User|null $user */
                $user = User::find($pendingUserId);

                if (!$user) {
                    Cache::forget('tg_link_' . $token);
                    TelegramService::sendMessage(
                        $chatId,
                        "⚠️ *Link failed*\n\nThe user account for this link no longer exists.\n\nPlease generate a new link from the website.\n\nYour Chat ID: `{$chatId}`"
                    );

                    return response()->json(['ok' => true]);
                }

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

                if (!empty($user->telegram_chat_id) && $user->telegram_chat_id !== $chatId) {
                    TelegramService::sendMessage(
                        $chatId,
                        "⚠️ *Connection Blocked*\n\nYour user account ({$user->email}) is already linked to another Telegram chat. Disconnect it from the website first."
                    );

                    return response()->json(['ok' => true]);
                }

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
                    ['chat_id' => $chatId, 'username' => $username, 'method' => 'deep_link']
                );

                return response()->json(['ok' => true]);
            }

            // Plain /start without website token — Chat ID only, no account linking
            $appUrl = rtrim((string) config('app.url'), '/');
            TelegramService::sendMessage(
                $chatId,
                "👋 Hello *{$firstName}*!\n\nYour Telegram Chat ID is:\n`{$chatId}`\n\nTo link this account to *The Knower OS*, open your profile on the website ({$appUrl}) and use *Connect Telegram* (one-click or paste this Chat ID).\n\nStarting the bot here alone does *not* connect any account."
            );

            return response()->json(['ok' => true]);
        }

        // Any other message — reply with Chat ID for manual linking
        if ($text !== '') {
            TelegramService::sendMessage(
                $chatId,
                "Your Telegram Chat ID is:\n`{$chatId}`\n\nCopy it and paste it under *Connect Telegram → manual Chat ID* on the website.\n\nOr use *One-Click Instant Link* from your profile for automatic linking."
            );
        }

        return response()->json(['ok' => true]);
    }
}
