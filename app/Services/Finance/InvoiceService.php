<?php

namespace App\Services\Finance;

use App\Models\Invoice;
use Illuminate\Database\Eloquent\Collection;

class InvoiceService
{
    public function getAll(): Collection
    {
        return Invoice::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Invoice
    {
        return Invoice::create($data);
    }

    public function update(Invoice $invoice, array $data): Invoice
    {
        $invoice->update($data);
        return $invoice;
    }

    public function delete(Invoice $invoice): ?bool
    {
        return $invoice->delete();
    }
}
