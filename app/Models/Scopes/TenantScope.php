<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (auth()->hasUser()) {
            $user = auth()->user();
            
            // Super Admins bypass tenant scope
            if ($user->hasRole('Super Admin')) {
                return;
            }

            if ($user->current_workspace_id) {
                $builder->where($model->getTable() . '.workspace_id', $user->current_workspace_id);
            }
        }
    }
}
