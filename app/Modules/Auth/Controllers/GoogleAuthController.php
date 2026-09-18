<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google's OAuth server.
     */
    public function redirect(Request $request)
    {
        return $this->redirectToGoogle($request);
    }

    public function redirectToGoogle(Request $request = null)
    {
        // If an authenticated user is connecting their account, save user ID in session
        if (Auth::check()) {
            session(['google_connect_user_id' => Auth::id()]);
        }

        try {
            return Socialite::driver('google')->redirect();
        } catch (\Throwable $e) {
            Log::error('Google OAuth Redirect Error: ' . $e->getMessage());

            $clientId = config('services.google.client_id');
            $redirectUri = config('services.google.redirect') ?: url('/auth/google/callback');

            if (!empty($clientId)) {
                $params = [
                    'client_id'     => $clientId,
                    'redirect_uri'  => $redirectUri,
                    'response_type' => 'code',
                    'scope'         => 'openid profile email',
                    'access_type'   => 'offline',
                    'prompt'        => 'select_account',
                ];
                return redirect()->away('https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params));
            }

            if (Auth::check()) {
                return redirect('/profile?error=' . urlencode('Google OAuth credentials not configured in system (.env).'));
            }
            return redirect('/login?error=' . urlencode('Could not initiate Google OAuth: ' . $e->getMessage()));
        }
    }

    /**
     * Handle the callback from Google.
     */
    public function callback(Request $request)
    {
        return $this->handleGoogleCallback($request);
    }

    public function handleGoogleCallback(Request $request)
    {
        try {
            if ($request->has('error')) {
                $err = $request->input('error_description', $request->input('error'));
                if (Auth::check()) {
                    return redirect('/profile?error=' . urlencode('Google sign-in cancelled or failed: ' . $err));
                }
                return redirect('/login?error=' . urlencode('Google sign-in cancelled or failed: ' . $err));
            }

            // Retrieve Google User
            try {
                $googleUser = Socialite::driver('google')->user();
            } catch (\Throwable $socErr) {
                /** @var \Laravel\Socialite\Two\AbstractProvider $googleDriver */
                $googleDriver = Socialite::driver('google');
                $googleUser = $googleDriver->stateless()->user();
            }

            $email    = $googleUser->getEmail();
            $googleId = $googleUser->getId();
            $avatar   = $googleUser->getAvatar();

            $connectUserId = session('google_connect_user_id') ?? Auth::id();
            $currentUser = $connectUserId ? User::withTrashed()->find($connectUserId) : null;

            // Case A: User is currently linking account while logged in
            if ($currentUser) {
                // Check for collision with another user
                $conflict = User::where('google_id', $googleId)
                    ->where('id', '!=', $currentUser->id)
                    ->first();

                if ($conflict) {
                    return redirect('/profile?error=' . urlencode("This Google account is already linked to {$conflict->email}."));
                }

                $currentUser->google_id = $googleId;
                $currentUser->must_connect_google = false;
                if ($avatar && empty($currentUser->avatar)) {
                    $currentUser->avatar = $avatar;
                }
                $currentUser->save();

                if (!Auth::check()) {
                    Auth::login($currentUser);
                }

                session()->forget('google_connect_user_id');

                return redirect('/dashboard?google_connected=1');
            }

            // Case B: User logging in via Google from Login Page
            $user = User::withTrashed()
                ->where('google_id', $googleId)
                ->orWhere('email', $email)
                ->first();

            if (!$user) {
                return redirect('/login?error=' . urlencode("No registered account found for {$email}. Accounts must be provisioned internally by an administrator."));
            }

            if ($user->trashed()) {
                return redirect('/login?error=' . urlencode('Your account has been frozen by the administrator.'));
            }

            $user->google_id = $googleId;
            $user->must_connect_google = false;
            if ($avatar && empty($user->avatar)) {
                $user->avatar = $avatar;
            }
            $user->save();

            Auth::login($user);
            $request->session()->regenerate();

            return redirect()->intended('/dashboard');

        } catch (\Throwable $e) {
            Log::error('Google Auth Error: ' . $e->getMessage());
            if (Auth::check()) {
                return redirect('/profile?error=' . urlencode('Google authentication failed: ' . $e->getMessage()));
            }
            return redirect('/login?error=' . urlencode('Google authentication failed: ' . $e->getMessage()));
        }
    }
}
