<?php

namespace App\Modules\AI\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class AiSuggestion extends Model
{
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
