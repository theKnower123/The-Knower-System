<?php

namespace App\Modules\Telegram\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Models\User;
use App\Modules\Telegram\Services\TelegramService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TelegramConnectController extends Controller
{
    /**
     * Show the account connection verification screen
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $chatId = (string) $request->query('chat_id');
        $username = (string) $request->query('username');
        $sig = (string) $request->query('sig');

        // Verify cryptographic signature
        $expectedSig = hash_hmac('sha256', $chatId . '|' . $username, config('app.key'));
        if (!hash_equals($expectedSig, $sig) || empty($chatId)) {
            abort(403, 'Invalid or expired connection link.');
        }

        // Must be authenticated
        if (!Auth::check()) {
            return redirect()->guest('/login');
        }

        /** @var User $user */
        $user = Auth::user();

        // Check if chat_id is already linked to another account
        $existingOwner = User::where('telegram_chat_id', $chatId)
            ->where('id', '!=', $user->id)
            ->first();

        $alreadyLinkedToOther = $existingOwner !== null;
        $currentUserLinkedToOther = !empty($user->telegram_chat_id) && $user->telegram_chat_id !== $chatId;
        $isAlreadyConnected = $user->telegram_chat_id === $chatId;

        return Inertia::render('Telegram/Connect', [
            'chat_id' => $chatId,
            'telegram_username' => $username,
            'sig' => $sig,
            'already_linked_to_other' => $alreadyLinkedToOther,
            'current_user_linked_to_other' => $currentUserLinkedToOther,
            'is_already_connected' => $isAlreadyConnected,
        ]);
    }

    /**
     * Confirm connection and save to user's profile
     */
    public function confirm(Request $request): JsonResponse
    {
        $request->validate([
            'chat_id' => 'required|string',
            'telegram_username' => 'nullable|string',
            'sig' => 'required|string',
        ]);

        $chatId = $request->input('chat_id');
        $username = (string) $request->input('telegram_username');
        $sig = $request->input('sig');

        $expectedSig = hash_hmac('sha256', $chatId . '|' . $username, config('app.key'));
        if (!hash_equals($expectedSig, $sig)) {
            return response()->json(['success' => false, 'message' => 'Invalid signature.'], 403);
        }

        /** @var User $user */
        $user = Auth::user();

        // Check if chat_id is already linked to another user
        $existingOwner = User::where('telegram_chat_id', $chatId)
            ->where('id', '!=', $user->id)
            ->first();

        if ($existingOwner) {
            TelegramService::logSecurityEvent(
                'link_blocked',
                $user->email,
                $user->role,
                'blocked',
                [
                    'reason' => 'Chat ID already linked to another account',
                    'chat_id' => $chatId,
                    'attempted_user_id' => $user->id,
                ]
            );

            return response()->json([
                'success' => false,
                'message' => 'This Telegram account is already linked to another platform account.',
            ], 422);
        }

        // Check if current user is already linked to a different chat_id
        if (!empty($user->telegram_chat_id) && $user->telegram_chat_id !== $chatId) {
            TelegramService::logSecurityEvent(
                'link_blocked',
                $user->email,
                $user->role,
                'blocked',
                [
                    'reason' => 'User already has a different Telegram account linked',
                    'current_chat_id' => $user->telegram_chat_id,
                    'new_chat_id' => $chatId,
                ]
            );

            return response()->json([
                'success' => false,
                'message' => 'Your account is already linked to a different Telegram chat. Please disconnect it first.',
            ], 422);
        }

        // Update user
        $user->forceFill([
            'telegram_chat_id' => $chatId,
            'telegram_username' => $username ?: null,
            'telegram_linked_at' => now(),
        ])->save();

        // Send confirmation via Telegram
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
            [
                'chat_id' => $chatId,
                'username' => $username,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Your Telegram account has been connected successfully.',
        ]);
    }

    /**
     * Generate a one-click deep link token for the profile page
     */
    public function generateLinkToken(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $token = \Illuminate\Support\Str::random(32);

        \Illuminate\Support\Facades\Cache::put('tg_link_' . $token, $user->id, now()->addMinutes(15));

        $rawBotUsername = config('services.telegram.bot_username') ?: env('BOT_USERNAME');
        $cleanBotUsername = ltrim((string) $rawBotUsername, '@');
        $botUrl = $cleanBotUsername ? "https://t.me/{$cleanBotUsername}?start=link_{$token}" : null;

        return response()->json([
            'success' => true,
            'token' => $token,
            'bot_username' => $cleanBotUsername,
            'bot_url' => $botUrl,
        ]);
    }

    /**
     * Link Telegram account directly by Chat ID from Profile
     */
    public function linkByChatId(Request $request): JsonResponse
    {
        $request->validate([
            'chat_id' => ['required', 'string', 'regex:/^-?\d+$/'],
            'telegram_username' => 'nullable|string|max:64',
        ], [
            'chat_id.regex' => 'Chat ID must be a numeric Telegram ID (digits only).',
        ]);

        /** @var User $user */
        $user = Auth::user();
        $chatId = trim($request->input('chat_id'));
        $username = trim((string) $request->input('telegram_username'));
        $username = ltrim($username, '@');

        // Check if current user is already linked to a different chat
        if (!empty($user->telegram_chat_id) && $user->telegram_chat_id !== $chatId) {
            TelegramService::logSecurityEvent(
                'link_blocked',
                $user->email,
                $user->role,
                'blocked',
                [
                    'reason' => 'User already has a different Telegram account linked',
                    'current_chat_id' => $user->telegram_chat_id,
                    'new_chat_id' => $chatId,
                ]
            );

            return response()->json([
                'success' => false,
                'message' => 'Your account is already linked to a different Telegram chat. Please disconnect it first.',
            ], 422);
        }

        // Check if chat_id already linked to another user
        $existingOwner = User::where('telegram_chat_id', $chatId)
            ->where('id', '!=', $user->id)
            ->first();

        if ($existingOwner) {
            TelegramService::logSecurityEvent(
                'link_blocked',
                $user->email,
                $user->role,
                'blocked',
                [
                    'reason' => 'Chat ID already linked to another account',
                    'chat_id' => $chatId,
                ]
            );

            return response()->json([
                'success' => false,
                'message' => 'This Telegram account is already associated with another user on the platform.',
            ], 422);
        }

        $user->forceFill([
            'telegram_chat_id' => $chatId,
            'telegram_username' => $username !== '' ? $username : null,
            'telegram_linked_at' => now(),
        ])->save();

        $sent = TelegramService::sendTemplateNotification(
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
            [
                'chat_id' => $chatId,
                'username' => $username,
                'method' => 'manual_chat_id',
                'confirmation_sent' => $sent,
            ]
        );

        if (!$sent) {
            return response()->json([
                'success' => true,
                'message' => 'Telegram account linked, but the confirmation message could not be sent. Check BOT_TOKEN and that you have started the bot.',
                'confirmation_sent' => false,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Telegram account linked successfully!',
            'confirmation_sent' => true,
        ]);
    }

    /**
     * Disconnect the authenticated user's own Telegram account
     */
    public function disconnect(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
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
                'unlinked_by' => 'self',
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Your Telegram account has been disconnected.',
        ]);
    }

    /**
     * Send a test notification to the user's connected Telegram
     */
    public function test(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        if (empty($user->telegram_chat_id)) {
            return response()->json(['success' => false, 'message' => 'No Telegram account connected.'], 400);
        }

        $sent = TelegramService::sendTemplateNotification(
            $user,
            'connection_test',
            [
                'user_name' => $user->name,
                'platform_name' => 'The Knower OS',
                'timestamp' => now()->format('Y-m-d H:i:s'),
            ]
        );

        if ($sent) {
            return response()->json(['success' => true, 'message' => 'تم إرسال رسالة فحص الاتصال إلى حساب تيليجرام الخاص بك بنجاح!']);
        }

        return response()->json([
            'success' => false,
            'message' => 'تعذر إرسال رسالة الاختبار إلى تيليجرام. يرجى التحقق من حالة الاتصال.',
        ], 500);
    }
}

