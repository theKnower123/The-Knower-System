<?php

namespace App\Modules\Support\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Support\Requests\StoreTicketRequest;
use App\Modules\Support\Requests\UpdateTicketRequest;
use App\Http\Resources\Support\TicketResource;
use App\Modules\Support\Models\Ticket;
use App\Modules\Support\Services\TicketService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class TicketController extends Controller
{
    protected TicketService $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Ticket::class);

        $tickets = $this->ticketService->getAll();
        
        // Load relations if needed
        $tickets->load(['client', 'project', 'assignee']);

        return response()->json([
            'success' => true,
            'message' => 'Tickets retrieved successfully.',
            'data' => TicketResource::collection($tickets)
        ]);
    }

    public function store(StoreTicketRequest $request): JsonResponse
    {
        $ticket = $this->ticketService->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Ticket created successfully.',
            'data' => new TicketResource($ticket)
        ], 201);
    }

    public function show(Ticket $ticket): JsonResponse
    {
        Gate::authorize('view', $ticket);
        $ticket->load(['client', 'project', 'assignee', 'messages.sender']);

        return response()->json([
            'success' => true,
            'message' => 'Ticket retrieved successfully.',
            'data' => new TicketResource($ticket)
        ]);
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket): JsonResponse
    {
        $ticket = $this->ticketService->update($ticket, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Ticket updated successfully.',
            'data' => new TicketResource($ticket)
        ]);
    }

    public function destroy(Ticket $ticket): JsonResponse
    {
        Gate::authorize('delete', $ticket);

        $this->ticketService->delete($ticket);

        return response()->json([
            'success' => true,
            'message' => 'Ticket deleted successfully.',
            'data' => null
        ]);
    }
}
