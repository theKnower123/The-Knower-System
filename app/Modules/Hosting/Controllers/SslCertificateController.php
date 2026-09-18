<?php

namespace App\Modules\Hosting\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Hosting\Requests\StoreSslCertificateRequest;
use App\Modules\Hosting\Requests\UpdateSslCertificateRequest;
use App\Http\Resources\Hosting\SslCertificateResource;
use App\Modules\Hosting\Models\SslCertificate;
use App\Modules\Hosting\Services\SslCertificateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class SslCertificateController extends Controller
{
    protected SslCertificateService $sslcertificateService;

    public function __construct(SslCertificateService $sslcertificateService)
    {
        $this->sslcertificateService = $sslcertificateService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', SslCertificate::class);

        $sslcertificates = $this->sslcertificateService->getAll();
        
        // Load relations if needed
        $sslcertificates->load('domain');

        return response()->json([
            'success' => true,
            'message' => 'SslCertificates retrieved successfully.',
            'data' => SslCertificateResource::collection($sslcertificates)
        ]);
    }

    public function store(StoreSslCertificateRequest $request): JsonResponse
    {
        $sslcertificate = $this->sslcertificateService->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'SslCertificate created successfully.',
            'data' => new SslCertificateResource($sslcertificate)
        ], 201);
    }

    public function show(SslCertificate $sslcertificate): JsonResponse
    {
        Gate::authorize('view', $sslcertificate);

        return response()->json([
            'success' => true,
            'message' => 'SslCertificate retrieved successfully.',
            'data' => new SslCertificateResource($sslcertificate)
        ]);
    }

    public function update(UpdateSslCertificateRequest $request, SslCertificate $sslcertificate): JsonResponse
    {
        $sslcertificate = $this->sslcertificateService->update($sslcertificate, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'SslCertificate updated successfully.',
            'data' => new SslCertificateResource($sslcertificate)
        ]);
    }

    public function destroy(SslCertificate $sslcertificate): JsonResponse
    {
        Gate::authorize('delete', $sslcertificate);

        $this->sslcertificateService->delete($sslcertificate);

        return response()->json([
            'success' => true,
            'message' => 'SslCertificate deleted successfully.',
            'data' => null
        ]);
    }
}
