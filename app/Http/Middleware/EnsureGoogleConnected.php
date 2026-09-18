<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureGoogleConnected
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            /** @var \App\Modules\Auth\Models\User $user */
            $user = Auth::user();

            // Mandatory for ALL users regardless of role: Google account must be connected
            if (empty($user->google_id)) {
                // Allowed routes during mandatory google setup
                $except = [
                    'auth/google',
                    'auth/google/redirect',
                    'auth/google/callback',
                    'auth/google/must-connect',
                    'logout',
                    'api/v1/auth/logout',
                    'sanctum/csrf-cookie',
                ];

                $currentPath = trim($request->path(), '/');

                foreach ($except as $allowed) {
                    if ($currentPath === $allowed || str_starts_with($currentPath, 'auth/google')) {
                        return $next($request);
                    }
                }

                if ($request->is('api/*') || $request->wantsJson()) {
                    return response()->json([
                        'must_connect_google' => true,
                        'message'             => 'Google Account connection is mandatory for all users before proceeding.',
                        'redirect'            => '/auth/google/must-connect',
                    ], 403);
                }

                return redirect('/auth/google/must-connect');
            }
        }

        return $next($request);
    }
}
