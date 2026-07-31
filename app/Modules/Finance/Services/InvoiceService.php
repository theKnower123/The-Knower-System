<?php

namespace App\Modules\Finance\Services;

use App\Modules\Finance\Models\Invoice;
use Illuminate\Database\Eloquent\Collection;

class InvoiceService
{
    public function getAll(): Collection
    {
        return Invoice::trashMode()->orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): Invoice
    {
        if (empty($data['invoice_number'])) {
            $data['invoice_number'] = 'INV-' . strtoupper(uniqid());
        }
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
