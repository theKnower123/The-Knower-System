<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Http\Requests\CRM\StoreCompanyRequest;
use App\Http\Requests\CRM\UpdateCompanyRequest;
use App\Http\Resources\CRM\CompanyResource;
use App\Models\Company;
use App\Services\CRM\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class CompanyController extends Controller
{
    protected CompanyService $companyService;

    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Company::class);

        $companys = $this->companyService->getAll();
        
        // Load relations if needed

        return response()->json([
            'success' => true,
            'message' => 'Companys retrieved successfully.',
            'data' => CompanyResource::collection($companys)
        ]);
    }

    public function store(StoreCompanyRequest $request): JsonResponse
    {
        $company = $this->companyService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Company created successfully.',
            'data' => new CompanyResource($company)
        ], 201);
    }

    public function show(Company $company): JsonResponse
    {
        Gate::authorize('view', $company);
        $company->load('clients');

        return response()->json([
            'success' => true,
            'message' => 'Company retrieved successfully.',
            'data' => new CompanyResource($company)
        ]);
    }

    public function update(UpdateCompanyRequest $request, Company $company): JsonResponse
    {
        $company = $this->companyService->update($company, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Company updated successfully.',
            'data' => new CompanyResource($company)
        ]);
    }

    public function destroy(Company $company): JsonResponse
    {
        Gate::authorize('delete', $company);

        $this->companyService->delete($company);

        return response()->json([
            'success' => true,
            'message' => 'Company deleted successfully.',
            'data' => null
        ]);
    }
}
