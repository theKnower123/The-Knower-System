<?php

namespace App\Modules\HR\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\HR\Requests\StoreAttendanceRequest;
use App\Modules\HR\Requests\UpdateAttendanceRequest;
use App\Http\Resources\HR\AttendanceResource;
use App\Modules\HR\Models\Attendance;
use App\Modules\HR\Services\AttendanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class AttendanceController extends Controller
{
    protected AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Attendance::class);

        $attendances = $this->attendanceService->getAll();
        
        // Load relations if needed
        $attendances->load('employee.user');

        return response()->json([
            'success' => true,
            'message' => 'Attendances retrieved successfully.',
            'data' => AttendanceResource::collection($attendances)
        ]);
    }

    public function store(StoreAttendanceRequest $request): JsonResponse
    {
        $attendance = $this->attendanceService->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Attendance created successfully.',
            'data' => new AttendanceResource($attendance)
        ], 201);
    }

    public function show(Attendance $attendance): JsonResponse
    {
        Gate::authorize('view', $attendance);

        return response()->json([
            'success' => true,
            'message' => 'Attendance retrieved successfully.',
            'data' => new AttendanceResource($attendance)
        ]);
    }

    public function update(UpdateAttendanceRequest $request, Attendance $attendance): JsonResponse
    {
        $attendance = $this->attendanceService->update($attendance, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Attendance updated successfully.',
            'data' => new AttendanceResource($attendance)
        ]);
    }

    public function destroy(Attendance $attendance): JsonResponse
    {
        Gate::authorize('delete', $attendance);

        $this->attendanceService->delete($attendance);

        return response()->json([
            'success' => true,
            'message' => 'Attendance deleted successfully.',
            'data' => null
        ]);
    }
}
