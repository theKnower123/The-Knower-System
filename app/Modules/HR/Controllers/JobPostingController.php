<?php

namespace App\Modules\HR\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\HR\Requests\StoreJobPostingRequest;
use App\Modules\HR\Requests\UpdateJobPostingRequest;
use App\Http\Resources\HR\JobPostingResource;
use App\Modules\HR\Models\JobPosting;
use App\Modules\HR\Services\JobPostingService;
use Illuminate\Http\JsonResponse;

class JobPostingController extends Controller
{
    protected JobPostingService $service;

    public function __construct(JobPostingService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        $postings = $this->service->getAll();
        return response()->json([
            'success' => true,
            'data' => JobPostingResource::collection($postings)
        ]);
    }

    public function active(): JsonResponse
    {
        // Public endpoint to get active jobs for the landing page
        $postings = $this->service->getActive();
        return response()->json([
            'success' => true,
            'data' => JobPostingResource::collection($postings)
        ]);
    }

    public function store(StoreJobPostingRequest $request): JsonResponse
    {
        $posting = $this->service->create($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Job posting created successfully.',
            'data' => new JobPostingResource($posting)
        ], 201);
    }

    public function show(JobPosting $job): JsonResponse
    {
        $job->load('department');
        return response()->json([
            'success' => true,
            'data' => new JobPostingResource($job)
        ]);
    }

    public function update(UpdateJobPostingRequest $request, JobPosting $job): JsonResponse
    {
        $job = $this->service->update($job, $request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Job posting updated successfully.',
            'data' => new JobPostingResource($job)
        ]);
    }

    public function destroy(JobPosting $job): JsonResponse
    {
        $this->service->delete($job);
        return response()->json([
            'success' => true,
            'message' => 'Job posting deleted successfully.'
        ]);
    }
}
