<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use App\Http\Requests\Support\StoreTicketMessageRequest;
use App\Http\Requests\Support\UpdateTicketMessageRequest;
use App\Http\Resources\Support\TicketMessageResource;
use App\Models\TicketMessage;
use App\Services\Support\TicketMessageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class TicketMessageController extends Controller
{
    protected TicketMessageService $ticketmessageService;

    public function __construct(TicketMessageService $ticketmessageService)
    {
        $this->ticketmessageService = $ticketmessageService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', TicketMessage::class);

        $ticketmessages = $this->ticketmessageService->getAll();
        
        // Load relations if needed
        $ticketmessages->load(['ticket', 'sender']);

        return response()->json([
            'success' => true,
            'message' => 'TicketMessages retrieved successfully.',
            'data' => TicketMessageResource::collection($ticketmessages)
        ]);
    }

    public function store(StoreTicketMessageRequest $request): JsonResponse
    {
        $ticketmessage = $this->ticketmessageService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'TicketMessage created successfully.',
            'data' => new TicketMessageResource($ticketmessage)
        ], 201);
    }

    public function show(TicketMessage $ticketmessage): JsonResponse
    {
        Gate::authorize('view', $ticketmessage);

        return response()->json([
            'success' => true,
            'message' => 'TicketMessage retrieved successfully.',
            'data' => new TicketMessageResource($ticketmessage)
        ]);
    }

    public function update(UpdateTicketMessageRequest $request, TicketMessage $ticketmessage): JsonResponse
    {
        $ticketmessage = $this->ticketmessageService->update($ticketmessage, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'TicketMessage updated successfully.',
            'data' => new TicketMessageResource($ticketmessage)
        ]);
    }

    public function destroy(TicketMessage $ticketmessage): JsonResponse
    {
        Gate::authorize('delete', $ticketmessage);

        $this->ticketmessageService->delete($ticketmessage);

        return response()->json([
            'success' => true,
            'message' => 'TicketMessage deleted successfully.',
            'data' => null
        ]);
    }
}
