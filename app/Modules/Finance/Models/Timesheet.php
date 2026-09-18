<?php

namespace App\Modules\Finance\Models;

use App\Modules\Auth\Models\User;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class Timesheet extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    protected $fillable = ['user_id', 'period_start', 'period_end', 'status', 'approved_by', 'approved_at'];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'approved_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function approve(User $approver): void
    {
        $this->update([
            'status' => 'approved',
            'approved_by' => $approver->id,
            'approved_at' => now(),
        ]);
    }
}
