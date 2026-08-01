<?php

namespace App\Modules\Finance\Models;

use App\Modules\Auth\Models\User;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\HasWorkspace;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HandlesTrash;

class Expense extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    use HasWorkspace, LogsActivity;

    protected $fillable = [
        'category', 'title', 'amount', 'unit_price', 'quantity', 'payment_method', 'method', 'transfer_proof', 'receipt_path', 'expense_date', 'created_by', 'notes',
    ];

    protected $appends = ['receipt_url', 'transfer_proof_url'];

    public function getReceiptUrlAttribute(): ?string
    {
        return \App\Support\StorageUrlHelper::url($this->receipt_path);
    }

    public function getTransferProofUrlAttribute(): ?string
    {
        return \App\Support\StorageUrlHelper::url($this->transfer_proof ?? $this->receipt_path);
    }

    protected $casts = [
        'amount' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'quantity' => 'decimal:2',
        'expense_date' => 'date',
    ];

    public $timestamps = true;

    public function getMethodAttribute()
    {
        return $this->attributes['payment_method'] ?? null;
    }

    public function getDateAttribute()
    {
        return $this->attributes['expense_date'] ?? $this->attributes['created_at'] ?? null;
    }

    protected static function booted()
    {
        static::saving(function ($expense) {
            if (isset($expense->attributes['method'])) {
                $expense->attributes['payment_method'] = $expense->attributes['method'];
                unset($expense->attributes['method']);
            }
            if (isset($expense->attributes['date'])) {
                $expense->attributes['expense_date'] = $expense->attributes['date'];
                unset($expense->attributes['date']);
            }
            if (isset($expense->attributes['invoice_proof'])) {
                $expense->attributes['receipt_path'] = $expense->attributes['invoice_proof'];
                unset($expense->attributes['invoice_proof']);
            }
            if (isset($expense->attributes['description']) && empty($expense->attributes['notes'])) {
                $expense->attributes['notes'] = $expense->attributes['description'];
            }
        });
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    
}


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
