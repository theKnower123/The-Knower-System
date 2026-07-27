<?php

namespace App\Modules\CMS\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class LandingSection extends Model
{
    protected $fillable = ['section_key', 'is_visible', 'sort_order', 'updated_by'];

    protected $casts = ['is_visible' => 'boolean'];

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
