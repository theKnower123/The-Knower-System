<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Modules\Auth\Models\User;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Check if user account is soft deleted / frozen
        $trashedUser = User::withTrashed()->where('email', $request->email)->first();

        if ($trashedUser && $trashedUser->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been frozen by the administrator.',
            ], 403);
        }

        if (!$trashedUser) {
            Log::error('Login failed for ' . $request->email);
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $user = $trashedUser;

        if (!Hash::check($request->password, $user->password)) {
            \App\Services\UserActivityLogger::log(
                $user->id,
                'Failed Login Attempt',
                'security',
                "User Account #{$user->id}",
                "Failed authentication attempt with invalid password.",
                $user->id,
                $user->name
            );

            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials.',
            ], 401);
        }

        // Log the user in for the web session (if session middleware is enabled)
        Auth::login($user);
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        // Record last_login_at
        $user->forceFill(['last_login_at' => now()])->save();

        \App\Services\UserActivityLogger::log(
            $user->id,
            'Successful Login',
            'auth',
            "User Account #{$user->id}",
            "User authenticated successfully via standard credentials.",
            $user->id,
            $user->name
        );

        // Give full role-based permissions or token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ?? 'client',
                    'client_id' => $user->client ? $user->client->id : null,
                ]
            ]
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $token = $request->user()->currentAccessToken();
            if ($token && method_exists($token, 'delete')) {
                $token->delete();
            }
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.'
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'client',
                'client_id' => $user->client()->value('id'),
            ]
        ]);
    }
}
