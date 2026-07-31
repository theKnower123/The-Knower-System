<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HandlesTrash
{
    /**
     * Opt-in trash filter for list queries only.
     *
     * Must NOT be a global scope: applying onlyTrashed() to every model on the
     * request (including User) breaks Sanctum auth when ?trashed=1 is present.
     */
    public function scopeTrashMode(Builder $query): Builder
    {
        if (request()?->boolean('trashed')) {
            return $query->onlyTrashed();
        }

        return $query;
    }
}
