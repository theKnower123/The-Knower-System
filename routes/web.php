<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

Route::get('/forgot-password', function () {
    return Inertia::render('ForgotPassword');
})->name('password.request');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/dashboard', function () { return Inertia::render('Dashboard'); });
    Route::get('/crm/clients', function () { return Inertia::render('CrmClients'); });
    Route::get('/crm/companies', function () { return Inertia::render('CrmCompanies'); });
    Route::get('/crm/contacts', function () { return Inertia::render('CrmContacts'); });
    Route::get('/crm/contracts', function () { return Inertia::render('CrmContracts'); });
    Route::get('/crm/leads', function () { return Inertia::render('CrmLeads'); });
    Route::get('/crm/meetings', function () { return Inertia::render('CrmMeetings'); });
    Route::get('/crm/quotations', function () { return Inertia::render('CrmQuotations'); });
    Route::get('/projects', function () { return Inertia::render('ProjectsIndex'); });
    Route::get('/projects/{id}', function () { return Inertia::render('Projects$Id'); });
    Route::get('/tasks', function () { return Inertia::render('Tasks'); });
    Route::get('/bugs', function () { return Inertia::render('Bugs'); });
    Route::get('/calendar', function () { return Inertia::render('Calendar'); });
    Route::get('/time-logs', function () { return Inertia::render('Time-Logs'); });
    Route::get('/finance/invoices', function () { return Inertia::render('FinanceInvoices'); });
    Route::get('/finance/payments', function () { return Inertia::render('FinancePayments'); });
    Route::get('/finance/expenses', function () { return Inertia::render('FinanceExpenses'); });
    Route::get('/finance/revenue', function () { return Inertia::render('FinanceRevenue'); });
    Route::get('/hosting/accounts', function () { return Inertia::render('HostingAccounts'); });
    Route::get('/hosting/domains', function () { return Inertia::render('HostingDomains'); });
    Route::get('/hosting/servers', function () { return Inertia::render('HostingServers'); });
    Route::get('/hosting/ssl', function () { return Inertia::render('HostingSsl'); });
    Route::get('/support/tickets', function () { return Inertia::render('SupportTicketsIndex'); });
    Route::get('/support/tickets/{id}', function () { return Inertia::render('SupportTickets$Id'); });
    Route::get('/hr/employees', function () { return Inertia::render('HrEmployees'); });
    Route::get('/hr/attendance', function () { return Inertia::render('HrAttendance'); });
    Route::get('/hr/leaves', function () { return Inertia::render('HrLeaves'); });
    Route::get('/hr/payroll', function () { return Inertia::render('HrPayroll'); });
    Route::get('/hr/departments', function () { return Inertia::render('HrDepartments'); });
    Route::get('/reports', function () { return Inertia::render('Reports'); });
    Route::get('/ai', function () { return Inertia::render('Ai'); });
    Route::get('/settings', function () { return Inertia::render('Settings'); });
    Route::get('/profile', function () { return Inertia::render('Profile'); });
    Route::get('/portal', function () { return Inertia::render('Portal'); });
    Route::get('/notifications', function () { return Inertia::render('Notifications'); });
});
