<?php

namespace App\Services\Finance;

use App\Models\Expense;
use Illuminate\Database\Eloquent\Collection;

class ExpenseService
{
    public function getAll(): Collection
    {
        return Expense::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Expense
    {
        return Expense::create($data);
    }

    public function update(Expense $expense, array $data): Expense
    {
        $expense->update($data);
        return $expense;
    }

    public function delete(Expense $expense): ?bool
    {
        return $expense->delete();
    }
}
