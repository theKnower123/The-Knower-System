<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HandlesTrash
{
    protected static function bootHandlesTrash()
    {
        static::addGlobalScope('trash', function (Builder $builder) {
            if (request() && in_array(request()->query('trashed'), ['1', 'true', true], true)) {
                $builder->onlyTrashed();
            }
        });
    }
}
