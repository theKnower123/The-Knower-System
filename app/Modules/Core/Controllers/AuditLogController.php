<?php
namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Core\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

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
