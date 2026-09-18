<?php

namespace App\Http\Resources\Finance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        if (!empty($data['receipt_path'])) {
            $data['receipt_url'] = \App\Support\StorageUrlHelper::url($data['receipt_path']);
        }
        if (!empty($data['transfer_proof'])) {
            $data['transfer_proof_url'] = \App\Support\StorageUrlHelper::url($data['transfer_proof']);
        }
        if (!empty($data['invoice_proof'])) {
            $data['invoice_proof_url'] = \App\Support\StorageUrlHelper::url($data['invoice_proof']);
        }
        return $data;
    }
}
