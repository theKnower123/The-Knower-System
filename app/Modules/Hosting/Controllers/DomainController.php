<?php

namespace App\Modules\Hosting\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Hosting\Requests\StoreDomainRequest;
use App\Modules\Hosting\Requests\UpdateDomainRequest;
use App\Http\Resources\Hosting\DomainResource;
use App\Modules\Hosting\Models\Domain;
use App\Modules\Hosting\Services\DomainService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class DomainController extends Controller
{
    protected DomainService $domainService;

    public function __construct(DomainService $domainService)
    {
        $this->domainService = $domainService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Domain::class);

        $domains = $this->domainService->getAll();
        
        // Load relations if needed
        $domains->load(['client', 'project', 'sslCertificates']);

        return response()->json([
            'success' => true,
            'message' => 'Domains retrieved successfully.',
            'data' => DomainResource::collection($domains)
        ]);
    }

    public function store(StoreDomainRequest $request): JsonResponse
    {
        $domain = $this->domainService->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Domain created successfully.',
            'data' => new DomainResource($domain)
        ], 201);
    }

    public function show(Domain $domain): JsonResponse
    {
        Gate::authorize('view', $domain);

        return response()->json([
            'success' => true,
            'message' => 'Domain retrieved successfully.',
            'data' => new DomainResource($domain)
        ]);
    }

    public function update(UpdateDomainRequest $request, Domain $domain): JsonResponse
    {
        $domain = $this->domainService->update($domain, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Domain updated successfully.',
            'data' => new DomainResource($domain)
        ]);
    }

    public function destroy(Domain $domain): JsonResponse
    {
        Gate::authorize('delete', $domain);

        $this->domainService->delete($domain);

        return response()->json([
            'success' => true,
            'message' => 'Domain deleted successfully.',
            'data' => null
        ]);
    }
}
