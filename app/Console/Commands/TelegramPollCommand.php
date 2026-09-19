<?php

namespace App\Console\Commands;

use App\Modules\Telegram\Controllers\TelegramWebhookController;
use App\Modules\Telegram\Services\TelegramService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramPollCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telegram:poll {--timeout=20 : Long polling timeout in seconds} {--once : Run once and exit}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Continuously poll Telegram Bot API for incoming updates in local/development mode';

    /**
     * Execute the console command.
     */
    public function handle(TelegramWebhookController $controller): int
    {
        $token = TelegramService::getToken();
        if (empty($token)) {
            $this->error('BOT_TOKEN is not configured in .env');
            return Command::FAILURE;
        }

        $botUsername = ltrim((string) TelegramService::getBotUsername(), '@');
        $this->info("Started Telegram Bot Polling for @{$botUsername}...");

        // Webhook and getUpdates cannot run together — clear webhook first.
        $deleted = TelegramService::deleteWebhook();
        if ($deleted['ok'] ?? false) {
            $this->info('Cleared any active webhook so polling can receive updates.');
        } else {
            $this->warn('Could not clear webhook: ' . ($deleted['message'] ?? 'unknown error'));
        }

        $this->info("Press Ctrl+C to stop.\n");

        $offset = (int) \Illuminate\Support\Facades\Cache::get('tg_poll_offset', 0);
        $timeout = (int) $this->option('timeout');
        $once = (bool) $this->option('once');

        while (true) {
            try {
                $response = Http::timeout($timeout + 5)->get("https://api.telegram.org/bot{$token}/getUpdates", [
                    'offset' => $offset,
                    'timeout' => $timeout,
                ]);

                if ($response->successful() && $response->json('ok')) {
                    $updates = $response->json('result') ?? [];

                    foreach ($updates as $update) {
                        $updateId = $update['update_id'];
                        $offset = $updateId + 1;
                        \Illuminate\Support\Facades\Cache::forever('tg_poll_offset', $offset);

                        $sender = $update['message']['from']['username'] ?? $update['message']['from']['first_name'] ?? 'User';
                        $text = $update['message']['text'] ?? '[non-text]';
                        $this->line('<comment>[' . now()->format('H:i:s') . ']</comment> Incoming update #' . $updateId . ' from <info>' . $sender . '</info>: ' . $text);

                        $controller->processUpdate($update);
                    }
                } elseif ($response->status() === 409) {
                    $this->warn('Conflict with webhook — attempting to delete webhook again...');
                    TelegramService::deleteWebhook();
                    sleep(2);
                } else {
                    $desc = $response->json('description') ?? $response->body();
                    if (!empty($desc)) {
                        Log::warning('Telegram poll getUpdates failed', ['status' => $response->status(), 'description' => $desc]);
                    }
                }
            } catch (\Throwable $e) {
                $this->error('Polling error: ' . $e->getMessage());
                sleep(2);
            }

            if ($once) {
                break;
            }
        }

        return Command::SUCCESS;
    }
}
