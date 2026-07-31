<?php

namespace App\Traits;

use App\Core\Scopes\TenantScope;
use App\Modules\Settings\Models\Workspace;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

/**
 * @mixin \Illuminate\Database\Eloquent\Model
 */
trait HasWorkspace
{
    protected static function bootHasWorkspace(): void
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function ($model) {
            if (empty($model->workspace_id)) {
                if (Auth::check()) {
                    $model->workspace_id = Auth::user()->current_workspace_id ?? 1;
                } else {
                    $model->workspace_id = 1;
                }
            }
        });
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}
