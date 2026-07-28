<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HandlesTrash
{
    protected static function bootHandlesTrash()
    {
        static::addGlobalScope('trash', function (Builder $builder) {
            if (request() && request()->query('trashed') == '1') {
                $builder->onlyTrashed();
            }
        });
    }
}
