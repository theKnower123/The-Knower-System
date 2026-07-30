<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;
require __DIR__.'/modules-new.php';

Route::get('/', function () {
    return view('public');
});

Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

Route::get('/forgot-password', function () {
    return Inertia::render('ForgotPassword');
})->name('password.request');

Route::middleware(['auth:sanctum'])->group(function () {
    // Basic authenticated routes
    Route::get('/profile', function () { return Inertia::render('Profile'); });
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
    });

    Route::middleware(['permission:crm.view|client_portal.view'])->group(function () {
        Route::get('/crm/contracts', function () { return Inertia::render('CrmContracts'); });
    });

    // Projects
    Route::middleware(['permission:project.view|client_portal.view'])->group(function () {
        Route::get('/projects', function () { return Inertia::render('ProjectsIndex'); });
        Route::get('/projects/{id}', function () { return Inertia::render('Projects$Id'); });
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
    });
});
Route::fallback(function (\Illuminate\Http\Request $request) {
    $erpPrefixes = ['/dashboard', '/crm', '/projects', '/tasks', '/bugs', '/calendar', '/time-logs', '/finance', '/hosting', '/support', '/hr', '/reports', '/cms', '/ai', '/settings', '/profile', '/portal', '/notifications'];
    
    foreach ($erpPrefixes as $prefix) {
        if (str_starts_with($request->getPathInfo(), $prefix)) {
            abort(404);
        }
    }
    
    return view('public');
});
