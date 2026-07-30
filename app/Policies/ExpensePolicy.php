<?php

namespace App\Policies;

use App\Modules\Finance\Models\Expense;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExpensePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('finance.view') || $user->hasPermissionTo('expense.manage');
    }

    public function view(User $user, Expense $expense): bool
    {
        return $user->hasPermissionTo('finance.view') || $user->hasPermissionTo('expense.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('expense.manage');
    }

    public function update(User $user, Expense $expense): bool
    {
        return $user->hasPermissionTo('expense.manage');
    }

    public function delete(User $user, Expense $expense): bool
    {
        return $user->hasPermissionTo('expense.manage');
    }

    public function restore(User $user, Expense $expense): bool
    {
        return $user->hasPermissionTo('expense.manage');
    }

    public function forceDelete(User $user, Expense $expense): bool
    {
        return $user->hasPermissionTo('expense.manage');
    }
}
