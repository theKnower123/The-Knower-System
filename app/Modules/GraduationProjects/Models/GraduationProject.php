<?php

namespace App\Modules\GraduationProjects\Models;

use App\Enums\GraduationProjectOutcome;
use App\Enums\GraduationProjectStatus;
use App\Enums\GraduationProjectType;
use App\Enums\GraduationServiceType;
use App\Modules\CRM\Models\Client;
use App\Modules\Finance\Models\Invoice;
use App\Modules\Projects\Models\Project;
use App\Traits\HandlesTrash;
use App\Traits\HasWorkspace;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class GraduationProject extends Model
{
    use HandlesTrash;
    use SoftDeletes;
    use HasWorkspace;
    use LogsActivity;

    protected $fillable = [
        'workspace_id',
        'reference_id',
        'team_name',
        'university',
        'college',
        'team_size',
        'description',
        'deadline',
        'brief_attachment_path',
        'project_type',
        'service_type',
        'final_service_type',
        'status',
        'quoted_price',
        'deposit_paid',
        'final_payment_paid',
        'rejection_reason',
        'hardware_handed_over',
        'outcome',
        'outcome_notes',
        'is_showcased',
        'primary_contact_name',
        'primary_contact_phone',
        'primary_contact_email',
        'linked_project_id',
        'client_id',
        'deposit_invoice_id',
        'final_invoice_id',
    ];

    protected $casts = [
        'deadline' => 'date',
        'quoted_price' => 'decimal:2',
        'deposit_paid' => 'boolean',
        'final_payment_paid' => 'boolean',
        'hardware_handed_over' => 'boolean',
        'is_showcased' => 'boolean',
        'team_size' => 'integer',
        'status' => GraduationProjectStatus::class,
        'project_type' => GraduationProjectType::class,
        'service_type' => GraduationServiceType::class,
        'final_service_type' => GraduationServiceType::class,
        'outcome' => GraduationProjectOutcome::class,
    ];

    public function members()
    {
        return $this->hasMany(GraduationProjectMember::class);
    }

    public function linkedProject()
    {
        return $this->belongsTo(Project::class, 'linked_project_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function depositInvoice()
    {
        return $this->belongsTo(Invoice::class, 'deposit_invoice_id');
    }

    public function finalInvoice()
    {
        return $this->belongsTo(Invoice::class, 'final_invoice_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
