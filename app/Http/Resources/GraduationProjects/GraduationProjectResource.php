<?php

namespace App\Http\Resources\GraduationProjects;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class GraduationProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $status = $this->status;
        $projectType = $this->project_type;
        $serviceType = $this->service_type;
        $finalServiceType = $this->final_service_type;
        $outcome = $this->outcome;

        return [
            'id' => (string) $this->id,
            'referenceId' => $this->reference_id,
            'teamName' => $this->team_name,
            'university' => $this->university,
            'college' => $this->college,
            'teamSize' => (int) $this->team_size,
            'description' => $this->description,
            'deadline' => $this->deadline?->toDateString(),
            'briefAttachmentUrl' => $this->brief_attachment_path
                ? Storage::disk('public')->url($this->brief_attachment_path)
                : null,
            'projectType' => is_object($projectType) ? $projectType->value : $projectType,
            'serviceType' => is_object($serviceType) ? $serviceType->value : $serviceType,
            'finalServiceType' => is_object($finalServiceType) ? $finalServiceType?->value : $finalServiceType,
            'status' => is_object($status) ? $status->value : $status,
            'quotedPrice' => $this->quoted_price !== null ? (float) $this->quoted_price : null,
            'depositPaid' => (bool) $this->deposit_paid,
            'finalPaymentPaid' => (bool) $this->final_payment_paid,
            'rejectionReason' => $this->rejection_reason,
            'hardwareHandedOver' => (bool) $this->hardware_handed_over,
            'outcome' => is_object($outcome) ? $outcome?->value : $outcome,
            'outcomeNotes' => $this->outcome_notes,
            'isShowcased' => (bool) $this->is_showcased,
            'primaryContactName' => $this->primary_contact_name,
            'primaryContactPhone' => $this->primary_contact_phone,
            'primaryContactEmail' => $this->primary_contact_email,
            'linkedProjectId' => $this->linked_project_id ? (string) $this->linked_project_id : null,
            'clientId' => $this->client_id ? (string) $this->client_id : null,
            'depositInvoiceId' => $this->deposit_invoice_id ? (string) $this->deposit_invoice_id : null,
            'finalInvoiceId' => $this->final_invoice_id ? (string) $this->final_invoice_id : null,
            'members' => $this->whenLoaded('members', fn () => $this->members->map(fn ($m) => [
                'id' => (string) $m->id,
                'name' => $m->name,
                'phone' => $m->phone,
                'email' => $m->email,
                'roleInTeam' => $m->role_in_team,
                'isPrimary' => (bool) $m->is_primary,
            ])),
            'milestones' => $this->when(
                $this->relationLoaded('linkedProject') && $this->linkedProject?->relationLoaded('milestones'),
                fn () => $this->linkedProject->milestones->map(fn ($ms) => [
                    'id' => (string) $ms->id,
                    'title' => $ms->title,
                    'status' => $ms->status,
                    'progress' => (int) $ms->progress,
                    'deadline' => $ms->deadline?->toDateString(),
                    'completedAt' => $ms->completed_at?->toISOString(),
                ])
            ),
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
