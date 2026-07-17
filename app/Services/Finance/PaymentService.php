<?php

namespace App\Services\Finance;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Collection;

class PaymentService
{
    public function getAll(): Collection
    {
        return Payment::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Payment
    {
        return Payment::create($data);
    }

    public function update(Payment $payment, array $data): Payment
    {
        $payment->update($data);
        return $payment;
    }

    public function delete(Payment $payment): ?bool
    {
        return $payment->delete();
    }
}
