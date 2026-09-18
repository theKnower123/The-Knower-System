<?php

namespace App\Modules\CMS\Models;

use App\Modules\Auth\Models\User;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class LandingSection extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    protected $fillable = ['section_key', 'is_visible', 'sort_order', 'updated_by'];

    protected $casts = ['is_visible' => 'boolean'];

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
