<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Models\User;
use App\Modules\Telegram\Models\TelegramPasswordReset;
use App\Modules\Telegram\Services\TelegramService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): RedirectResponse
    {
        return redirect('/login?view=forgot-password');
    }

    /**
     * Handle an incoming password reset link request via Telegram.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = strtolower(trim($request->email));
        $user = User::where('email', $email)->first();

        // 1. Account does not exist
        if (!$user) {
            TelegramService::logSecurityEvent(
                'no_linked_account',
                $email,
                null,
                'rejected',
                ['reason' => 'Email address not found in system']
            );

            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No Telegram-linked account found for this email. Please contact the site administrator to reset your password manually.',
                ], 422);
            }

            throw ValidationException::withMessages([
                'email' => ['No Telegram-linked account found for this email. Please contact the site administrator to reset your password manually.'],
            ]);
        }

        // 2. User exists but has no linked Telegram account -> DO NOT send email
        if (empty($user->telegram_chat_id)) {
            TelegramService::logSecurityEvent(
                'no_linked_account',
                $user->email,
                $user->role,
                'rejected',
                ['reason' => 'User does not have a linked Telegram account']
            );

            $errorMsg = 'No Telegram account is linked to this user. Password recovery is exclusively delivered via Telegram. Please contact the site administrator to reset your password manually.';

            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $errorMsg,
                ], 422);
            }

            throw ValidationException::withMessages([
                'email' => [$errorMsg],
            ]);
        }

        // 3. User has a linked Telegram account -> generate 5-minute single-use token
        // Invalidate any previous unexpired tokens
        TelegramPasswordReset::where('user_id', $user->id)
            ->whereNull('used_at')
            ->update(['used_at' => now()]);

        $token = Str::random(64);

        TelegramPasswordReset::create([
            'user_id' => $user->id,
            'email' => $user->email,
            'token' => $token,
            'expires_at' => now()->addMinutes(5),
            'used_at' => null,
        ]);

        $resetUrl = rtrim(config('app.url'), '/') . "/reset-password/{$token}?email=" . urlencode($user->email);

        // Dispatch message via Telegram
        TelegramService::sendTemplateNotification(
            $user,
            'password_reset',
            [
                'user_name' => $user->name,
                'reset_link' => $resetUrl,
                'expires_in' => '5 minutes',
            ]
        );

        TelegramService::logSecurityEvent(
            'reset_requested',
            $user->email,
            $user->role,
            'success',
            [
                'chat_id' => $user->telegram_chat_id,
                'token_expires_at' => now()->addMinutes(5)->toDateTimeString(),
            ]
        );

        $successMsg = 'A password reset link has been sent to your linked Telegram account. The link expires in 5 minutes.';

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => $successMsg,
            ]);
        }

        return back()->with('status', $successMsg);
    }
}
