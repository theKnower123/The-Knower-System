<?php

namespace App\Modules\GraduationProjects\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\GraduationProjects\GraduationProjectResource;
use App\Modules\CMS\Models\Testimonial;
use App\Modules\GraduationProjects\Models\GraduationProject;
use App\Modules\GraduationProjects\Requests\RegisterGraduationProjectRequest;
use App\Modules\GraduationProjects\Services\GraduationProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicGraduationProjectController extends Controller
{
    public function __construct(protected GraduationProjectService $service)
    {
    }

    public function showcase(Request $request): JsonResponse
    {
        $query = GraduationProject::query()
            ->where('is_showcased', true)
            ->where('status', 'delivered')
            ->latest();

        if ($request->filled('project_type') && in_array($request->project_type, ['hardware', 'software'], true)) {
            $query->where('project_type', $request->project_type);
        }

        $items = $query->get()->map(fn (GraduationProject $gp) => [
            'id' => (string) $gp->id,
            'referenceId' => $gp->reference_id,
            'teamName' => $gp->team_name,
            'university' => $gp->university,
            'college' => $gp->college,
            'projectType' => is_object($gp->project_type) ? $gp->project_type->value : $gp->project_type,
            'description' => $gp->description,
            'outcome' => is_object($gp->outcome) ? $gp->outcome?->value : $gp->outcome,
        ]);

        return response()->json(['success' => true, 'data' => $items]);
    }

    public function testimonials(): JsonResponse
    {
        $items = Testimonial::query()
            ->where('source', 'graduation_project')
            ->where('is_published', true)
            ->latest()
            ->get()
            ->map(fn (Testimonial $t) => [
                'id' => (string) $t->id,
                'name' => $t->client_name ?? $t->name,
                'role' => $t->role,
                'company' => $t->company,
                'quote' => $t->quote,
                'rating' => $t->rating ?? null,
            ]);

        return response()->json(['success' => true, 'data' => $items]);
    }

    public function register(RegisterGraduationProjectRequest $request): JsonResponse
    {
        $data = $request->validated();
        $members = $request->input('members', []);
        if (is_string($members)) {
            $members = json_decode($members, true) ?? [];
        }
        $data['members'] = is_array($members) ? $members : [];

        $project = $this->service->register($data, $request->file('brief_attachment'));

        return response()->json([
            'success' => true,
            'message' => 'Graduation project submitted successfully.',
            'data' => [
                'id' => (string) $project->id,
                'referenceId' => $project->reference_id,
                'teamName' => $project->team_name,
                'status' => is_object($project->status) ? $project->status->value : $project->status,
            ],
        ], 201);
    }
}
