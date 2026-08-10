<?php

namespace App\Modules\Finance\Models;

use App\Modules\CRM\Models\Client;
use App\Modules\Projects\Models\Project;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class Invoice extends Model
{
    use \App\Traits\IsolatesClientData;
    use HandlesTrash;
    use SoftDeletes;
    use HasWorkspace, LogsActivity;

    protected $fillable = [
        'client_id', 'project_id', 'invoice_number', 'amount', 'total_amount', 'paid_amount', 'currency', 'status', 'due_date', 'notes',
    ];

    protected $casts = [
        'due_date' => 'date',
        'amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    protected static function booted()
    {
        static::saving(function ($invoice) {
            if ($invoice->isDirty('amount')) {
                $invoice->total_amount = $invoice->amount;
            } elseif ($invoice->isDirty('total_amount')) {
                $invoice->amount = $invoice->total_amount;
            } elseif (isset($invoice->amount) && !isset($invoice->total_amount)) {
                $invoice->total_amount = $invoice->amount;
            } elseif (isset($invoice->total_amount) && !isset($invoice->amount)) {
                $invoice->amount = $invoice->total_amount;
            }
        });
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    
}

    public function project()
    {
        return $this->belongsTo(Project::class);
    
}

    public function payments()
    {
        return $this->hasMany(Payment::class);
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
