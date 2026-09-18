<?php

namespace App\Modules\CMS\Models;

use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    protected $fillable = ['platform', 'url', 'label', 'is_active', 'sort_order'];

    protected $casts = ['is_active' => 'boolean'];
}
