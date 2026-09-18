<?php

namespace App\Modules\Hosting\Services;

use App\Modules\Hosting\Models\HostingAccount;
use Illuminate\Database\Eloquent\Collection;

class HostingAccountService
{
    public function getAll(): Collection
    {
        return HostingAccount::trashMode()->orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): HostingAccount
    {
        return HostingAccount::create($data);
    }

    public function update(HostingAccount $hostingaccount, array $data): HostingAccount
    {
        $hostingaccount->update($data);
        return $hostingaccount;
    }

    public function delete(HostingAccount $hostingaccount): ?bool
    {
        return $hostingaccount->delete();
    }
}
