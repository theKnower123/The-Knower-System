<?php

use Illuminate\Support\Facades\Route;

// ─── CRM ─────────────────────────────────────────────────────────────────────
use App\Http\Controllers\CRM\LeadController;
use App\Http\Controllers\CRM\ClientController;
use App\Http\Controllers\CRM\CompanyController;
use App\Http\Controllers\CRM\QuotationController;
use App\Http\Controllers\CRM\ContractController;

// ─── Projects ─────────────────────────────────────────────────────────────────
use App\Http\Controllers\Projects\ProjectController;
use App\Http\Controllers\Projects\MilestoneController;
use App\Http\Controllers\Projects\TaskController;
use App\Http\Controllers\Projects\TaskCommentController;
use App\Http\Controllers\Projects\BugController;
use App\Http\Controllers\Projects\FileController;

// ─── Finance ──────────────────────────────────────────────────────────────────
use App\Http\Controllers\Finance\InvoiceController;
use App\Http\Controllers\Finance\PaymentController;
use App\Http\Controllers\Finance\ExpenseController;

// ─── Hosting ──────────────────────────────────────────────────────────────────
use App\Http\Controllers\Hosting\DomainController;
use App\Http\Controllers\Hosting\HostingAccountController;
use App\Http\Controllers\Hosting\ServerController;
use App\Http\Controllers\Hosting\SslCertificateController;

// ─── Support ──────────────────────────────────────────────────────────────────
use App\Http\Controllers\Support\TicketController;
use App\Http\Controllers\Support\TicketMessageController;

// ─── HR ───────────────────────────────────────────────────────────────────────
use App\Http\Controllers\HR\EmployeeController;
use App\Http\Controllers\HR\AttendanceController;
use App\Http\Controllers\HR\LeaveController;

// ─── Reports ──────────────────────────────────────────────────────────────────
use App\Http\Controllers\Reports\ReportController;

// ─── AI ───────────────────────────────────────────────────────────────────────
use App\Http\Controllers\AI\AiController;

// ─── Settings ─────────────────────────────────────────────────────────────────
use App\Http\Controllers\Settings\SettingsController;

// ─── Dashboard ────────────────────────────────────────────────────────────────
use App\Http\Controllers\DashboardController;

// ─── Core / Auth ─────────────────────────────────────────────────────────────────
use App\Http\Controllers\Core\RoleController;
use App\Http\Controllers\Core\WorkspaceController;
use App\Http\Controllers\Core\SecurityController;
use App\Http\Controllers\Core\ApiTokenController;
use App\Http\Controllers\Core\AuditLogController;

/*
|--------------------------------------------------------------------------
| API Routes - The Knower OS
| Base URL: /api/v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

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

    // ── Dashboard ─────────────────────────────────────────────────────────────
    Route::get('/dashboard',         [DashboardController::class, 'index']);
    Route::get('/dashboard/revenue', [DashboardController::class, 'index']);
    Route::get('/dashboard/projects',[DashboardController::class, 'index']);
    Route::get('/dashboard/tasks',   [DashboardController::class, 'index']);

    // ── CRM ───────────────────────────────────────────────────────────────────
    Route::apiResource('leads',      LeadController::class);
    Route::apiResource('clients',    ClientController::class);
    Route::apiResource('companies',  CompanyController::class);
    Route::apiResource('quotations', QuotationController::class);
    Route::apiResource('contracts',  ContractController::class);

    // ── Projects ──────────────────────────────────────────────────────────────
    Route::apiResource('projects',   ProjectController::class);
    Route::apiResource('milestones', MilestoneController::class);
    Route::apiResource('tasks',      TaskController::class);
    Route::apiResource('bugs',       BugController::class);

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
