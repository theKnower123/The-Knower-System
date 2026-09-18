<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class ClientIsolationScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        if (Auth::hasUser()) {
            $user = Auth::user();
            if ($user->role === 'client') {
                if ($model instanceof \App\Modules\CRM\Models\Client) {
                    $builder->where($model->getTable() . '.user_id', $user->id);
                } else if (in_array('client_id', $model->getFillable()) || \Illuminate\Support\Facades\Schema::hasColumn($model->getTable(), 'client_id')) {
                    $builder->whereIn($model->getTable() . '.client_id', function ($query) use ($user) {
                        $query->select('id')->from('clients')->where('user_id', $user->id);
                    });
                }
            }
        }
    }
}
