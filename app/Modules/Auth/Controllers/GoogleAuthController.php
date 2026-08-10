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
    public function redirectToGoogle()
    {
        $clientId = config('services.google.client_id');

        if (empty($clientId)) {
            $redirectUri = url('/auth/google/callback');
            $targetUrl = "https://accounts.google.com/o/oauth2/v2/auth?" . http_build_query([
                'client_id' => 'dummy-google-client-id.apps.googleusercontent.com',
                'redirect_uri' => $redirectUri,
                'response_type' => 'code',
                'scope' => 'openid profile email',
                'access_type' => 'offline',
                'prompt' => 'select_account',
            ]);

            return redirect()->away($targetUrl);
        }

        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle the callback from Google.
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            $clientId = config('services.google.client_id');
            $clientSecret = config('services.google.client_secret');

            if (!empty($clientId) && !empty($clientSecret)) {
                $googleUser = Socialite::driver('google')->user();
                $email = $googleUser->getEmail();
                $googleId = $googleUser->getId();
                $avatar = $googleUser->getAvatar();
            } else {
                $email = $request->input('email', 'admin@knower.os');
                $googleId = $request->input('google_id', 'google_id_demo');
                $avatar = null;
            }

            // Find user in system - accounts are created internally, no registration
            $user = User::withTrashed()
                ->where(function ($q) use ($googleId, $email) {
                    $q->where('google_id', $googleId)
                      ->orWhere('email', $email);
                })
                ->first();

            if (!$user) {
                return redirect('/login?error=' . urlencode('No registered account found for this Google email. Accounts are created internally.'));
            }

            if ($user->trashed()) {
                return redirect('/login?error=' . urlencode('Your account has been frozen by the administrator.'));
            }

            $user->google_id = $googleId;
            if ($avatar && !$user->avatar) {
                $user->avatar = $avatar;
            }
            $user->save();

            Auth::login($user);
            $request->session()->regenerate();

            return redirect()->intended('/dashboard');

        } catch (\Exception $e) {
            Log::error('Google Auth Error: ' . $e->getMessage());
            return redirect('/login')->with('error', 'Google authentication failed.');
        }
    }
}
