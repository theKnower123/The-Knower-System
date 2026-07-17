<?php

namespace App\Services\CRM;

use App\Models\Company;
use Illuminate\Database\Eloquent\Collection;

class CompanyService
{
    public function getAll(): Collection
    {
        return Company::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Company
    {
        return Company::create($data);
    }

    public function update(Company $company, array $data): Company
    {
        $company->update($data);
        return $company;
    }

    public function delete(Company $company): ?bool
    {
        return $company->delete();
    }
}
