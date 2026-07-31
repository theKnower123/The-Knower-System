<?php

namespace App\Modules\Hosting\Services;

use App\Modules\Hosting\Models\SslCertificate;
use Illuminate\Database\Eloquent\Collection;

class SslCertificateService
{
    public function getAll(): Collection
    {
        return SslCertificate::trashMode()->orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): SslCertificate
    {
        return SslCertificate::create($data);
    }

    public function update(SslCertificate $sslcertificate, array $data): SslCertificate
    {
        $sslcertificate->update($data);
        return $sslcertificate;
    }

    public function delete(SslCertificate $sslcertificate): ?bool
    {
        return $sslcertificate->delete();
    }
}
