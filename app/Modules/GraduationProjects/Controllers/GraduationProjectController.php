<?php

namespace App\Modules\GraduationProjects\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\GraduationProjects\GraduationProjectResource;
use App\Modules\GraduationProjects\Models\GraduationProject;
use App\Modules\GraduationProjects\Requests\ApproveGraduationProjectRequest;
use App\Modules\GraduationProjects\Requests\DeliverGraduationProjectRequest;
use App\Modules\GraduationProjects\Requests\OutcomeGraduationProjectRequest;
use App\Modules\GraduationProjects\Requests\QuoteGraduationProjectRequest;
use App\Modules\GraduationProjects\Requests\RejectGraduationProjectRequest;
use App\Modules\GraduationProjects\Services\GraduationProjectService;
use App\Modules\Projects\Models\Milestone;
use App\Modules\Projects\Services\MilestoneService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class GraduationProjectController extends Controller
{
    public function __construct(
        protected GraduationProjectService $service,
        protected MilestoneService $milestoneService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', GraduationProject::class);

        $query = GraduationProject::query()->with(['members'])->latest();

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->filled('project_type')) {
            $query->where('project_type', $request->project_type);
        }
        if ($request->filled('service_type')) {
            $query->where('service_type', $request->service_type);
        }
        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where(function ($q) use ($s) {
                $q->where('team_name', 'like', $s)
                    ->orWhere('university', 'like', $s)
                    ->orWhere('college', 'like', $s)
                    ->orWhere('reference_id', 'like', $s)
                    ->orWhere('primary_contact_name', 'like', $s)
                    ->orWhere('primary_contact_phone', 'like', $s)
                    ->orWhere('primary_contact_email', 'like', $s);
            });
        }

        $paginator = $query->paginate(min((int) $request->get('per_page', 25), 100));

        return response()->json([
            'success' => true,
            'data' => GraduationProjectResource::collection($paginator->getCollection())->resolve(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function show(GraduationProject $graduation_project): JsonResponse
    {
        Gate::authorize('view', $graduation_project);

        $graduation_project->load(['members', 'linkedProject.milestones', 'client', 'depositInvoice', 'finalInvoice']);

        return response()->json([
            'success' => true,
            'data' => new GraduationProjectResource($graduation_project),
        ]);
    }

    public function quote(QuoteGraduationProjectRequest $request, GraduationProject $graduation_project): JsonResponse
    {
        $project = $this->service->quote($graduation_project, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Quotation sent.',
            'data' => new GraduationProjectResource($project),
        ]);
    }

    public function reject(RejectGraduationProjectRequest $request, GraduationProject $graduation_project): JsonResponse
    {
        $project = $this->service->reject($graduation_project, $request->validated()['rejection_reason'] ?? null);

        return response()->json([
            'success' => true,
            'message' => 'Submission rejected.',
            'data' => new GraduationProjectResource($project),
        ]);
    }

    public function approve(ApproveGraduationProjectRequest $request, GraduationProject $graduation_project): JsonResponse
    {
        $project = $this->service->startExecution(
            $graduation_project,
            (float) $request->validated()['deposit_amount']
        );

        return response()->json([
            'success' => true,
            'message' => 'Project started.',
            'data' => new GraduationProjectResource($project),
        ]);
    }

    public function deliver(DeliverGraduationProjectRequest $request, GraduationProject $graduation_project): JsonResponse
    {
        $project = $this->service->deliver(
            $graduation_project,
            $request->validated(),
            $request->file('files', []) ?: []
        );

        return response()->json([
            'success' => true,
            'message' => 'Project marked as delivered.',
            'data' => new GraduationProjectResource($project),
        ]);
    }

    public function outcome(OutcomeGraduationProjectRequest $request, GraduationProject $graduation_project): JsonResponse
    {
        $project = $this->service->updateOutcome($graduation_project, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Outcome updated.',
            'data' => new GraduationProjectResource($project),
        ]);
    }

    public function storeTestimonial(Request $request, GraduationProject $graduation_project): JsonResponse
    {
        Gate::authorize('update', $graduation_project);

        $data = $request->validate([
            'quote' => ['required', 'string', 'max:5000'],
            'name' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $testimonial = $this->service->createTestimonial($graduation_project, $data);

        return response()->json([
            'success' => true,
            'message' => 'Testimonial created.',
            'data' => $testimonial,
        ], 201);
    }

    public function addMember(Request $request, GraduationProject $graduation_project): JsonResponse
    {
        Gate::authorize('update', $graduation_project);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:255'],
            'role_in_team' => ['nullable', 'string', 'max:100'],
        ]);

        $member = $this->service->addMember($graduation_project, $data);

        return response()->json([
            'success' => true,
            'data' => $member,
        ], 201);
    }

    public function updateMilestone(Request $request, GraduationProject $graduation_project, Milestone $milestone): JsonResponse
    {
        Gate::authorize('update', $graduation_project);

        if ((int) $milestone->project_id !== (int) $graduation_project->linked_project_id) {
            abort(404);
        }

        $data = $request->validate([
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed'])],
            'progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'deadline' => ['nullable', 'date'],
        ]);

        if ($data['status'] === 'completed') {
            $data['completed_at'] = now();
            $data['progress'] = $data['progress'] ?? 100;
        } elseif (($milestone->status === 'completed' || $milestone->completed_at) && $data['status'] !== 'completed') {
            $data['completed_at'] = null;
        }

        $milestone = $this->milestoneService->update($milestone, $data);

        return response()->json([
            'success' => true,
            'data' => $milestone,
        ]);
    }
}
