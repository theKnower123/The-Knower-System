<?php

namespace App\Modules\Finance\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class Payment extends Model
{
    use \App\Traits\IsolatesClientData;
    use HandlesTrash;
    use SoftDeletes;
    use HasWorkspace, LogsActivity;

    const UPDATED_AT = null;

    protected $fillable = [
        'invoice_id', 'client_id', 'payment_method', 'method', 'amount', 'payment_date', 'paid_at', 'reference', 'transfer_proof', 'notes',
    ];

    protected $appends = ['transfer_proof_url'];

    public function getTransferProofUrlAttribute(): ?string
    {
        return \App\Support\StorageUrlHelper::url($this->transfer_proof);
    }

    protected $casts = [
        'payment_date' => 'datetime',
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function getMethodAttribute()
    {
        return $this->attributes['payment_method'] ?? null;
    }

    public function getPaidAtAttribute()
    {
        return $this->attributes['payment_date'] ?? null;
    }

    protected static function booted()
    {
        static::saving(function ($payment) {
            if (isset($payment->attributes['method'])) {
                $payment->attributes['payment_method'] = $payment->attributes['method'];
                unset($payment->attributes['method']);
            }
            if (isset($payment->attributes['paid_at'])) {
                $payment->attributes['payment_date'] = $payment->attributes['paid_at'];
                unset($payment->attributes['paid_at']);
            }

            if (!$payment->client_id && $payment->invoice_id) {
                $invoice = Invoice::find($payment->invoice_id);
                if ($invoice) {
                    $payment->client_id = $invoice->client_id;
                }
            }
        });
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
