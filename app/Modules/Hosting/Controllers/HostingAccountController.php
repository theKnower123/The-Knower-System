<?php

namespace App\Modules\Hosting\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Hosting\Requests\StoreHostingAccountRequest;
use App\Modules\Hosting\Requests\UpdateHostingAccountRequest;
use App\Http\Resources\Hosting\HostingAccountResource;
use App\Modules\Hosting\Models\HostingAccount;
use App\Modules\Hosting\Services\HostingAccountService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class HostingAccountController extends Controller
{
    protected HostingAccountService $hostingaccountService;

    public function __construct(HostingAccountService $hostingaccountService)
    {
        $this->hostingaccountService = $hostingaccountService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', HostingAccount::class);

        $hostingaccounts = $this->hostingaccountService->getAll();
        
        // Load relations if needed
        $hostingaccounts->load(['client', 'project', 'server']);

        return response()->json([
            'success' => true,
            'message' => 'HostingAccounts retrieved successfully.',
            'data' => HostingAccountResource::collection($hostingaccounts)
        ]);
    }

    public function store(StoreHostingAccountRequest $request): JsonResponse
    {
        $hostingaccount = $this->hostingaccountService->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'HostingAccount created successfully.',
            'data' => new HostingAccountResource($hostingaccount)
        ], 201);
    }

    public function show(HostingAccount $hostingaccount): JsonResponse
    {
        Gate::authorize('view', $hostingaccount);

        return response()->json([
            'success' => true,
            'message' => 'HostingAccount retrieved successfully.',
            'data' => new HostingAccountResource($hostingaccount)
        ]);
    }

    public function update(UpdateHostingAccountRequest $request, HostingAccount $hostingaccount): JsonResponse
    {
        $hostingaccount = $this->hostingaccountService->update($hostingaccount, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'HostingAccount updated successfully.',
            'data' => new HostingAccountResource($hostingaccount)
        ]);
    }

    public function destroy(HostingAccount $hostingaccount): JsonResponse
    {
        Gate::authorize('delete', $hostingaccount);

        $this->hostingaccountService->delete($hostingaccount);

        return response()->json([
            'success' => true,
            'message' => 'HostingAccount deleted successfully.',
            'data' => null
        ]);
    }
}
