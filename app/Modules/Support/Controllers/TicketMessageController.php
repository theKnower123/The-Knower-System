<?php

namespace App\Modules\Support\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Support\Requests\StoreTicketMessageRequest;
use App\Modules\Support\Requests\UpdateTicketMessageRequest;
use App\Http\Resources\Support\TicketMessageResource;
use App\Modules\Support\Models\TicketMessage;
use App\Modules\Support\Services\TicketMessageService;
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
        $ticketmessage = $this->ticketmessageService->create($request->all());

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
        $ticketmessage = $this->ticketmessageService->update($ticketmessage, $request->all());

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
