<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Http\Requests\CRM\StoreLeadRequest;
use App\Http\Requests\CRM\UpdateLeadRequest;
use App\Models\Lead;
use App\Services\CRM\LeadService;
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

        $leads = $this->leadService->getAllLeads();

        return response()->json([
            'success' => true,
            'message' => 'Leads retrieved successfully.',
            'data' => $leads
        ]);
    }

    public function store(StoreLeadRequest $request): JsonResponse
    {
        $lead = $this->leadService->createLead($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Lead created successfully.',
            'data' => $lead
        ], 201);
    }

    public function show(Lead $lead): JsonResponse
    {
        Gate::authorize('view', $lead);

        $lead->load('assignee');

        return response()->json([
            'success' => true,
            'message' => 'Lead retrieved successfully.',
            'data' => $lead
        ]);
    }

    public function update(UpdateLeadRequest $request, Lead $lead): JsonResponse
    {
        $lead = $this->leadService->updateLead($lead, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Lead updated successfully.',
            'data' => $lead
        ]);
    }

    public function destroy(Lead $lead): JsonResponse
    {
        Gate::authorize('delete', $lead);

        $this->leadService->deleteLead($lead);

        return response()->json([
            'success' => true,
            'message' => 'Lead deleted successfully.',
            'data' => null
        ]);
    }
}
