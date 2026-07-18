<?php
namespace App\Modules\CRM\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CRM\Services\QuotationService;
use App\Modules\CRM\Requests\StoreQuotationRequest;
use App\Modules\CRM\Requests\UpdateQuotationRequest;
use App\Http\Resources\CRM\QuotationResource;
use App\Modules\CRM\Models\Quotation;
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
        return response()->json([
            'success' => true,
            'data' => QuotationResource::collection($this->quotationService->getAll())
        ]);
    }

    public function store(StoreQuotationRequest $request): JsonResponse
    {
        Gate::authorize('create', Quotation::class);
        $quotation = $this->quotationService->create($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Quotation created successfully',
            'data' => new QuotationResource($quotation)
        ], 201);
    }

    public function show(Quotation $quotation): JsonResponse
    {
        Gate::authorize('view', $quotation);
        return response()->json([
            'success' => true,
            'data' => new QuotationResource($quotation->load(['contact', 'lead', 'historyVersions']))
        ]);
    }

    public function update(UpdateQuotationRequest $request, Quotation $quotation): JsonResponse
    {
        Gate::authorize('update', $quotation);
        $quotation = $this->quotationService->update($quotation, $request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Quotation updated successfully',
            'data' => new QuotationResource($quotation)
        ]);
    }

    public function destroy(Quotation $quotation): JsonResponse
    {
        Gate::authorize('delete', $quotation);
        $this->quotationService->delete($quotation);
        return response()->json(['success' => true, 'message' => 'Quotation deleted successfully']);
    }
}
