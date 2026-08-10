<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Modules\Auth\Models\User;

use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                \Log::warning('Failed login attempt for: ' . $request->email);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials. Please check your email and password.',
                ], 401);
            }

            // Log the user in for the web session (for Inertia)
            try {
                Auth::login($user);
                if ($request->hasSession()) {
                    $request->session()->regenerate();
                }
            } catch (\Throwable $se) {
                \Log::warning('Session login warning: ' . $se->getMessage());
            }

            // Give full role-based permissions or token
            $token = $user->createToken('auth_token')->plainTextToken;

            $clientId = null;
            try {
                $clientId = $user->client()->value('id');
            } catch (\Throwable $ce) {
                // Ignore client lookup error if client table not set up
            }

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
                        'client_id' => $clientId,
                    ]
                ]
            ]);
        } catch (\Throwable $e) {
            \Log::error('Login error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Server Error (500): ' . $e->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
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
