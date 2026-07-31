<?php

namespace App\Policies;

use App\Modules\HR\Models\JobPosting;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class JobPostingPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function view(User $user, JobPosting $jobPosting): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function update(User $user, JobPosting $jobPosting): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function delete(User $user, JobPosting $jobPosting): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function restore(User $user, JobPosting $jobPosting): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }

    public function forceDelete(User $user, JobPosting $jobPosting): bool
    {
        return $user->hasPermissionTo('hr.view') || $user->hasPermissionTo('hr.manage');
    }
}
