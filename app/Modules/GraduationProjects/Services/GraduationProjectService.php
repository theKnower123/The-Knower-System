<?php

namespace App\Modules\GraduationProjects\Services;

use App\Enums\GraduationProjectStatus;
use App\Mail\GraduationProjectQuoted;
use App\Modules\CMS\Models\Testimonial;
use App\Modules\CRM\Models\Client;
use App\Modules\Finance\Services\InvoiceService;
use App\Modules\GraduationProjects\Models\GraduationProject;
use App\Modules\GraduationProjects\Models\GraduationProjectMember;
use App\Modules\Projects\Services\FileService;
use App\Modules\Projects\Services\MilestoneService;
use App\Modules\Projects\Services\ProjectService;
use App\Services\SystemNotificationService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class GraduationProjectService
{
    public function __construct(
        protected ProjectService $projectService,
        protected MilestoneService $milestoneService,
        protected InvoiceService $invoiceService,
        protected FileService $fileService,
    ) {}

    public static function generateReferenceId(): string
    {
        do {
            $ref = 'GP-' . now()->format('Ymd') . '-' . strtoupper(Str::random(4));
        } while (GraduationProject::where('reference_id', $ref)->exists());

        return $ref;
    }

    public function register(array $data, ?UploadedFile $brief = null): GraduationProject
    {
        return DB::transaction(function () use ($data, $brief) {
            $attachmentPath = null;
            if ($brief) {
                $attachmentPath = $brief->store('graduation-projects/briefs', 'public');
            }

            $project = GraduationProject::create([
                'workspace_id' => $data['workspace_id'] ?? 1,
                'reference_id' => self::generateReferenceId(),
                'team_name' => $data['team_name'],
                'university' => $data['university'],
                'college' => $data['college'],
                'team_size' => (int) ($data['team_size'] ?? 1),
                'description' => $data['description'] ?? null,
                'deadline' => $data['deadline'] ?? null,
                'brief_attachment_path' => $attachmentPath,
                'project_type' => $data['project_type'],
                'service_type' => $data['service_type'],
                'status' => GraduationProjectStatus::PENDING_REVIEW,
                'primary_contact_name' => $data['primary_contact_name'],
                'primary_contact_phone' => $data['primary_contact_phone'],
                'primary_contact_email' => $data['primary_contact_email'],
            ]);

            GraduationProjectMember::create([
                'graduation_project_id' => $project->id,
                'name' => $data['primary_contact_name'],
                'phone' => $data['primary_contact_phone'],
                'email' => $data['primary_contact_email'],
                'role_in_team' => $data['primary_contact_role'] ?? 'Primary Contact',
                'is_primary' => true,
            ]);

            foreach ($data['members'] ?? [] as $member) {
                if (empty($member['name'])) {
                    continue;
                }
                GraduationProjectMember::create([
                    'graduation_project_id' => $project->id,
                    'name' => $member['name'],
                    'phone' => $member['phone'] ?? null,
                    'email' => $member['email'] ?? null,
                    'role_in_team' => $member['role_in_team'] ?? null,
                    'is_primary' => false,
                ]);
            }

            SystemNotificationService::notifySuperAdmins(
                "New Graduation Project: {$project->team_name}",
                "Submission {$project->reference_id} from {$project->university} awaits review.",
                'graduation_projects',
                "/admin/graduation-projects/{$project->id}",
                [
                    'template_key' => 'graduation_project_registered',
                    'reference_id' => $project->reference_id,
                    'team_name' => $project->team_name,
                    'university' => $project->university,
                    'college' => $project->college,
                    'team_size' => (string) $project->team_size,
                    'project_type' => is_object($project->project_type) ? $project->project_type->value : (string) $project->project_type,
                    'service_type' => is_object($project->service_type) ? $project->service_type->value : (string) $project->service_type,
                    'primary_contact_name' => $project->primary_contact_name,
                    'primary_contact_phone' => $project->primary_contact_phone,
                    'primary_contact_email' => $project->primary_contact_email,
                    'description' => $project->description ?: 'لا يوجد وصف إضافي',
                    'project_url' => url("/admin/graduation-projects/{$project->id}"),
                ]
            );

            \App\Modules\Telegram\Services\TelegramService::notifyAdmins(
                'graduation_project_registered',
                [
                    'reference_id' => $project->reference_id,
                    'team_name' => $project->team_name,
                    'university' => $project->university,
                    'college' => $project->college,
                    'team_size' => (string) $project->team_size,
                    'project_type' => is_object($project->project_type) ? $project->project_type->value : (string) $project->project_type,
                    'service_type' => is_object($project->service_type) ? $project->service_type->value : (string) $project->service_type,
                    'primary_contact_name' => $project->primary_contact_name,
                    'primary_contact_phone' => $project->primary_contact_phone,
                    'primary_contact_email' => $project->primary_contact_email,
                    'description' => $project->description ?: 'لا يوجد وصف إضافي',
                    'project_url' => url("/admin/graduation-projects/{$project->id}"),
                ]
            );

            return $project->load('members');
        });
    }

    public function quote(GraduationProject $project, array $data): GraduationProject
    {
        $project->update([
            'quoted_price' => $data['quoted_price'],
            'final_service_type' => $data['final_service_type'] ?? $project->final_service_type,
            'status' => GraduationProjectStatus::QUOTED,
        ]);

        try {
            Mail::to($project->primary_contact_email)->send(new GraduationProjectQuoted($project->fresh()));
        } catch (\Throwable $e) {
            \Log::warning('GraduationProjectQuoted mail failed: ' . $e->getMessage());
        }

        return $project->fresh(['members', 'linkedProject', 'client', 'depositInvoice', 'finalInvoice']);
    }

    public function reject(GraduationProject $project, ?string $reason = null): GraduationProject
    {
        $project->update([
            'status' => GraduationProjectStatus::REJECTED,
            'rejection_reason' => $reason,
        ]);

        return $project->fresh(['members']);
    }

    public function startExecution(GraduationProject $project, float $depositAmount): GraduationProject
    {
        return DB::transaction(function () use ($project, $depositAmount) {
            if (!$project->client_id) {
                $client = Client::create([
                    'workspace_id' => $project->workspace_id ?? 1,
                    'name' => $project->team_name,
                    'email' => $project->primary_contact_email,
                    'phone' => $project->primary_contact_phone,
                    'position' => 'Graduation Project Team',
                    'status' => 'active',
                ]);
                $project->client_id = $client->id;
            }

            $linked = $this->projectService->create([
                'workspace_id' => $project->workspace_id ?? 1,
                'client_id' => $project->client_id,
                'name' => "GP: {$project->team_name}",
                'description' => $project->description,
                'type' => $project->project_type?->value === 'hardware' ? 'Embedded/IoT' : 'Software/Mobile',
                'status' => 'in_progress',
                'priority' => 'medium',
                'start_date' => now()->toDateString(),
                'deadline' => $project->deadline?->toDateString(),
                'budget' => $project->quoted_price,
                'created_by' => auth()->id(),
                'is_graduation_project' => true,
                'is_public' => false,
            ]);

            $project->linked_project_id = $linked->id;

            $milestoneTitles = [
                'Requirements Analysis',
                'Design (UI / Circuit & Schematic)',
                'Implementation & Coding',
                'Testing & Quality Assurance',
                'Documentation & Report',
                'Final Delivery & Defense Prep',
            ];

            foreach ($milestoneTitles as $title) {
                $this->milestoneService->create([
                    'workspace_id' => $project->workspace_id ?? 1,
                    'project_id' => $linked->id,
                    'title' => $title,
                    'status' => 'pending',
                    'progress' => 0,
                ]);
            }

            $invoice = $this->invoiceService->create([
                'workspace_id' => $project->workspace_id ?? 1,
                'client_id' => $project->client_id,
                'project_id' => $linked->id,
                'amount' => $depositAmount,
                'paid_amount' => 0,
                'currency' => 'EGP',
                'status' => 'sent',
                'due_date' => now()->addDays(14)->toDateString(),
                'notes' => 'Graduation deposit',
            ]);

            $project->deposit_invoice_id = $invoice->id;
            $project->status = GraduationProjectStatus::IN_PROGRESS;
            $project->save();

            return $project->fresh(['members', 'linkedProject.milestones', 'client', 'depositInvoice', 'finalInvoice']);
        });
    }

    public function deliver(GraduationProject $project, array $data, array $uploadedFiles = []): GraduationProject
    {
        return DB::transaction(function () use ($project, $data, $uploadedFiles) {
            if ($project->linked_project_id && !empty($uploadedFiles)) {
                foreach ($uploadedFiles as $file) {
                    if (!$file instanceof UploadedFile) {
                        continue;
                    }
                    $path = $file->store('projects/' . $project->linked_project_id . '/files', 'public');
                    $this->fileService->create([
                        'workspace_id' => $project->workspace_id ?? 1,
                        'project_id' => $project->linked_project_id,
                        'uploaded_by' => auth()->id(),
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'size' => $file->getSize(),
                        'type' => $file->getClientMimeType(),
                    ]);
                }
            }

            $finalAmount = $data['final_amount'] ?? null;
            if ($finalAmount !== null && $finalAmount !== '' && $project->client_id && $project->linked_project_id) {
                $invoice = $this->invoiceService->create([
                    'workspace_id' => $project->workspace_id ?? 1,
                    'client_id' => $project->client_id,
                    'project_id' => $project->linked_project_id,
                    'amount' => $finalAmount,
                    'paid_amount' => 0,
                    'currency' => 'EGP',
                    'status' => 'sent',
                    'due_date' => now()->addDays(14)->toDateString(),
                    'notes' => 'Graduation final payment',
                ]);
                $project->final_invoice_id = $invoice->id;
            }

            $project->hardware_handed_over = (bool) ($data['hardware_handed_over'] ?? $project->hardware_handed_over);
            $project->status = GraduationProjectStatus::DELIVERED;
            $project->save();

            return $project->fresh(['members', 'linkedProject.milestones', 'client', 'depositInvoice', 'finalInvoice']);
        });
    }

    public function updateOutcome(GraduationProject $project, array $data): GraduationProject
    {
        $project->update([
            'outcome' => $data['outcome'] ?? $project->outcome,
            'outcome_notes' => $data['outcome_notes'] ?? $project->outcome_notes,
            'is_showcased' => array_key_exists('is_showcased', $data)
                ? (bool) $data['is_showcased']
                : $project->is_showcased,
        ]);

        return $project->fresh(['members']);
    }

    public function createTestimonial(GraduationProject $project, array $data): Testimonial
    {
        $payload = [
            'workspace_id' => $project->workspace_id ?? 1,
            'name' => $data['name'] ?? $project->primary_contact_name,
            'client_name' => $data['name'] ?? $project->primary_contact_name,
            'role' => $data['role'] ?? $project->university,
            'company' => $project->team_name,
            'quote' => $data['quote'],
            'is_published' => (bool) ($data['is_published'] ?? true),
            'source' => 'graduation_project',
            'graduation_project_id' => $project->id,
        ];

        if (\Schema::hasColumn('testimonials', 'rating')) {
            $payload['rating'] = $data['rating'] ?? 5;
        }
        if (\Schema::hasColumn('testimonials', 'is_approved')) {
            $payload['is_approved'] = true;
        }
        if (\Schema::hasColumn('testimonials', 'project_id')) {
            $payload['project_id'] = $project->linked_project_id;
        }
        if (\Schema::hasColumn('testimonials', 'client_id')) {
            $payload['client_id'] = $project->client_id;
        }

        return Testimonial::create($payload);
    }

    public function addMember(GraduationProject $project, array $data): GraduationProjectMember
    {
        return GraduationProjectMember::create([
            'graduation_project_id' => $project->id,
            'name' => $data['name'],
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'role_in_team' => $data['role_in_team'] ?? null,
            'is_primary' => false,
        ]);
    }
}
