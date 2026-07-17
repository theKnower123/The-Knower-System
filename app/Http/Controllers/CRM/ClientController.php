<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Http\Requests\CRM\StoreClientRequest;
use App\Http\Requests\CRM\UpdateClientRequest;
use App\Http\Resources\CRM\ClientResource;
use App\Models\Client;
use App\Services\CRM\ClientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ClientController extends Controller
{
    protected ClientService $clientService;

    public function __construct(ClientService $clientService)
    {
        $this->clientService = $clientService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Client::class);

        $clients = $this->clientService->getAll();
        
        // Load relations if needed
        $clients->load('company');

        return response()->json([
            'success' => true,
            'message' => 'Clients retrieved successfully.',
            'data' => ClientResource::collection($clients)
        ]);
    }

    public function store(StoreClientRequest $request): JsonResponse
    {
        $client = $this->clientService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Client created successfully.',
            'data' => new ClientResource($client)
        ], 201);
    }

    public function show(Client $client): JsonResponse
    {
        Gate::authorize('view', $client);
        $client->load(['company', 'projects', 'invoices', 'tickets']);

        return response()->json([
            'success' => true,
            'message' => 'Client retrieved successfully.',
            'data' => new ClientResource($client)
        ]);
    }

    public function update(UpdateClientRequest $request, Client $client): JsonResponse
    {
        $client = $this->clientService->update($client, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Client updated successfully.',
            'data' => new ClientResource($client)
        ]);
    }

    public function destroy(Client $client): JsonResponse
    {
        Gate::authorize('delete', $client);

        $this->clientService->delete($client);

        return response()->json([
            'success' => true,
            'message' => 'Client deleted successfully.',
            'data' => null
        ]);
    }
}
