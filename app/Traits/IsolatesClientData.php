<?php

namespace App\Traits;

use App\Scopes\ClientIsolationScope;

trait IsolatesClientData
{
    protected static function bootIsolatesClientData()
    {
        static::addGlobalScope(new ClientIsolationScope());
    }
}
