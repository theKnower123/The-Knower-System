<?php

namespace App\Http\Controllers\Hosting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hosting\StoreServerRequest;
use App\Http\Requests\Hosting\UpdateServerRequest;
use App\Http\Resources\Hosting\ServerResource;
use App\Models\Server;
use App\Services\Hosting\ServerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ServerController extends Controller
{
    protected ServerService $serverService;

    public function __construct(ServerService $serverService)
    {
        $this->serverService = $serverService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Server::class);

        $servers = $this->serverService->getAll();
        
        // Load relations if needed
        $servers->load('hostingAccounts.client');

        return response()->json([
            'success' => true,
            'message' => 'Servers retrieved successfully.',
            'data' => ServerResource::collection($servers)
        ]);
    }

    public function store(StoreServerRequest $request): JsonResponse
    {
        $server = $this->serverService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Server created successfully.',
            'data' => new ServerResource($server)
        ], 201);
    }

    public function show(Server $server): JsonResponse
    {
        Gate::authorize('view', $server);

        return response()->json([
            'success' => true,
            'message' => 'Server retrieved successfully.',
            'data' => new ServerResource($server)
        ]);
    }

    public function update(UpdateServerRequest $request, Server $server): JsonResponse
    {
        $server = $this->serverService->update($server, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Server updated successfully.',
            'data' => new ServerResource($server)
        ]);
    }

    public function destroy(Server $server): JsonResponse
    {
        Gate::authorize('delete', $server);

        $this->serverService->delete($server);

        return response()->json([
            'success' => true,
            'message' => 'Server deleted successfully.',
            'data' => null
        ]);
    }
}
