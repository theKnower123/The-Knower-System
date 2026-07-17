<?php

namespace App\Policies;

use App\Models\Expense;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExpensePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_expenses');
    }

    public function view(User $user, Expense $expense): bool
    {
        return $user->hasPermissionTo('view_expenses');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_expenses');
    }

    public function update(User $user, Expense $expense): bool
    {
        return $user->hasPermissionTo('edit_expenses');
    }

    public function delete(User $user, Expense $expense): bool
    {
        return $user->hasPermissionTo('delete_expenses');
    }
}
