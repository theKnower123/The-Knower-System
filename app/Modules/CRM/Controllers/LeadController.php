<?php
namespace App\Modules\CRM\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CRM\Services\LeadService;
use App\Modules\CRM\Requests\StoreLeadRequest;
use App\Modules\CRM\Requests\UpdateLeadRequest;
use App\Http\Resources\CRM\LeadResource;
use App\Modules\CRM\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class LeadController extends Controller
{
    protected LeadService $leadService;

    public function __construct(LeadService $leadService)
    {
        $this->leadService = $leadService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Lead::class);
        return response()->json([
            'success' => true,
            'data' => LeadResource::collection($this->leadService->getAll())
        ]);
    }

    public function store(StoreLeadRequest $request): JsonResponse
    {
        Gate::authorize('create', Lead::class);
        $lead = $this->leadService->create($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Lead created successfully',
            'data' => new LeadResource($lead)
        ], 201);
    }

    public function show(Lead $lead): JsonResponse
    {
        Gate::authorize('view', $lead);
        return response()->json([
            'success' => true,
            'data' => new LeadResource($lead->load(['assignee']))
        ]);
    }

    public function update(UpdateLeadRequest $request, Lead $lead): JsonResponse
    {
        Gate::authorize('update', $lead);
        $lead = $this->leadService->update($lead, $request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Lead updated successfully',
            'data' => new LeadResource($lead)
        ]);
    }

    public function destroy(Lead $lead): JsonResponse
    {
        Gate::authorize('delete', $lead);
        $this->leadService->delete($lead);
        return response()->json(['success' => true, 'message' => 'Lead deleted successfully']);
    }
}
