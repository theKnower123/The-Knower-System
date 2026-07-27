<?php

namespace App\Modules\Finance\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    protected $fillable = ['invoice_id', 'description', 'qty', 'unit_price'];

    protected $casts = [
        'qty' => 'integer',
        'unit_price' => 'decimal:2',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function lineTotal(): float
    {
        return round($this->qty * $this->unit_price, 2);
    }
}
