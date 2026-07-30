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

        $query = User::where('email', $request->email);
        $sql = $query->toSql();
        $bindings = $query->getBindings();
        $user = $query->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            \Log::error('Login failed for ' . $request->email . '. Query: ' . $sql . ' Bindings: ' . json_encode($bindings));
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials.',
            ], 401);
        }

        // Log the user in for the web session (for Inertia)
        Auth::login($user);
        $request->session()->regenerate();

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
                    'client_id' => $user->client()->value('id'),
                ]
            ]
        ]);
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
