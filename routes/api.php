<?php

use Illuminate\Support\Facades\Route;

// ─── CRM ─────────────────────────────────────────────────────────────────────
use App\Modules\CRM\Controllers\LeadController;
use App\Modules\CRM\Controllers\ClientController;
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
use App\Modules\HR\Controllers\JobPostingController;
use App\Modules\HR\Controllers\JobApplicationController;

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

    // ─── Public Marketing API (No Auth Required) ──────────────────────────────
    Route::prefix('public')->group(function () {
        Route::get('/portfolio',   [\App\Modules\CMS\Controllers\PublicApiController::class, 'portfolio']);
        Route::get('/pricing',     [\App\Modules\CMS\Controllers\PublicApiController::class, 'pricing']);
        Route::get('/testimonials',[\App\Modules\CMS\Controllers\PublicApiController::class, 'testimonials']);
        Route::get('/faqs',        [\App\Modules\CMS\Controllers\PublicApiController::class, 'faqs']);
        Route::get('/blog',        [\App\Modules\CMS\Controllers\PublicApiController::class, 'blog']);
        Route::get('/blog/{slug}',  [\App\Modules\CMS\Controllers\PublicApiController::class, 'blogDetail']);
        Route::get('/team',        [\App\Modules\CMS\Controllers\PublicApiController::class, 'team']);
        Route::get('/services',        [\App\Modules\CMS\Controllers\PublicApiController::class, 'services']);
        Route::get('/services/{slug}',  [\App\Modules\CMS\Controllers\PublicApiController::class, 'serviceDetail']);
        Route::get('/careers',     [\App\Modules\CMS\Controllers\PublicApiController::class, 'careers']);
        Route::get('/social-links',[\App\Modules\CMS\Controllers\PublicApiController::class, 'socialLinks']);
        Route::post('/contact',       [\App\Modules\CMS\Controllers\PublicApiController::class, 'submitContact']);
    Route::post('/demo-request',  [\App\Modules\CMS\Controllers\PublicApiController::class, 'submitDemoRequest']);
        // Support Widget Ingestion
        Route::post('/support/ingest', [\App\Modules\Support\Controllers\IngestionController::class, 'ingest']);
    });
    // ── Auth ──────────────────────────────────────────────────────────────────
    Route::post('auth/login', [\App\Modules\Auth\Controllers\AuthController::class, 'login']);

    // ── Public Jobs (Landing Page) ────────────────────────────────────────────
    Route::get('job-postings/active', [JobPostingController::class, 'active']);
    Route::post('job-applications', [JobApplicationController::class, 'store']);
    Route::get('job-applications/status', [JobApplicationController::class, 'checkStatus']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [\App\Modules\Auth\Controllers\AuthController::class, 'logout']);
        Route::get('auth/me', [\App\Modules\Auth\Controllers\AuthController::class, 'me']);

        // Profile & Active Devices Management
        Route::post('profile', [\App\Modules\Auth\Controllers\ProfileController::class, 'updateProfile']);
        Route::post('profile/password', [\App\Modules\Auth\Controllers\ProfileController::class, 'updatePassword']);
        Route::get('profile/devices', [\App\Modules\Auth\Controllers\ProfileController::class, 'getDevices']);
        Route::delete('profile/devices/{id}', [\App\Modules\Auth\Controllers\ProfileController::class, 'revokeDevice']);
        Route::post('profile/devices/approve/{requestId}', [\App\Modules\Auth\Controllers\ProfileController::class, 'approveDeviceRequest']);

        // ── Core / Admin ──────────────────────────────────────────────────────────
        // Super Admin Centralized User Management
        Route::prefix('admin/users')->group(function () {
            Route::get('/', [\App\Modules\Auth\Controllers\UserManagementController::class, 'index']);
            Route::get('/excel-template', [\App\Modules\Auth\Controllers\UserManagementController::class, 'downloadExcelTemplate']);
            Route::post('/parse-excel', [\App\Modules\Auth\Controllers\UserManagementController::class, 'parseExcel']);
            Route::post('/import-excel', [\App\Modules\Auth\Controllers\UserManagementController::class, 'importExcel']);
            Route::post('/confirm-import', [\App\Modules\Auth\Controllers\UserManagementController::class, 'confirmImport']);
            Route::post('/download-import-report', [\App\Modules\Auth\Controllers\UserManagementController::class, 'downloadImportReport']);
            Route::post('/bulk-action', [\App\Modules\Auth\Controllers\UserManagementController::class, 'bulkAction']);
            Route::get('/{id}/activity-logs', [\App\Modules\Auth\Controllers\UserManagementController::class, 'activityLogs']);
            Route::get('/{id}', [\App\Modules\Auth\Controllers\UserManagementController::class, 'show']);
            Route::post('/', [\App\Modules\Auth\Controllers\UserManagementController::class, 'store']);
            Route::put('/{id}', [\App\Modules\Auth\Controllers\UserManagementController::class, 'update']);
            Route::delete('/{id}', [\App\Modules\Auth\Controllers\UserManagementController::class, 'destroy']);
            Route::delete('/{id}/force', [\App\Modules\Auth\Controllers\UserManagementController::class, 'forceDelete']);
            Route::post('/{id}/restore', [\App\Modules\Auth\Controllers\UserManagementController::class, 'restore']);
        });

        Route::get('admin/global-activity-logs', [\App\Modules\Auth\Controllers\UserManagementController::class, 'globalActivityLogs']);

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

        // ── CMS ───────────────────────────────────────────────────────────────────
        Route::apiResource('marketing-plans', \App\Modules\CMS\Controllers\MarketingPlanController::class);
        Route::apiResource('testimonials', \App\Modules\CMS\Controllers\TestimonialController::class);
        Route::apiResource('faqs', \App\Modules\CMS\Controllers\FaqController::class);
        Route::apiResource('blog-posts', \App\Modules\CMS\Controllers\BlogPostController::class);
        Route::apiResource('team-members', \App\Modules\CMS\Controllers\TeamMemberController::class);
        Route::apiResource('services-cms', \App\Modules\CMS\Controllers\ServiceController::class);
        Route::get('social-links', [\App\Modules\CMS\Controllers\SocialLinksController::class, 'index']);
        Route::put('social-links', [\App\Modules\CMS\Controllers\SocialLinksController::class, 'update']);

        // ── Marketing Ops ─────────────────────────────────────────────────────────
        Route::prefix('marketing-ops')->name('marketing-ops.')->group(function () {
            Route::get('/bootstrap', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'bootstrap']);
            Route::get('/kpis', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'kpis']);
            Route::get('/leads-by-source', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'leadsBySource']);

            Route::post('/accounts', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'storeAccount']);
            Route::patch('/accounts/{account}/status', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'setAccountStatus']);
            Route::patch('/accounts/{account}/team', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'setAccountTeam']);

            Route::post('/posts', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'storePost']);
            Route::patch('/posts/{post}/status', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'setPostStatus']);

            Route::post('/campaigns', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'storeCampaign']);
            Route::patch('/campaigns/{campaign}', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'updateCampaign']);
            Route::get('/campaigns/{campaign}/analytics', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'campaignAnalytics']);

            Route::post('/portfolio/{entry}/toggle', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'togglePortfolioVisible']);
            Route::patch('/portfolio/{entry}', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'updatePortfolioEntry']);

            Route::post('/sections/{section}/toggle', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'toggleSection']);
            Route::post('/sections/reorder', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'reorderSections']);

            Route::post('/testimonials', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'storeTestimonial']);
            Route::post('/testimonials/{testimonial}/toggle', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'toggleTestimonial']);

            Route::post('/follow-ups', [\App\Modules\Marketing\Controllers\MarketingOpsController::class, 'storeFollowUp']);
        });

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
        Route::apiResource('meetings', \App\Modules\CRM\Controllers\MeetingController::class);


        // Task Comments
        Route::get   ('tasks/{id}/comments', [TaskCommentController::class, 'index']);
        Route::post  ('tasks/{id}/comments', [TaskCommentController::class, 'store']);
        Route::delete('comments/{id}',       [TaskCommentController::class, 'destroy']);

        // Files
        Route::get   ('projects/{id}/files', [FileController::class, 'index']);
        Route::post  ('projects/{id}/files', [FileController::class, 'store']);
        Route::get   ('files/{id}',          [FileController::class, 'show']);
        Route::get   ('file/{id}',           [\App\Http\Controllers\FileProxyController::class, 'show']);
        Route::get   ('file/{type}/{id}',    [\App\Http\Controllers\FileProxyController::class, 'showByType']);
        Route::delete('files/{id}',          [FileController::class, 'destroy']);

        // ── Finance ───────────────────────────────────────────────────────────────
        Route::apiResource('invoices',  InvoiceController::class);
        Route::apiResource('payments',  PaymentController::class);
        Route::apiResource('expenses',  ExpenseController::class);

        // ── Hosting ───────────────────────────────────────────────────────────────
        Route::apiResource('domains',  DomainController::class);
        Route::apiResource('hosting',  HostingAccountController::class);
        Route::apiResource('servers',  ServerController::class);
        Route::apiResource('ssl',      SslCertificateController::class);

        // ── Support ───────────────────────────────────────────────────────────────
        Route::get   ('support/conversations', [\App\Modules\Support\Controllers\ConversationController::class, 'index']);
        Route::get   ('support/conversations/{id}/messages', [\App\Modules\Support\Controllers\ConversationController::class, 'messages']);
        
        Route::apiResource('tickets',  TicketController::class);
        Route::get   ('tickets/{id}/messages', [TicketMessageController::class, 'index']);
        Route::post  ('tickets/{id}/messages', [TicketMessageController::class, 'store']);
        Route::delete('ticket-messages/{id}',  [TicketMessageController::class, 'destroy']);

        // ── HR ────────────────────────────────────────────────────────────────────
        Route::apiResource('employees',  EmployeeController::class);
        Route::apiResource('departments', DepartmentController::class);
        Route::apiResource('job-postings', JobPostingController::class);
        // Exclude store since it's public
        Route::apiResource('job-applications', JobApplicationController::class)->except(['store']);
        Route::apiResource('attendance', AttendanceController::class);
        Route::apiResource('leaves', LeaveController::class);

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

        // ── Trash ─────────────────────────────────────────────────────────────────
        Route::post('trash/{module}/{id}/restore', [\App\Http\Controllers\TrashController::class, 'restore']);
        Route::delete('trash/{module}/{id}/force', [\App\Http\Controllers\TrashController::class, 'forceDelete']);
    });

});
