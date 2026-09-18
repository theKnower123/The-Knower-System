<?php

namespace App\Modules\HR\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\HR\Requests\StoreDepartmentRequest;
use App\Modules\HR\Requests\UpdateDepartmentRequest;
use App\Http\Resources\HR\DepartmentResource;
use App\Modules\HR\Models\Department;
use App\Modules\HR\Services\DepartmentService;
use Illuminate\Http\JsonResponse;

class DepartmentController extends Controller
{
    protected DepartmentService $departmentService;

    public function __construct(DepartmentService $departmentService)
    {
        $this->departmentService = $departmentService;
    }

    public function index(): JsonResponse
    {
        $departments = $this->departmentService->getAll();
        
        return response()->json([
            'success' => true,
            'message' => 'Departments retrieved successfully.',
            'data' => DepartmentResource::collection($departments)
        ]);
    }

    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $department = $this->departmentService->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Department created successfully.',
            'data' => new DepartmentResource($department)
        ], 201);
    }

    public function show(Department $department): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Department retrieved successfully.',
            'data' => new DepartmentResource($department)
        ]);
    }

    public function update(UpdateDepartmentRequest $request, Department $department): JsonResponse
    {
        $department = $this->departmentService->update($department, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Department updated successfully.',
            'data' => new DepartmentResource($department)
        ]);
    }

    public function destroy(Department $department): JsonResponse
    {
        $this->departmentService->delete($department);

        return response()->json([
            'success' => true,
            'message' => 'Department deleted successfully.',
            'data' => null
        ]);
    }
}
