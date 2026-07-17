<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CompanyPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_companys');
    }

    public function view(User $user, Company $company): bool
    {
        return $user->hasPermissionTo('view_companys');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_companys');
    }

    public function update(User $user, Company $company): bool
    {
        return $user->hasPermissionTo('edit_companys');
    }

    public function delete(User $user, Company $company): bool
    {
        return $user->hasPermissionTo('delete_companys');
    }
}
