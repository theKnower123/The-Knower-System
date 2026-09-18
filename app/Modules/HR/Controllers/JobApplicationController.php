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
        \Illuminate\Support\Facades\Gate::authorize('viewAny', JobApplication::class);
        $applications = $this->service->getAll();
        return response()->json([
            'success' => true,
            'data' => JobApplicationResource::collection($applications)
        ]);
    }

    public function store(StoreJobApplicationRequest $request): JsonResponse
    {
        // Public endpoint to submit an application
        $data = $request->all();
        $email = $request->input('email');
        $phone = $request->input('phone');
        $jobPostingId = (int) $request->input('job_posting_id');

        // Prevent duplicate submissions by email or phone for the same job posting
        $existing = $this->service->findExisting($jobPostingId, $email, $phone);
        if ($existing) {
            return response()->json([
                'success' => false,
                'already_submitted' => true,
                'message' => "No, you have already submitted this application before; you can't submit it again.",
                'data' => new JobApplicationResource($existing)
            ], 422);
        }

        $resume = $request->file('resume');
        $application = $this->service->create($data, $resume);
        $application->load('jobPosting');
        
        return response()->json([
            'success' => true,
            'message' => 'Your application has been submitted successfully and is pending review.',
            'data' => new JobApplicationResource($application)
        ], 201);
    }

    public function checkStatus(\Illuminate\Http\Request $request): JsonResponse
    {
        $id = $request->query('id');
        $jobPostingId = $request->query('job_posting_id');
        $email = $request->query('email');
        $phone = $request->query('phone');

        if ($id) {
            $application = JobApplication::withoutGlobalScopes()->with('jobPosting')->find($id);
        } elseif ($jobPostingId && ($email || $phone)) {
            $application = $this->service->findExisting((int) $jobPostingId, $email ?? '', $phone);
        } elseif ($email || $phone) {
            $application = JobApplication::withoutGlobalScopes()
                ->with('jobPosting')
                ->where(function ($q) use ($email, $phone) {
                    if ($email) {
                        $q->where('email', strtolower(trim($email)));
                    }
                    if ($phone) {
                        $q->orWhere('phone', trim($phone));
                    }
                })
                ->latest('id')
                ->first();
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Please provide an application ID, email, or phone number to check status.'
            ], 400);
        }

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'No application found with the provided details.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new JobApplicationResource($application)
        ]);
    }

    public function show(JobApplication $job_application): JsonResponse
    {
        \Illuminate\Support\Facades\Gate::authorize('view', $job_application);
        $job_application->load('jobPosting');
        return response()->json([
            'success' => true,
            'data' => new JobApplicationResource($job_application)
        ]);
    }

    public function update(UpdateJobApplicationRequest $request, JobApplication $job_application): JsonResponse
    {
        // For HR to update status/notes
        $job_application = $this->service->update($job_application, $request->all());
        return response()->json([
            'success' => true,
            'message' => 'Application updated successfully.',
            'data' => new JobApplicationResource($job_application)
        ]);
    }

    public function destroy(JobApplication $job_application): JsonResponse
    {
        \Illuminate\Support\Facades\Gate::authorize('delete', $job_application);
        $this->service->delete($job_application);
        return response()->json([
            'success' => true,
            'message' => 'Application deleted successfully.'
        ]);
    }
}
