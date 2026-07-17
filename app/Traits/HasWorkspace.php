<?php

namespace App\Traits;

use App\Models\Scopes\TenantScope;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasWorkspace
{
    protected static function bootHasWorkspace(): void
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function ($model) {
            if (auth()->hasUser() && empty($model->workspace_id)) {
                $model->workspace_id = auth()->user()->current_workspace_id;
            }
        });
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}
