<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Http\Requests\CRM\StoreQuotationRequest;
use App\Http\Requests\CRM\UpdateQuotationRequest;
use App\Http\Resources\CRM\QuotationResource;
use App\Models\Quotation;
use App\Services\CRM\QuotationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class QuotationController extends Controller
{
    protected QuotationService $quotationService;

    public function __construct(QuotationService $quotationService)
    {
        $this->quotationService = $quotationService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Quotation::class);

        $quotations = $this->quotationService->getAll();
        
        // Load relations if needed
        $quotations->load('client');

        return response()->json([
            'success' => true,
            'message' => 'Quotations retrieved successfully.',
            'data' => QuotationResource::collection($quotations)
        ]);
    }

    public function store(StoreQuotationRequest $request): JsonResponse
    {
        $quotation = $this->quotationService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Quotation created successfully.',
            'data' => new QuotationResource($quotation)
        ], 201);
    }

    public function show(Quotation $quotation): JsonResponse
    {
        Gate::authorize('view', $quotation);
        $quotation->load(['client', 'contract']);

        return response()->json([
            'success' => true,
            'message' => 'Quotation retrieved successfully.',
            'data' => new QuotationResource($quotation)
        ]);
    }

    public function update(UpdateQuotationRequest $request, Quotation $quotation): JsonResponse
    {
        $quotation = $this->quotationService->update($quotation, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Quotation updated successfully.',
            'data' => new QuotationResource($quotation)
        ]);
    }

    public function destroy(Quotation $quotation): JsonResponse
    {
        Gate::authorize('delete', $quotation);

        $this->quotationService->delete($quotation);

        return response()->json([
            'success' => true,
            'message' => 'Quotation deleted successfully.',
            'data' => null
        ]);
    }
}
