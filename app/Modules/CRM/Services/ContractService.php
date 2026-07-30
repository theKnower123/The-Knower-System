<?php

namespace App\Modules\CRM\Services;

use App\Modules\CRM\Models\Contract;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ContractService
{
    public function getAll(): Collection
    {
        return Contract::orderBy("id", "desc")->get();
    }

    public function create(array $data): Contract
    {
        if (empty($data['contract_number'])) {
            $data['contract_number'] = 'CTR-' . strtoupper(uniqid());
        }

        $data = $this->handleFileUploads($data);

        return Contract::create($data);
    }

    public function update(Contract $contract, array $data): Contract
    {
        $data = $this->handleFileUploads($data, $contract);
        $contract->update($data);
        return $contract;
    }

    public function delete(Contract $contract): ?bool
    {
        return $contract->delete();
    }

    protected function handleFileUploads(array $data, ?Contract $contract = null): array
    {
        // Handle document or file key
        $fileKey = isset($data['document']) ? 'document' : (isset($data['file']) ? 'file' : null);

        if ($fileKey && $data[$fileKey] instanceof UploadedFile) {
            $path = $data[$fileKey]->store('contracts', 'public');
            $data['file'] = $path;
            $data['document'] = $path;
        } elseif (isset($data['file']) && is_string($data['file'])) {
            $data['document'] = $data['file'];
        } elseif (isset($data['document']) && is_string($data['document'])) {
            $data['file'] = $data['document'];
        }

        return $data;
    }
}
