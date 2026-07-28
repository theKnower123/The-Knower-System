<?php

namespace App\Modules\AI\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class AiSuggestion extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    protected $fillable = [
        'target_table', 'target_id', 'suggestion_type', 'content', 'status', 'reviewed_by',
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function accept(User $reviewer): void
    {
        $this->update(['status' => 'accepted', 'reviewed_by' => $reviewer->id]);
    }

    public function reject(User $reviewer): void
    {
        $this->update(['status' => 'rejected', 'reviewed_by' => $reviewer->id]);
    }
}
