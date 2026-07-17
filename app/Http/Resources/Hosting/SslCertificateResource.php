<?php

namespace App\Http\Resources\Hosting;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SslCertificateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
