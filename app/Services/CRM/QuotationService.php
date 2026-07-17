<?php

namespace App\Services\CRM;

use App\Models\Quotation;
use Illuminate\Database\Eloquent\Collection;

class QuotationService
{
    public function getAll(): Collection
    {
        return Quotation::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Quotation
    {
        return Quotation::create($data);
    }

    public function update(Quotation $quotation, array $data): Quotation
    {
        $quotation->update($data);
        return $quotation;
    }

    public function delete(Quotation $quotation): ?bool
    {
        return $quotation->delete();
    }
}
