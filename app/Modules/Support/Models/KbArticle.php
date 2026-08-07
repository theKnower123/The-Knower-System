<?php

namespace App\Modules\Support\Models;

use App\Modules\Auth\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class KbArticle extends Model
{
    use HandlesTrash;
    use SoftDeletes;

    protected $fillable = ['title', 'category', 'body', 'is_published', 'created_by'];

    protected $casts = ['is_published' => 'boolean'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
