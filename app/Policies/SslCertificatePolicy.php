<?php

namespace App\Policies;

use App\Models\SslCertificate;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SslCertificatePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_sslcertificates');
    }

    public function view(User $user, SslCertificate $sslcertificate): bool
    {
        return $user->hasPermissionTo('view_sslcertificates');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_sslcertificates');
    }

    public function update(User $user, SslCertificate $sslcertificate): bool
    {
        return $user->hasPermissionTo('edit_sslcertificates');
    }

    public function delete(User $user, SslCertificate $sslcertificate): bool
    {
        return $user->hasPermissionTo('delete_sslcertificates');
    }
}
