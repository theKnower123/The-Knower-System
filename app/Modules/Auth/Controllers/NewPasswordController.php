<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Models\User;
use App\Modules\Telegram\Models\TelegramPasswordReset;
use App\Modules\Telegram\Services\TelegramService;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     */
    public function create(Request $request): Response
    {
        $token = (string) $request->route('token');
        $email = (string) $request->query('email');

        $reset = TelegramPasswordReset::where('token', $token)
            ->where('email', $email)
            ->first();

        $isExpired = false;
        $isUsed = false;
        $secondsRemaining = 0;

        if (!$reset) {
            $isExpired = true;
        } else {
            $isUsed = !is_null($reset->used_at);
            $isExpired = $reset->expires_at->isPast() || $isUsed;
            $secondsRemaining = max(0, now()->diffInSeconds($reset->expires_at, false));
        }

        return Inertia::render('ResetPassword', [
            'email' => $email,
            'token' => $token,
            'is_expired' => $isExpired,
            'is_used' => $isUsed,
            'seconds_remaining' => (int) $secondsRemaining,
        ]);
    }

    /**
     * Handle an incoming new password request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $email = strtolower(trim($request->email));
        $token = $request->token;

        $reset = TelegramPasswordReset::where('token', $token)
            ->where('email', $email)
            ->first();

        // 1. Token invalid or not found
        if (!$reset) {
            TelegramService::logSecurityEvent(
                'reset_expired',
                $email,
                null,
                'rejected',
                ['reason' => 'Invalid reset token']
            );

            throw ValidationException::withMessages([
                'email' => ['This password reset link is invalid.'],
            ]);
        }

        // 2. Token already used
        if (!is_null($reset->used_at)) {
            TelegramService::logSecurityEvent(
                'reset_expired',
                $email,
                null,
                'rejected',
                ['reason' => 'Single-use token already consumed']
            );

            throw ValidationException::withMessages([
                'email' => ['This password reset link has already been used. Please request a new one.'],
            ]);
        }

        // 3. Token expired (5 minutes)
        if ($reset->expires_at->isPast()) {
            TelegramService::logSecurityEvent(
                'reset_expired',
                $email,
                null,
                'rejected',
                ['reason' => 'Token expired (5-minute limit exceeded)', 'expires_at' => $reset->expires_at->toDateTimeString()]
            );

            throw ValidationException::withMessages([
                'email' => ['This password reset link has expired (5-minute limit). Please request a new link.'],
            ]);
        }

        /** @var User|null $user */
        $user = User::find($reset->user_id) ?: User::where('email', $email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['User account no longer exists.'],
            ]);
        }

        // Update password and consume single-use token
        $user->forceFill([
            'password' => Hash::make($request->password),
            'remember_token' => Str::random(60),
        ])->save();

        $reset->update(['used_at' => now()]);

        event(new PasswordReset($user));

        TelegramService::logSecurityEvent(
            'reset_success',
            $user->email,
            $user->role,
            'success',
            ['method' => 'telegram_token']
        );

        $successMsg = 'Your password has been reset successfully! You may now sign in.';

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => $successMsg,
            ]);
        }

        return redirect()->route('login')->with('status', $successMsg);
    }
}
