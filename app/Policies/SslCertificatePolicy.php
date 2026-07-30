<?php

namespace App\Policies;

use App\Modules\Hosting\Models\SslCertificate;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SslCertificatePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('client_portal.view') || $user->hasPermissionTo('hosting.view') || $user->hasPermissionTo('ssl.manage');
    }

    public function view(User $user, SslCertificate $sslCertificate): bool
    {
        if ($user->hasPermissionTo('client_portal.view')) {
            return $user->client()->value('id') && $user->client()->value('id') === $sslCertificate->client_id;
        }
        return $user->hasPermissionTo('hosting.view') || $user->hasPermissionTo('ssl.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('ssl.manage');
    }

    public function update(User $user, SslCertificate $sslCertificate): bool
    {
        return $user->hasPermissionTo('ssl.manage');
    }

    public function delete(User $user, SslCertificate $sslCertificate): bool
    {
        return $user->hasPermissionTo('ssl.manage');
    }

    public function restore(User $user, SslCertificate $sslCertificate): bool
    {
        return $user->hasPermissionTo('ssl.manage');
    }

    public function forceDelete(User $user, SslCertificate $sslCertificate): bool
    {
        return $user->hasPermissionTo('ssl.manage');
    }
}
