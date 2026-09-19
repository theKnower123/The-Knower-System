<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;
require __DIR__.'/modules-new.php';
require __DIR__.'/auth.php';

use App\Http\Controllers\FileProxyController;

Route::get('/', function () {
    return view('public');
});

Route::get('/file/{id}', [FileProxyController::class, 'show'])->name('file.show');
Route::get('/file/{type}/{id}', [FileProxyController::class, 'showByType'])->name('file.show.type');

Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

Route::get('/forgot-password', function () {
    return redirect('/login?view=forgot-password');
})->name('password.request');

Route::middleware(['auth:sanctum'])->group(function () {
    // Super Admin Only: Centralized User Management
    Route::get('/admin/users', function () {
        if (request()->user()?->role !== 'super_admin') {
            abort(403, 'User Management is accessible exclusively to Super Admin.');
        }
        return Inertia::render('Admin/UserManagement');
    });

    // Basic authenticated routes
    Route::get('/profile', function () { return Inertia::render('Profile'); });
    Route::post('/profile/telegram/token', [\App\Modules\Telegram\Controllers\TelegramConnectController::class, 'generateLinkToken'])->name('profile.telegram.token');
    Route::post('/profile/telegram/link-by-chat-id', [\App\Modules\Telegram\Controllers\TelegramConnectController::class, 'linkByChatId'])->name('profile.telegram.linkByChatId');
    Route::post('/profile/telegram/disconnect', [\App\Modules\Telegram\Controllers\TelegramConnectController::class, 'disconnect'])->name('profile.telegram.disconnect');
    Route::post('/profile/telegram/test', [\App\Modules\Telegram\Controllers\TelegramConnectController::class, 'test'])->name('profile.telegram.test');
    Route::get('/portal', function () { return Inertia::render('Portal'); });
    Route::get('/notifications', function () { return Inertia::render('Notifications'); });
    Route::get('/calendar', function () { return Inertia::render('Calendar'); });
    Route::get('/time-logs', function () { return Inertia::render('Time-Logs'); });

    // Dynamic Role-Based Dashboard (single route, single controller)
    Route::get('/dashboard', [\App\Modules\Core\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // CRM
    Route::middleware(['permission:crm.view'])->group(function () {
        Route::get('/crm/clients', function () { return Inertia::render('CrmClients'); });
        Route::get('/crm/leads', function () { return Inertia::render('CrmLeads'); });
        Route::get('/crm/meetings', function () { return Inertia::render('CrmMeetings'); });
        Route::get('/crm/quotations', function () { return Inertia::render('CrmQuotations'); });
        Route::get('/crm/inquiries', function () { return Inertia::render('Crm/Inquiries'); });
    });

    Route::middleware(['permission:crm.view|client_portal.view'])->group(function () {
        Route::get('/crm/contracts', function () { return Inertia::render('CrmContracts'); });
    });

    // Projects
    Route::middleware(['permission:project.view|client_portal.view'])->group(function () {
        Route::get('/projects', function () { return Inertia::render('ProjectsIndex'); });
        Route::get('/projects/{id}', function () { return Inertia::render('Projects$Id'); });
    });

    // Graduation Projects (admin ERP)
    Route::middleware(['permission:graduation_projects.view'])->group(function () {
        Route::get('/admin/graduation-projects', function () { return Inertia::render('GraduationProjects/Index'); });
        Route::get('/admin/graduation-projects/{id}', function ($id) {
            return Inertia::render('GraduationProjects/Show', ['id' => $id]);
        });
    });

    // Tasks & Bugs
    Route::middleware(['permission:task.view|project.view'])->group(function () {
        Route::get('/tasks', function () { return Inertia::render('Tasks'); });
    });
    Route::middleware(['permission:bug.manage|project.view'])->group(function () {
        Route::get('/bugs', function () { return Inertia::render('Bugs'); });
    });

    // Finance
    Route::middleware(['permission:finance.view|client_portal.view'])->group(function () {
        Route::get('/finance/invoices', function () { return Inertia::render('FinanceInvoices'); });
        Route::get('/finance/payments', function () { return Inertia::render('FinancePayments'); });
    });
    Route::middleware(['permission:finance.view'])->group(function () {
        Route::get('/finance/expenses', function () { return Inertia::render('FinanceExpenses'); });
        Route::get('/finance/revenue', function () { return Inertia::render('FinanceRevenue'); });
    });

    // Hosting
    Route::middleware(['permission:hosting.view'])->group(function () {
        Route::get('/hosting/accounts', function () { return Inertia::render('HostingAccounts'); });
        Route::get('/hosting/domains', function () { return Inertia::render('HostingDomains'); });
        Route::get('/hosting/servers', function () { return Inertia::render('HostingServers'); });
        Route::get('/hosting/ssl', function () { return Inertia::render('HostingSsl'); });
    });

    // Support Center
    Route::middleware(['permission:support.view'])->group(function () {
        Route::get('/support/dashboard', function () { return Inertia::render('Support/Dashboard'); });
        Route::get('/support/inbox', function () { return Inertia::render('Support/Inbox'); });
        Route::get('/support/live-chat', function () { return Inertia::render('Support/LiveChat'); });
        Route::get('/support/conversations', function () { return Inertia::render('Support/Conversations'); });
        Route::get('/support/contacts', function () { return Inertia::render('Support/Contacts'); });
    });
    
    // Support Management
    Route::middleware(['permission:support.manage'])->group(function () {
        Route::get('/support/queue', function () { return Inertia::render('Support/Queue'); });
        Route::get('/support/automation', function () { return Inertia::render('Support/Automation'); });
        Route::get('/support/widget', function () { return Inertia::render('Support/Widget'); });
    });
    
    // Support Tickets
    Route::middleware(['permission:support.view|client_portal.view'])->group(function () {
        Route::get('/support/tickets', function () { return Inertia::render('SupportTicketsIndex'); });
        Route::get('/support/tickets/{id}', function () { return Inertia::render('SupportTickets$Id'); });
    });

    // HR
    Route::middleware(['permission:hr.view'])->group(function () {
        Route::get('/hr/employees', function () { return Inertia::render('HrEmployees'); });
        Route::get('/hr/attendance', function () { return Inertia::render('HrAttendance'); });
        Route::get('/hr/leaves', function () { return Inertia::render('HrLeaves'); });
        Route::get('/hr/payroll', function () { return Inertia::render('HrPayroll'); });
        Route::get('/hr/departments', function () { return Inertia::render('HrDepartments'); });
        Route::get('/hr/jobs', function () { return Inertia::render('HrJobs'); });
        Route::get('/hr/applications', function () { return Inertia::render('HrApplications'); });
    });

    // Reports
    Route::middleware(['permission:report.view'])->group(function () {
        Route::get('/reports', function () { return Inertia::render('Reports'); });
    });

    // CMS
    Route::middleware(['permission:cms.manage'])->group(function () {
        Route::get('/cms/pricing', function () { return Inertia::render('CmsPricing'); });
        Route::get('/cms/testimonials', function () { return Inertia::render('CmsTestimonials'); });
        Route::get('/cms/faqs', function () { return Inertia::render('CmsFaqs'); });
        Route::get('/cms/blog', function () { return Inertia::render('CmsBlog'); });
        Route::get('/cms/team', function () { return Inertia::render('CmsTeam'); });
        Route::get('/cms/services', function () { return Inertia::render('CmsServices'); });
    });

    // Sales & Digital Marketing Module
    Route::middleware(['permission:marketing.view|cms.manage|lead.manage'])->group(function () {
        Route::get('/marketing/accounts', [\App\Modules\Marketing\Controllers\SocialAccountController::class, 'index']);
        Route::get('/marketing/posts', [\App\Modules\Marketing\Controllers\PostController::class, 'index']);
        Route::get('/marketing/campaigns', [\App\Modules\Marketing\Controllers\CampaignController::class, 'index']);
        Route::get('/cms/landing-builder', [\App\Modules\CMS\Controllers\LandingBuilderController::class, 'index']);
        Route::get('/cms/social-links', [\App\Modules\CMS\Controllers\LandingBuilderController::class, 'index']);
        Route::get('/crm/leads/followups', [\App\Modules\CRM\Controllers\LeadFollowupController::class, 'index']);
        Route::get('/marketing/activity-log', [\App\Modules\Marketing\Controllers\MarketingActivityLogController::class, 'index']);
    });

    // AI & Settings
    Route::middleware(['permission:ai.use'])->group(function () {
        Route::get('/ai', function () { return Inertia::render('Ai'); });
    });
    Route::middleware(['permission:settings.manage'])->group(function () {
        Route::get('/settings', function () { return Inertia::render('Settings'); });
        
        // Error Management
        Route::get('/admin/errors', [\App\Modules\Core\Controllers\ErrorManagementController::class, 'dashboard'])->name('errors.dashboard');
        Route::get('/admin/errors/analytics', [\App\Modules\Core\Controllers\ErrorManagementController::class, 'analytics'])->name('errors.analytics');
        Route::get('/admin/errors/developer', [\App\Modules\Core\Controllers\ErrorManagementController::class, 'developerCenter'])->name('errors.developer');
        Route::get('/admin/errors/{id}', [\App\Modules\Core\Controllers\ErrorManagementController::class, 'show'])->name('errors.show');
        Route::get('/admin/activity-logs', function () { return Inertia::render('Admin/ActivityLog'); });
    });

    // Telegram Server Module
    Route::middleware(['permission:telegram.view'])->group(function () {
        Route::get('/admin/telegram-server', [\App\Modules\Telegram\Controllers\TelegramController::class, 'index'])->name('admin.telegram.index');
        Route::get('/admin/telegram-server/ping', [\App\Modules\Telegram\Controllers\TelegramController::class, 'ping'])->name('admin.telegram.ping');
        Route::post('/admin/telegram-server/sync-webhook', [\App\Modules\Telegram\Controllers\TelegramController::class, 'syncWebhook'])->name('admin.telegram.syncWebhook');
        Route::get('/admin/telegram-server/logs', [\App\Modules\Telegram\Controllers\TelegramController::class, 'logs'])->name('admin.telegram.logs');
        Route::post('/admin/telegram-server/logs/{id}/retry', [\App\Modules\Telegram\Controllers\TelegramController::class, 'retryLog'])->name('admin.telegram.retryLog');
        Route::get('/admin/telegram-server/linked-accounts', [\App\Modules\Telegram\Controllers\TelegramController::class, 'linkedAccounts'])->name('admin.telegram.linkedAccounts');
        Route::post('/admin/telegram-server/users/{id}/disconnect', [\App\Modules\Telegram\Controllers\TelegramController::class, 'disconnectAccount'])->name('admin.telegram.disconnectAccount');
        Route::get('/admin/telegram-server/templates', [\App\Modules\Telegram\Controllers\TelegramController::class, 'templates'])->name('admin.telegram.templates');
        Route::put('/admin/telegram-server/templates/{id}', [\App\Modules\Telegram\Controllers\TelegramController::class, 'updateTemplate'])->name('admin.telegram.updateTemplate');
        Route::post('/admin/telegram-server/templates/{id}/restore', [\App\Modules\Telegram\Controllers\TelegramController::class, 'restoreTemplateDefault'])->name('admin.telegram.restoreTemplateDefault');
        Route::post('/admin/telegram-server/test-alert', [\App\Modules\Telegram\Controllers\TelegramController::class, 'sendTestAlert'])->name('admin.telegram.sendTestAlert');
        Route::get('/admin/telegram-server/security-events', [\App\Modules\Telegram\Controllers\TelegramController::class, 'securityEvents'])->name('admin.telegram.securityEvents');
    });
});

// Telegram Account Linking
Route::get('/telegram/connect', [\App\Modules\Telegram\Controllers\TelegramConnectController::class, 'show'])->name('telegram.connect');
Route::post('/telegram/connect/confirm', [\App\Modules\Telegram\Controllers\TelegramConnectController::class, 'confirm'])->middleware('auth')->name('telegram.connect.confirm');

Route::fallback(function (\Illuminate\Http\Request $request) {
    $erpPrefixes = ['/dashboard', '/crm', '/projects', '/admin', '/tasks', '/bugs', '/calendar', '/time-logs', '/finance', '/hosting', '/support', '/hr', '/reports', '/cms', '/marketing', '/ai', '/settings', '/profile', '/portal', '/notifications', '/telegram'];
    
    foreach ($erpPrefixes as $prefix) {
        if (str_starts_with($request->getPathInfo(), $prefix)) {
            abort(404);
        }
    }
    
    return view('public');
});

