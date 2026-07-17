import os
import glob

# --- AUDIT LOG SERVICE ---
audit_service = """<?php
namespace App\\Services\\Core;

use Spatie\\Activitylog\\Models\\Activity;

class AuditLogService
{
    public function getLogs(array $filters = [])
    {
        $query = Activity::with('causer', 'subject')->orderBy('created_at', 'desc');
        
        if (isset($filters['event'])) {
            $query->where('event', $filters['event']);
        }

        if (isset($filters['causer_id'])) {
            $query->where('causer_id', $filters['causer_id']);
        }

        return $query->paginate(50);
    }
}
"""

os.makedirs('app/Services/Core', exist_ok=True)
with open('app/Services/Core/AuditLogService.php', 'w') as f:
    f.write(audit_service)

# --- AUDIT LOG CONTROLLER ---
audit_controller = """<?php
namespace App\\Http\\Controllers\\Core;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Core\\AuditLogService;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

class AuditLogController extends Controller
{
    protected AuditLogService $auditService;

    public function __construct(AuditLogService $auditService)
    {
        $this->auditService = $auditService;
    }

    public function index(Request $request): JsonResponse
    {
        // Only super admin or org admin can view global logs
        $request->user()->hasRole(['Super Admin', 'Organization Admin']) || abort(403);
        
        return response()->json([
            'success' => true,
            'data' => $this->auditService->getLogs($request->all())
        ]);
    }
}
"""

os.makedirs('app/Http/Controllers/Core', exist_ok=True)
with open('app/Http/Controllers/Core/AuditLogController.php', 'w') as f:
    f.write(audit_controller)

# --- APPLY LogsActivity TRAIT TO MODELS ---
models = [
    'Company', 'Client', 'Lead', 'Contract', 'Quotation',
    'Project', 'Milestone', 'Task', 'Bug', 'File',
    'Invoice', 'Payment', 'Expense',
    'Server', 'HostingAccount', 'Domain', 'SslCertificate',
    'Ticket', 'TicketMessage',
    'Employee', 'Attendance', 'Leave'
]

for model_path in glob.glob('app/Models/*.php'):
    basename = os.path.basename(model_path).replace('.php', '')
    if basename in models:
        with open(model_path, 'r') as f:
            content = f.read()
        
        if 'LogsActivity' not in content:
            content = content.replace('use Illuminate\\Database\\Eloquent\\Model;', 'use Illuminate\\Database\\Eloquent\\Model;\nuse Spatie\\Activitylog\\Traits\\LogsActivity;\nuse Spatie\\Activitylog\\LogOptions;')
            content = content.replace('use HasFactory, HasWorkspace;', 'use HasFactory, HasWorkspace, LogsActivity;')
            
            # Add getActivitylogOptions method
            log_method = f"""
    public function getActivitylogOptions(): LogOptions
    {{
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }}
}}"""
            content = content.replace('}', log_method)
            
            with open(model_path, 'w') as f:
                f.write(content)

print("Step 3 (Audit Logs) Scaffolded")
