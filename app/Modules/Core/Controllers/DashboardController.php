<?php

namespace App\Modules\Core\Controllers;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Modules\CRM\Models\Client;
use App\Modules\CRM\Models\Contract;
use App\Modules\CRM\Models\Quotation;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Models\Task;
use App\Modules\Projects\Models\Bug;
use App\Modules\Finance\Models\Invoice;
use App\Modules\Finance\Models\Payment;
use App\Modules\Support\Models\Ticket;
use App\Modules\Hosting\Models\Domain;
use App\Modules\Hosting\Models\HostingAccount;
use App\Modules\Auth\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->role ?? 'client';

        // Client role: return client-specific portal data
        if ($role === 'client') {
            return $this->clientDashboard($user);
        }

        // Developer/Designer/QA: return their assigned work
        if (in_array($role, ['developer', 'designer', 'qa'])) {
            return $this->developerDashboard($user);
        }

        // HR: return HR-focused data
        if ($role === 'hr') {
            return $this->hrDashboard($user);
        }

        // Default: full admin/CEO/manager dashboard
        return $this->adminDashboard($user);
    }

    /**
     * Admin/CEO/Manager/Super Admin dashboard — full system overview.
     */
    protected function adminDashboard($user)
    {
        $now = now();

        $stats = [
            'total_clients'          => Client::count(),
            'new_clients_this_month' => Client::whereMonth('created_at', $now->month)
                                              ->whereYear('created_at', $now->year)
                                              ->count(),
            'active_projects'        => Project::where('status', 'active')->count(),
            'completed_projects'     => Project::where('status', 'completed')->count(),
            'overdue_projects'       => Project::where('status', 'active')
                                               ->where('deadline', '<', $now->toDateString())
                                               ->count(),
            'pending_tasks'          => Task::whereIn('status', ['todo', 'in_progress'])->count(),
            'overdue_tasks'          => Task::where('due_date', '<', $now->toDateString())
                                           ->where('status', '!=', 'done')
                                           ->count(),
            'monthly_revenue'        => Invoice::where('status', 'paid')
                                              ->whereMonth('updated_at', $now->month)
                                              ->whereYear('updated_at', $now->year)
                                              ->sum('amount'),
            'unpaid_invoices'        => Invoice::where('status', 'sent')->count(),
            'unpaid_invoices_amount' => Invoice::where('status', 'sent')->sum('amount'),
            'open_tickets'           => Ticket::whereIn('status', ['open', 'in_progress'])->count(),
            'online_employees'       => User::where('last_login_at', '>=', $now->subMinutes(15))
                                           ->count(),
            'domains_expiring_soon'  => Domain::where('expiry_date', '<=', $now->copy()->addDays(30))
                                             ->where('status', 'active')
                                             ->count(),
            'hosting_expiring_soon'  => HostingAccount::where('expiry_date', '<=', $now->copy()->addDays(30))
                                                      ->where('status', 'active')
                                                      ->count(),
        ];

        $recentProjects = Project::with('client')
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'status', 'priority', 'deadline', 'progress', 'client_id']);

        $recentTickets = Ticket::with('client')
            ->latest()
            ->take(5)
            ->get(['id', 'subject', 'status', 'priority', 'created_at', 'client_id']);

        $revenueChart = collect(range(5, 0))->map(function ($monthsAgo) {
            $date = now()->subMonths($monthsAgo);
            return [
                'month'   => $date->format('M Y'),
                'revenue' => Invoice::where('status', 'paid')
                    ->whereYear('updated_at', $date->year)
                    ->whereMonth('updated_at', $date->month)
                    ->sum('amount'),
            ];
        });

        $tasksByStatus = [
            'todo'        => Task::where('status', 'todo')->count(),
            'in_progress' => Task::where('status', 'in_progress')->count(),
            'review'      => Task::where('status', 'review')->count(),
            'done'        => Task::where('status', 'done')->count(),
        ];

        return Inertia::render('Dashboard', [
            'dashboardType'  => 'admin',
            'stats'          => $stats,
            'recentProjects' => $recentProjects,
            'recentTickets'  => $recentTickets,
            'revenueChart'   => $revenueChart,
            'tasksByStatus'  => $tasksByStatus,
        ]);
    }

    /**
     * Client Portal dashboard — only the client's own data.
     */
    protected function clientDashboard($user)
    {
        $client = Client::where('user_id', $user->id)->first();

        if (!$client) {
            return Inertia::render('Dashboard', [
                'dashboardType'   => 'client',
                'clientStats'     => [
                    'active_projects'  => 0,
                    'open_tickets'     => 0,
                    'unpaid_invoices'  => 0,
                    'signed_contracts' => 0,
                    'total_payments'   => 0,
                ],
                'clientProjects'  => [],
                'clientInvoices'  => [],
                'clientTickets'   => [],
                'clientContracts' => [],
            ]);
        }

        $clientStats = [
            'active_projects'  => Project::where('client_id', $client->id)
                                         ->whereIn('status', ['active', 'in_progress'])
                                         ->count(),
            'open_tickets'     => Ticket::where('client_id', $client->id)
                                        ->whereIn('status', ['open', 'in_progress'])
                                        ->count(),
            'unpaid_invoices'  => Invoice::where('client_id', $client->id)
                                         ->whereIn('status', ['sent', 'overdue'])
                                         ->count(),
            'signed_contracts' => Contract::where('client_id', $client->id)->count(),
            'total_payments'   => Payment::where('client_id', $client->id)
                                         ->sum('amount'),
        ];

        $clientProjects = Project::where('client_id', $client->id)
            ->latest()
            ->take(10)
            ->get(['id', 'name', 'status', 'priority', 'deadline', 'progress']);

        $clientInvoices = Invoice::where('client_id', $client->id)
            ->latest()
            ->take(10)
            ->get();

        $clientTickets = Ticket::where('client_id', $client->id)
            ->latest()
            ->take(10)
            ->get(['id', 'subject', 'status', 'priority', 'created_at']);

        $clientContracts = Contract::where('client_id', $client->id)
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Dashboard', [
            'dashboardType'   => 'client',
            'clientStats'     => $clientStats,
            'clientProjects'  => $clientProjects,
            'clientInvoices'  => $clientInvoices,
            'clientTickets'   => $clientTickets,
            'clientContracts' => $clientContracts,
        ]);
    }

    /**
     * Developer/Designer/QA dashboard — their assigned tasks.
     */
    protected function developerDashboard($user)
    {
        $now = now();

        $myTasks = Task::where('assigned_to', $user->id)
            ->whereIn('status', ['todo', 'in_progress', 'review'])
            ->latest()
            ->take(10)
            ->get();

        $myBugs = Bug::where('assigned_to', $user->id)
            ->whereIn('status', ['open', 'in_progress'])
            ->latest()
            ->take(5)
            ->get();

        $stats = [
            'my_tasks_todo'        => Task::where('assigned_to', $user->id)->where('status', 'todo')->count(),
            'my_tasks_in_progress' => Task::where('assigned_to', $user->id)->where('status', 'in_progress')->count(),
            'my_tasks_review'      => Task::where('assigned_to', $user->id)->where('status', 'review')->count(),
            'my_tasks_done'        => Task::where('assigned_to', $user->id)->where('status', 'done')->count(),
            'my_open_bugs'         => Bug::where('assigned_to', $user->id)->whereIn('status', ['open', 'in_progress'])->count(),
        ];

        return Inertia::render('Dashboard', [
            'dashboardType' => 'developer',
            'devStats'      => $stats,
            'myTasks'       => $myTasks,
            'myBugs'        => $myBugs,
        ]);
    }

    /**
     * HR dashboard — employee and attendance overview.
     */
    protected function hrDashboard($user)
    {
        $now = now();

        $stats = [
            'total_employees'    => User::where('role', '!=', 'client')->count(),
            'online_employees'   => User::where('last_login_at', '>=', $now->subMinutes(15))->count(),
            'pending_leaves'     => \App\Modules\HR\Models\Leave::where('status', 'pending')->count(),
            'open_job_postings'  => \App\Modules\HR\Models\JobPosting::where('status', 'active')->count(),
        ];

        return Inertia::render('Dashboard', [
            'dashboardType' => 'hr',
            'hrStats'       => $stats,
        ]);
    }
}
