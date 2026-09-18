<?php

namespace App\Modules\HR\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\HR\Requests\StoreLeaveRequest;
use App\Modules\HR\Requests\UpdateLeaveRequest;
use App\Http\Resources\HR\LeaveResource;
use App\Modules\HR\Models\Leave;
use App\Modules\HR\Services\LeaveService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class LeaveController extends Controller
{
    protected LeaveService $leaveService;

    public function __construct(LeaveService $leaveService)
    {
        $this->leaveService = $leaveService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Leave::class);

        $leaves = $this->leaveService->getAll();
        
        // Load relations if needed
        $leaves->load('employee.user');

        return response()->json([
            'success' => true,
            'message' => 'Leaves retrieved successfully.',
            'data' => LeaveResource::collection($leaves)
        ]);
    }

    public function store(StoreLeaveRequest $request): JsonResponse
    {
        $leave = $this->leaveService->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Leave created successfully.',
            'data' => new LeaveResource($leave)
        ], 201);
    }

    public function show(Leave $leave): JsonResponse
    {
        Gate::authorize('view', $leave);

        return response()->json([
            'success' => true,
            'message' => 'Leave retrieved successfully.',
            'data' => new LeaveResource($leave)
        ]);
    }

    public function update(UpdateLeaveRequest $request, Leave $leave): JsonResponse
    {
        $leave = $this->leaveService->update($leave, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Leave updated successfully.',
            'data' => new LeaveResource($leave)
        ]);
    }

    public function destroy(Leave $leave): JsonResponse
    {
        Gate::authorize('delete', $leave);

        $this->leaveService->delete($leave);

        return response()->json([
            'success' => true,
            'message' => 'Leave deleted successfully.',
            'data' => null
        ]);
    }
}
