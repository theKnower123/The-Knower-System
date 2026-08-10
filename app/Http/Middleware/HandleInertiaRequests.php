<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        $userData = null;
        if ($user) {
            $defaultPerms = $user->getAllPermissions();
            $customPerms = $user->permissions ?? [];
            if ($user->hasRole('super_admin')) {
                // Return a special flag or all frontend permissions? The frontend has an ALL array for super_admin
                $user->permissions = ['*']; 
            } else {
                $user->permissions = array_values(array_unique(array_merge($defaultPerms, $customPerms)));
            }
            
            $userData = $user->toArray();
            $userData['client_id'] = $user->client()->value('id');
            $userData['google_id'] = $user->google_id;
            $userData['has_google'] = !empty($user->google_id);
            $userData['must_connect_google'] = empty($user->google_id);
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $userData,
            ],
        ];
    }
}
