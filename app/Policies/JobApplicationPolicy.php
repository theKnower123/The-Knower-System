<?php

namespace App\Policies;

use App\Modules\HR\Models\JobApplication;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class JobApplicationPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function view(User $user, JobApplication $jobApplication): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function create(?User $user): bool
    {
        // Public career form may submit without auth; logged in users/staff can also submit applications.
        return true;
    }

    public function update(User $user, JobApplication $jobApplication): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function delete(User $user, JobApplication $jobApplication): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function restore(User $user, JobApplication $jobApplication): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function forceDelete(User $user, JobApplication $jobApplication): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }
}
