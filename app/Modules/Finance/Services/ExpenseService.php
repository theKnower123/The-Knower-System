<?php

namespace App\Modules\Finance\Services;

use App\Modules\Finance\Models\Expense;
use Illuminate\Database\Eloquent\Collection;

class ExpenseService
{
    public function getAll(): Collection
    {
        return Expense::trashMode()->orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): Expense
    {
        if (isset($data['transfer_proof']) && $data['transfer_proof'] instanceof \Illuminate\Http\UploadedFile) {
            $data['transfer_proof'] = $data['transfer_proof']->store('expenses/transfers', 'public');
        }
        if (isset($data['receipt_path']) && $data['receipt_path'] instanceof \Illuminate\Http\UploadedFile) {
            $data['receipt_path'] = $data['receipt_path']->store('expenses/receipts', 'public');
        }
        if (isset($data['invoice_proof']) && $data['invoice_proof'] instanceof \Illuminate\Http\UploadedFile) {
            $data['receipt_path'] = $data['invoice_proof']->store('expenses/receipts', 'public');
        }
        return Expense::create($data);
    }

    public function update(Expense $expense, array $data): Expense
    {
        if (isset($data['transfer_proof']) && $data['transfer_proof'] instanceof \Illuminate\Http\UploadedFile) {
            $data['transfer_proof'] = $data['transfer_proof']->store('expenses/transfers', 'public');
        }
        if (isset($data['receipt_path']) && $data['receipt_path'] instanceof \Illuminate\Http\UploadedFile) {
            $data['receipt_path'] = $data['receipt_path']->store('expenses/receipts', 'public');
        }
        if (isset($data['invoice_proof']) && $data['invoice_proof'] instanceof \Illuminate\Http\UploadedFile) {
            $data['receipt_path'] = $data['invoice_proof']->store('expenses/receipts', 'public');
        }
        $expense->update($data);
        return $expense;
    }

    public function delete(Expense $expense): ?bool
    {
        return $expense->delete();
    }
}
