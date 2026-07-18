<?php

namespace App\Modules\HR\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\HR\Requests\StoreJobApplicationRequest;
use App\Modules\HR\Requests\UpdateJobApplicationRequest;
use App\Http\Resources\HR\JobApplicationResource;
use App\Modules\HR\Models\JobApplication;
use App\Modules\HR\Services\JobApplicationService;
use Illuminate\Http\JsonResponse;

class JobApplicationController extends Controller
{
    protected JobApplicationService $service;

    public function __construct(JobApplicationService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        $applications = $this->service->getAll();
        return response()->json([
            'success' => true,
            'data' => JobApplicationResource::collection($applications)
        ]);
    }

    public function store(StoreJobApplicationRequest $request): JsonResponse
    {
        // Public endpoint to submit an application
        $data = $request->validated();
        $resume = $request->file('resume');
        
        $application = $this->service->create($data, $resume);
        
        return response()->json([
            'success' => true,
            'message' => 'Application submitted successfully.',
            'data' => new JobApplicationResource($application)
        ], 201);
    }

    public function show(JobApplication $application): JsonResponse
    {
        $application->load('jobPosting');
        return response()->json([
            'success' => true,
            'data' => new JobApplicationResource($application)
        ]);
    }

    public function update(UpdateJobApplicationRequest $request, JobApplication $application): JsonResponse
    {
        // For HR to update status/notes
        $application = $this->service->update($application, $request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Application updated successfully.',
            'data' => new JobApplicationResource($application)
        ]);
    }

    public function destroy(JobApplication $application): JsonResponse
    {
        $this->service->delete($application);
        return response()->json([
            'success' => true,
            'message' => 'Application deleted successfully.'
        ]);
    }
}
