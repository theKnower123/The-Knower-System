<?php

namespace App\Modules\Telegram\Services;

use App\Modules\Auth\Models\User;
use App\Modules\Telegram\Models\TelegramMessageLog;
use App\Modules\Telegram\Models\TelegramSecurityEvent;
use App\Modules\Telegram\Models\TelegramTemplate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    public static function getToken(): ?string
    {
        return config('services.telegram.bot_token') ?: env('BOT_TOKEN');
    }

    public static function getBotUsername(): ?string
    {
        return config('services.telegram.bot_username') ?: env('BOT_USERNAME');
    }

    /**
     * Ping Telegram Bot API using getMe and return latency + bot info
     */
    public static function ping(): array
    {
        $token = self::getToken();
        if (empty($token)) {
            return [
                'connected' => false,
                'error' => 'BOT_TOKEN is not configured in .env',
                'latency_ms' => null,
                'bot' => null,
            ];
        }

        $start = microtime(true);
        try {
            $response = Http::timeout(6)->get("https://api.telegram.org/bot{$token}/getMe");
            $latency = (int) round((microtime(true) - $start) * 1000);

            if ($response->successful() && $response->json('ok')) {
                return [
                    'connected' => true,
                    'latency_ms' => $latency,
                    'bot' => $response->json('result'),
                    'error' => null,
                ];
            }

            return [
                'connected' => false,
                'latency_ms' => $latency,
                'bot' => null,
                'error' => $response->json('description') ?? 'Telegram Bot API error.',
            ];
        } catch (\Throwable $e) {
            $latency = (int) round((microtime(true) - $start) * 1000);
            return [
                'connected' => false,
                'latency_ms' => $latency,
                'bot' => null,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Sync bot webhook with Telegram
     */
    public static function syncWebhook(?string $url = null): array
    {
        $token = self::getToken();
        if (empty($token)) {
            return [
                'ok' => false,
                'message' => 'BOT_TOKEN is missing.',
            ];
        }

        $webhookUrl = $url ?: (rtrim(config('app.url'), '/') . '/api/v1/telegram/webhook');

        try {
            $response = Http::timeout(8)->post("https://api.telegram.org/bot{$token}/setWebhook", [
                'url' => $webhookUrl,
                'drop_pending_updates' => false,
            ]);

            return [
                'ok' => (bool) $response->json('ok'),
                'webhook_url' => $webhookUrl,
                'message' => $response->json('description') ?? ($response->json('ok') ? 'Webhook registered successfully.' : 'Failed to register webhook.'),
            ];
        } catch (\Throwable $e) {
            return [
                'ok' => false,
                'webhook_url' => $webhookUrl,
                'message' => 'Exception while setting webhook: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Delete any active webhook so long-polling (getUpdates) can receive messages.
     */
    public static function deleteWebhook(): array
    {
        $token = self::getToken();
        if (empty($token)) {
            return [
                'ok' => false,
                'message' => 'BOT_TOKEN is missing.',
            ];
        }

        try {
            $response = Http::timeout(8)->post("https://api.telegram.org/bot{$token}/deleteWebhook", [
                'drop_pending_updates' => false,
            ]);

            return [
                'ok' => (bool) $response->json('ok'),
                'message' => $response->json('description') ?? ($response->json('ok') ? 'Webhook deleted.' : 'Failed to delete webhook.'),
            ];
        } catch (\Throwable $e) {
            return [
                'ok' => false,
                'message' => 'Exception while deleting webhook: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Send direct message via Telegram Bot API
     */
    public static function sendMessage(string $chatId, string $text, ?array $replyMarkup = null): array
    {
        $token = self::getToken();
        if (empty($token)) {
            return [
                'ok' => false,
                'error' => 'BOT_TOKEN is not configured.',
            ];
        }

        $payload = [
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => 'Markdown',
            'disable_web_page_preview' => true,
        ];

        if (!empty($replyMarkup)) {
            $payload['reply_markup'] = json_encode($replyMarkup);
        }

        try {
            $response = Http::timeout(8)->post("https://api.telegram.org/bot{$token}/sendMessage", $payload);

            if ($response->successful() && $response->json('ok')) {
                return [
                    'ok' => true,
                    'result' => $response->json('result'),
                ];
            }

            // Fallback: If Markdown parsing failed, attempt sending as plain text
            if (str_contains(strtolower($response->json('description') ?? ''), 'can\'t parse entities')) {
                unset($payload['parse_mode']);
                $plainRetry = Http::timeout(8)->post("https://api.telegram.org/bot{$token}/sendMessage", $payload);
                if ($plainRetry->successful() && $plainRetry->json('ok')) {
                    return [
                        'ok' => true,
                        'result' => $plainRetry->json('result'),
                    ];
                }
            }

            return [
                'ok' => false,
                'error' => $response->json('description') ?? 'Failed to send message.',
            ];
        } catch (\Throwable $e) {
            Log::error('TelegramService sendMessage exception: ' . $e->getMessage());
            return [
                'ok' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Dispatches a notification using an existing template and logs the audit trail
     */
    public static function sendTemplateNotification(
        User|string $recipient,
        string $templateKey,
        array $variables = [],
        string $locale = 'ar'
    ): bool {
        $user = $recipient instanceof User ? $recipient : null;
        $chatId = $recipient instanceof User ? $recipient->telegram_chat_id : (string) $recipient;

        // Fetch template
        $template = TelegramTemplate::where('key', $templateKey)->first();
        $body = '';

        if ($template) {
            $body = !empty($template->body_ar)
                ? $template->body_ar
                : ($template->body_en ?: '');
        } else {
            // Generic fallback text
            $body = $variables['message'] ?? $variables['title'] ?? ("Alert: " . $templateKey);
        }

        // Variable substitution {{key}}
        foreach ($variables as $k => $v) {
            if (is_scalar($v) || is_null($v)) {
                $body = str_replace('{{' . $k . '}}', (string) ($v ?? ''), $body);
            }
        }

        // If no chatId is present, we log as failed
        if (empty($chatId)) {
            TelegramMessageLog::create([
                'user_id' => $user?->id,
                'chat_id' => 'unlinked',
                'type' => $templateKey,
                'status' => 'failed',
                'preview_text' => $body,
                'error_message' => 'Recipient has no linked Telegram chat ID.',
                'sent_at' => null,
            ]);
            return false;
        }

        $result = self::sendMessage($chatId, $body);

        TelegramMessageLog::create([
            'user_id' => $user?->id,
            'chat_id' => $chatId,
            'type' => $templateKey,
            'status' => $result['ok'] ? 'sent' : 'failed',
            'preview_text' => $body,
            'error_message' => $result['ok'] ? null : ($result['error'] ?? 'Unknown error'),
            'sent_at' => $result['ok'] ? now() : null,
        ]);

        return (bool) $result['ok'];
    }

    /**
     * Notify all administrators who have linked their Telegram account
     */
    public static function notifyAdmins(string $templateKey, array $variables = []): void
    {
        try {
            $admins = User::whereIn('role', ['super_admin', 'admin', 'Super Admin'])
                ->whereNotNull('telegram_chat_id')
                ->where('telegram_chat_id', '!=', '')
                ->get();

            foreach ($admins as $admin) {
                self::sendTemplateNotification($admin, $templateKey, $variables, 'ar');
            }
        } catch (\Throwable $e) {
            Log::warning("Failed to notify admins via Telegram ({$templateKey}): " . $e->getMessage());
        }
    }

    /**
     * Retry sending a previously failed message log
     */
    public static function retryMessage(TelegramMessageLog $log): array
    {
        if (empty($log->chat_id) || $log->chat_id === 'unlinked') {
            return [
                'ok' => false,
                'error' => 'Cannot retry send: chat ID is unlinked.',
            ];
        }

        $result = self::sendMessage($log->chat_id, $log->preview_text);

        if ($result['ok']) {
            $log->update([
                'status' => 'sent',
                'error_message' => null,
                'sent_at' => now(),
            ]);
            return ['ok' => true, 'message' => 'Message successfully resent.'];
        }

        $log->update([
            'status' => 'failed',
            'error_message' => $result['error'] ?? 'Retry failed.',
        ]);

        return [
            'ok' => false,
            'error' => $result['error'] ?? 'Retry failed.',
        ];
    }

    /**
     * Log a security audit event
     */
    public static function logSecurityEvent(
        string $eventType,
        ?string $email,
        ?string $role,
        string $status,
        ?array $details = null
    ): TelegramSecurityEvent {
        return TelegramSecurityEvent::create([
            'event_type' => $eventType,
            'email' => $email,
            'role' => $role,
            'status' => $status,
            'ip_address' => request()?->ip(),
            'details' => $details,
        ]);
    }
}
