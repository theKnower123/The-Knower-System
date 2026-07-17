<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Http\Requests\CRM\StoreContractRequest;
use App\Http\Requests\CRM\UpdateContractRequest;
use App\Http\Resources\CRM\ContractResource;
use App\Models\Contract;
use App\Services\CRM\ContractService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ContractController extends Controller
{
    protected ContractService $contractService;

    public function __construct(ContractService $contractService)
    {
        $this->contractService = $contractService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Contract::class);

        $contracts = $this->contractService->getAll();
        
        // Load relations if needed
        $contracts->load(['client', 'quotation']);

        return response()->json([
            'success' => true,
            'message' => 'Contracts retrieved successfully.',
            'data' => ContractResource::collection($contracts)
        ]);
    }

    public function store(StoreContractRequest $request): JsonResponse
    {
        $contract = $this->contractService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Contract created successfully.',
            'data' => new ContractResource($contract)
        ], 201);
    }

    public function show(Contract $contract): JsonResponse
    {
        Gate::authorize('view', $contract);
        $contract->load(['client', 'quotation']);

        return response()->json([
            'success' => true,
            'message' => 'Contract retrieved successfully.',
            'data' => new ContractResource($contract)
        ]);
    }

    public function update(UpdateContractRequest $request, Contract $contract): JsonResponse
    {
        $contract = $this->contractService->update($contract, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Contract updated successfully.',
            'data' => new ContractResource($contract)
        ]);
    }

    public function destroy(Contract $contract): JsonResponse
    {
        Gate::authorize('delete', $contract);

        $this->contractService->delete($contract);

        return response()->json([
            'success' => true,
            'message' => 'Contract deleted successfully.',
            'data' => null
        ]);
    }
}
