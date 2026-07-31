<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

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
    }
}
