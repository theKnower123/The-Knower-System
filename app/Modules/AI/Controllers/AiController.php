<?php

namespace App\Modules\AI\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Models\Task;
use App\Modules\Support\Models\Ticket;
use Illuminate\Http\Request;

class AiController extends Controller
{
    /**
     * Generic AI chat — placeholder for OpenAI / Gemini integration.
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        // TODO: Integrate with OpenAI / Gemini API
        return response()->json([
            'success' => true,
            'message' => 'AI response generated.',
            'data' => [
                'reply' => 'This is a placeholder AI reply. Connect an LLM API to enable real responses.',
            ]
        ]);
    }

    /**
     * Generate a professional quotation draft based on requirements.
     */
    public function generateQuotation(Request $request)
    {
        $request->validate([
            'client_name'   => 'required|string',
            'project_type'  => 'required|string',
            'requirements'  => 'required|string',
        ]);

        // TODO: Integrate with LLM to produce a dynamic quotation
        return response()->json([
            'success' => true,
            'message' => 'Quotation draft generated.',
            'data' => [
                'draft' => "Dear {$request->client_name},\n\nWe are pleased to submit our quotation for your {$request->project_type} project based on the following requirements:\n\n{$request->requirements}\n\nWe look forward to your feedback.",
            ]
        ]);
    }

    /**
     * Suggest task breakdown for a project description.
     */
    public function generateTasks(Request $request)
    {
        $request->validate([
            'project_name' => 'required|string',
            'description'  => 'required|string',
        ]);

        // TODO: Integrate with LLM for dynamic task generation
        $suggestions = [
            'Discovery & Requirements Gathering',
            'UI/UX Wireframing',
            'Database Design',
            'Backend API Development',
            'Frontend Development',
            'Integration & Testing',
            'Deployment & Launch',
            'Client Handover & Documentation',
        ];

        return response()->json([
            'success' => true,
            'message' => 'Task suggestions generated.',
            'data'    => ['suggested_tasks' => $suggestions],
        ]);
    }

    /**
     * Generate a project summary from its data.
     */
    public function projectSummary(Request $request)
    {
        $request->validate(['project_id' => 'required|exists:projects,id']);

        $project = Project::with(['client', 'tasks', 'milestones', 'bugs'])->findOrFail($request->project_id);

        $summary = [
            'project'         => $project->name,
            'client'          => $project->client?->name,
            'status'          => $project->status,
            'progress'        => $project->progress . '%',
            'total_tasks'     => $project->tasks->count(),
            'completed_tasks' => $project->tasks->where('status', 'done')->count(),
            'open_bugs'       => $project->bugs->whereIn('status', ['open','in_progress'])->count(),
            'milestones'      => $project->milestones->count(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Project summary generated.',
            'data'    => $summary,
        ]);
    }

    /**
     * Analyze a bug and suggest potential causes.
     */
    public function analyzeBug(Request $request)
    {
        $request->validate([
            'description'       => 'required|string',
            'steps_to_reproduce'=> 'nullable|string',
        ]);

        // TODO: Integrate with LLM for smart analysis
        return response()->json([
            'success' => true,
            'message' => 'Bug analysis complete.',
            'data' => [
                'potential_causes' => [
                    'Null reference or undefined variable.',
                    'Unexpected input format or missing validation.',
                    'Race condition or async timing issue.',
                    'Missing environment variable or configuration.',
                ],
                'suggested_fix' => 'Add proper null checks and validate inputs before processing. Check logs for stack traces.',
            ]
        ]);
    }

    /**
     * Summarize a support ticket for quick triage.
     */
    public function summarizeTicket(Request $request)
    {
        $request->validate(['ticket_id' => 'required|exists:tickets,id']);

        $ticket = Ticket::with(['client', 'messages'])->findOrFail($request->ticket_id);

        $summary = [
            'subject'        => $ticket->subject,
            'client'         => $ticket->client?->name,
            'status'         => $ticket->status,
            'priority'       => $ticket->priority,
            'message_count'  => $ticket->messages->count(),
            'last_message'   => $ticket->messages->last()?->message,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Ticket summary generated.',
            'data'    => $summary,
        ]);
    }
}
