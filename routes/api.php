<?php

use Illuminate\Support\Facades\Route;

// ─── CRM ─────────────────────────────────────────────────────────────────────
use App\Modules\CRM\Controllers\LeadController;
use App\Modules\CRM\Controllers\ClientController;
use App\Modules\CRM\Controllers\CompanyController;
use App\Modules\CRM\Controllers\ContactController;
use App\Modules\CRM\Controllers\QuotationController;
use App\Modules\CRM\Controllers\ContractController;

// ─── Projects ─────────────────────────────────────────────────────────────────
use App\Modules\Projects\Controllers\ProjectController;
use App\Modules\Projects\Controllers\MilestoneController;
use App\Modules\Projects\Controllers\TaskController;
use App\Modules\Projects\Controllers\TaskCommentController;
use App\Modules\Projects\Controllers\BugController;
use App\Modules\Projects\Controllers\FileController;

// ─── Finance ──────────────────────────────────────────────────────────────────
use App\Modules\Finance\Controllers\InvoiceController;
use App\Modules\Finance\Controllers\PaymentController;
use App\Modules\Finance\Controllers\ExpenseController;

// ─── Hosting ──────────────────────────────────────────────────────────────────
use App\Modules\Hosting\Controllers\DomainController;
use App\Modules\Hosting\Controllers\HostingAccountController;
use App\Modules\Hosting\Controllers\ServerController;
use App\Modules\Hosting\Controllers\SslCertificateController;

// ─── Support ──────────────────────────────────────────────────────────────────
use App\Modules\Support\Controllers\TicketController;
use App\Modules\Support\Controllers\TicketMessageController;

// ─── HR ───────────────────────────────────────────────────────────────────────
use App\Modules\HR\Controllers\EmployeeController;
use App\Modules\HR\Controllers\DepartmentController;
use App\Modules\HR\Controllers\AttendanceController;
use App\Modules\HR\Controllers\LeaveController;

// ─── Reports ──────────────────────────────────────────────────────────────────
use App\Modules\Reports\Controllers\ReportController;

// ─── AI ───────────────────────────────────────────────────────────────────────
use App\Modules\AI\Controllers\AiController;

// ─── Settings ─────────────────────────────────────────────────────────────────
use App\Modules\Settings\Controllers\SettingsController;

// ─── Dashboard ────────────────────────────────────────────────────────────────
use App\Modules\Core\Controllers\DashboardController;

// ─── Core / Auth ─────────────────────────────────────────────────────────────────
use App\Modules\Core\Controllers\RoleController;
use App\Modules\Core\Controllers\WorkspaceController;
use App\Modules\Core\Controllers\SecurityController;
use App\Modules\Core\Controllers\ApiTokenController;
use App\Modules\Core\Controllers\AuditLogController;

/*
|--------------------------------------------------------------------------
| API Routes - The Knower OS
| Base URL: /api/v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ── Auth ──────────────────────────────────────────────────────────────────
    Route::post('auth/login', [\App\Modules\Auth\Controllers\AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [\App\Modules\Auth\Controllers\AuthController::class, 'logout']);
        Route::get('auth/me', [\App\Modules\Auth\Controllers\AuthController::class, 'me']);

        // ── Core / Admin ──────────────────────────────────────────────────────────
        Route::get('permissions', [RoleController::class, 'permissions']);
        Route::apiResource('roles', RoleController::class);
        
        Route::post('workspaces/{workspace}/switch', [WorkspaceController::class, 'switch']);
        Route::apiResource('workspaces', WorkspaceController::class);

        // Security & Auth
        Route::get('security/sessions', [SecurityController::class, 'sessions']);
        Route::delete('security/sessions/{id}', [SecurityController::class, 'revokeSession']);
        Route::post('security/2fa/generate', [SecurityController::class, 'generate2FA']);
        Route::post('security/2fa/enable', [SecurityController::class, 'enable2FA']);
        Route::post('security/2fa/disable', [SecurityController::class, 'disable2FA']);

        // API Tokens
        Route::apiResource('api-tokens', ApiTokenController::class)->only(['index', 'store', 'destroy']);

        // Audit Logs
        Route::get('audit-logs', [AuditLogController::class, 'index']);

        // ── Notifications ─────────────────────────────────────────────────────────
        Route::get('notifications', [App\Modules\Notifications\Controllers\NotificationController::class, 'index']);
        Route::get('notifications/unread', [App\Modules\Notifications\Controllers\NotificationController::class, 'unread']);
        Route::post('notifications/mark-all-read', [App\Modules\Notifications\Controllers\NotificationController::class, 'markAllAsRead']);
        Route::post('notifications/{id}/read', [App\Modules\Notifications\Controllers\NotificationController::class, 'markAsRead']);
        Route::delete('notifications/{id}', [App\Modules\Notifications\Controllers\NotificationController::class, 'destroy']);

        // ── Dashboard ─────────────────────────────────────────────────────────────
        Route::get('/dashboard',         [DashboardController::class, 'index']);
        Route::get('/dashboard/revenue', [DashboardController::class, 'index']);
        Route::get('/dashboard/projects',[DashboardController::class, 'index']);
        Route::get('/dashboard/tasks',   [DashboardController::class, 'index']);

        // ── CRM ───────────────────────────────────────────────────────────────────
        Route::apiResource('companies',  CompanyController::class);
        Route::apiResource('contacts',   ContactController::class);
        Route::apiResource('leads',      LeadController::class);
        Route::get('clients/{client}/activity', [ClientController::class, 'activity']);
        Route::apiResource('clients',    ClientController::class);
        Route::apiResource('quotations', QuotationController::class);
        Route::apiResource('contracts',  ContractController::class);

        // ── Projects ──────────────────────────────────────────────────────────────
        Route::get('projects/{project}/activity', [ProjectController::class, 'activity']);
        Route::apiResource('projects',   ProjectController::class);
        Route::apiResource('milestones', MilestoneController::class);
        Route::apiResource('tasks',      TaskController::class);
        Route::apiResource('bugs',       BugController::class);
        Route::apiResource('meetings',   \App\Modules\Projects\Controllers\MeetingController::class);
        Route::apiResource('time-logs',  \App\Modules\Projects\Controllers\TimeLogController::class);

        // Task Comments
        Route::get   ('tasks/{id}/comments', [TaskCommentController::class, 'index']);
        Route::post  ('tasks/{id}/comments', [TaskCommentController::class, 'store']);
        Route::delete('comments/{id}',       [TaskCommentController::class, 'destroy']);

        // Files
        Route::get   ('projects/{id}/files', [FileController::class, 'index']);
        Route::post  ('projects/{id}/files', [FileController::class, 'store']);
        Route::get   ('files/{id}',          [FileController::class, 'show']);
        Route::delete('files/{id}',          [FileController::class, 'destroy']);

        // ── Finance ───────────────────────────────────────────────────────────────
        Route::apiResource('invoices',  InvoiceController::class);
        Route::get   ('payments',       [PaymentController::class, 'index']);
        Route::post  ('payments',       [PaymentController::class, 'store']);
        Route::delete('payments/{id}',  [PaymentController::class, 'destroy']);
        Route::apiResource('expenses',  ExpenseController::class);

        // ── Hosting ───────────────────────────────────────────────────────────────
        Route::apiResource('domains',  DomainController::class);
        Route::apiResource('hosting',  HostingAccountController::class);
        Route::apiResource('servers',  ServerController::class);
        Route::apiResource('ssl',      SslCertificateController::class);

        // ── Support ───────────────────────────────────────────────────────────────
        Route::apiResource('tickets',  TicketController::class);
        Route::get   ('tickets/{id}/messages', [TicketMessageController::class, 'index']);
        Route::post  ('tickets/{id}/messages', [TicketMessageController::class, 'store']);
        Route::delete('ticket-messages/{id}',  [TicketMessageController::class, 'destroy']);

        // ── HR ────────────────────────────────────────────────────────────────────
        Route::apiResource('employees',  EmployeeController::class);
        Route::apiResource('departments', DepartmentController::class);
        Route::get   ('attendance',      [AttendanceController::class, 'index']);
        Route::post  ('attendance',      [AttendanceController::class, 'store']);
        Route::delete('attendance/{id}', [AttendanceController::class, 'destroy']);
        Route::get   ('leaves',          [LeaveController::class, 'index']);
        Route::post  ('leaves',          [LeaveController::class, 'store']);
        Route::get   ('leaves/{id}',     [LeaveController::class, 'show']);
        Route::put   ('leaves/{id}',     [LeaveController::class, 'update']);
        Route::delete('leaves/{id}',     [LeaveController::class, 'destroy']);

        // ── Reports ───────────────────────────────────────────────────────────────
        Route::get('reports/revenue',   [ReportController::class, 'revenue']);
        Route::get('reports/projects',  [ReportController::class, 'projects']);
        Route::get('reports/clients',   [ReportController::class, 'clients']);
        Route::get('reports/employees', [ReportController::class, 'employees']);
        Route::get('reports/finance',   [ReportController::class, 'finance']);

        // ── AI Assistant ──────────────────────────────────────────────────────────
        Route::post('ai/chat',               [AiController::class, 'chat']);
        Route::post('ai/generate-quotation', [AiController::class, 'generateQuotation']);
        Route::post('ai/generate-tasks',     [AiController::class, 'generateTasks']);
        Route::post('ai/project-summary',    [AiController::class, 'projectSummary']);
        Route::post('ai/analyze-bug',        [AiController::class, 'analyzeBug']);
        Route::post('ai/summarize-ticket',   [AiController::class, 'summarizeTicket']);

        // ── Settings ──────────────────────────────────────────────────────────────
        Route::get ('settings',            [SettingsController::class, 'index']);
        Route::put ('settings/company',    [SettingsController::class, 'updateCompany']);
        Route::put ('settings/mail',       [SettingsController::class, 'updateMail']);
        Route::put ('settings/security',   [SettingsController::class, 'updateSecurity']);
    });

});
