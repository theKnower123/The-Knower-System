<?php

namespace App\Modules\HR\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\HR\Requests\StoreEmployeeRequest;
use App\Modules\HR\Requests\UpdateEmployeeRequest;
use App\Http\Resources\HR\EmployeeResource;
use App\Modules\HR\Models\Employee;
use App\Modules\HR\Services\EmployeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class EmployeeController extends Controller
{
    protected EmployeeService $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Employee::class);

        $employees = $this->employeeService->getAll();
        
        // Load relations if needed
        $employees->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Employees retrieved successfully.',
            'data' => EmployeeResource::collection($employees)
        ]);
    }

    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $employee = $this->employeeService->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Employee created successfully.',
            'data' => new EmployeeResource($employee)
        ], 201);
    }

    public function show(Employee $employee): JsonResponse
    {
        Gate::authorize('view', $employee);
        $employee->load(['user', 'attendances', 'leaves']);

        return response()->json([
            'success' => true,
            'message' => 'Employee retrieved successfully.',
            'data' => new EmployeeResource($employee)
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): JsonResponse
    {
        $employee = $this->employeeService->update($employee, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Employee updated successfully.',
            'data' => new EmployeeResource($employee)
        ]);
    }

    public function destroy(Employee $employee): JsonResponse
    {
        Gate::authorize('delete', $employee);

        $this->employeeService->delete($employee);

        return response()->json([
            'success' => true,
            'message' => 'Employee deleted successfully.',
            'data' => null
        ]);
    }
}
