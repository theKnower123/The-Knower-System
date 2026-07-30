<?php

namespace App\Modules\Finance\Services;

use App\Modules\Finance\Models\Payment;
use Illuminate\Database\Eloquent\Collection;

class PaymentService
{
    public function getAll(): Collection
    {
        return Payment::orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): Payment
    {
        if (isset($data['transfer_proof']) && $data['transfer_proof'] instanceof \Illuminate\Http\UploadedFile) {
            $data['transfer_proof'] = $data['transfer_proof']->store('payments/receipts', 'public');
        }
        return Payment::create($data);
    }

    public function update(Payment $payment, array $data): Payment
    {
        if (isset($data['transfer_proof']) && $data['transfer_proof'] instanceof \Illuminate\Http\UploadedFile) {
            $data['transfer_proof'] = $data['transfer_proof']->store('payments/receipts', 'public');
        }
        $payment->update($data);
        return $payment;
    }

    public function delete(Payment $payment): ?bool
    {
        return $payment->delete();
    }
}
