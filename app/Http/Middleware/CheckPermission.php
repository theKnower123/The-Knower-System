<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (! $request->user()) {
            abort(403, 'You do not have the required permissions to access this page.');
        }

        $permissions = explode('|', $permission);
        $hasAny = false;
        foreach ($permissions as $perm) {
            if ($request->user()->hasPermissionTo(trim($perm))) {
                $hasAny = true;
                break;
            }
        }

        if (! $hasAny) {
            abort(403, 'You do not have the required permissions to access this page.');
        }

        return $next($request);
    }
}
