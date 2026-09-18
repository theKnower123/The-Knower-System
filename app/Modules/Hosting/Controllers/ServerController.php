<?php

namespace App\Modules\Hosting\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Hosting\Requests\StoreServerRequest;
use App\Modules\Hosting\Requests\UpdateServerRequest;
use App\Http\Resources\Hosting\ServerResource;
use App\Modules\Hosting\Models\Server;
use App\Modules\Hosting\Services\ServerService;
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
        $server = $this->serverService->create($request->all());

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
        $server = $this->serverService->update($server, $request->all());

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
