<?php
namespace App\Services\CRM;

use App\Models\Quotation;
use Illuminate\Support\Facades\Auth;

class QuotationService
{
    public function getAll()
    {
        return Quotation::with(['company', 'lead', 'contact'])->latest()->paginate(25);
    }

    public function create(array $data): Quotation
    {
        $data['created_by'] = Auth::id();
        return Quotation::create($data);
    }

    public function update(Quotation $quotation, array $data): Quotation
    {
        $data['updated_by'] = Auth::id();
        $quotation->update($data);
        return $quotation;
    }

    public function delete(Quotation $quotation): bool
    {
        return $quotation->delete();
    }
}
