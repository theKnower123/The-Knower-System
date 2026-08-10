<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Failed;
use App\Modules\Auth\Models\LoginHistory;
use Throwable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        \Illuminate\Support\Facades\Gate::guessPolicyNamesUsing(function (string $modelClass) {
            $policyName = 'App\\Policies\\' . class_basename($modelClass) . 'Policy';
            if (class_exists($policyName)) {
                return $policyName;
            }
            return 'App\\Policies\\' . class_basename($modelClass) . 'Policy';
        });

        \Illuminate\Support\Facades\Gate::before(function ($user, $ability) {
            if (!$user) {
                return null;
            }

            // Role column uses snake_case (super_admin); also accept display-style names.
            if (method_exists($user, 'hasRole') && (
                $user->hasRole('super_admin')
                || $user->hasRole('Super Admin')
                || ($user->role ?? null) === 'super_admin'
            )) {
                return true;
            }

            return null;
        });

        /*
        |--------------------------------------------------------------------------
        | HTTPS
        |--------------------------------------------------------------------------
        |
        | Force HTTPS only in production.
        | This prevents generated URLs from using HTTP in production.
        |
        */

        if (
            $this->app->environment('production') ||
            request()->header('X-Forwarded-Proto') === 'https' ||
            str_starts_with(config('app.url', ''), 'https://')
        ) {
            URL::forceScheme('https');
        }

        /*
        |--------------------------------------------------------------------------
        | Global Password Policy
        |--------------------------------------------------------------------------
        |
        | This becomes the default password policy whenever
        | Password::defaults() is used in validation.
        |
        */

        Password::defaults(function () {
            return Password::min(8)
                ->letters()
                ->mixedCase()
                ->numbers()
                ->symbols()
                ->uncompromised();
        });

        /*
        |--------------------------------------------------------------------------
        | Successful Login Logging
        |--------------------------------------------------------------------------
        */

        Event::listen(Login::class, function (Login $event): void {
            try {
                if (!$event->user) {
                    return;
                }

                LoginHistory::create([
                    'user_id'    => $event->user->getAuthIdentifier(),
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                    'status'     => 'success',
                ]);
            } catch (Throwable $e) {
                /*
                 * Login history must never prevent a valid user
                 * from logging into the application.
                 */

                Log::error('Failed to record successful login history.', [
                    'user_id' => $event->user?->getAuthIdentifier(),
                    'exception' => $e,
                ]);
            }
        });

        /*
        |--------------------------------------------------------------------------
        | Failed Login Logging
        |--------------------------------------------------------------------------
        */

        Event::listen(Failed::class, function (Failed $event): void {
            try {
                LoginHistory::create([
                    'user_id'    => $event->user?->getAuthIdentifier(),
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                    'status'     => 'failed',
                ]);
            } catch (Throwable $e) {
                /*
                 * Logging failures must not interfere with
                 * authentication or error handling.
                 */

                Log::error('Failed to record failed login history.', [
                    'user_id' => $event->user?->getAuthIdentifier(),
                    'exception' => $e,
                ]);
            }
        });
    }
}
