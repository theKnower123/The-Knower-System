<?php

namespace App\Modules\Core\Controllers;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Modules\CRM\Models\Client;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Models\Task;
use App\Modules\Finance\Models\Invoice;
use App\Modules\Support\Models\Ticket;
use App\Modules\Hosting\Models\Domain;
use App\Modules\Hosting\Models\HostingAccount;
use App\Modules\Auth\Models\User;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $now = now();

        // ─── KPI Stats ────────────────────────────────────────────────────────
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

        // ─── Recent Projects ─────────────────────────────────────────────────
        $recentProjects = Project::with('client')
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'status', 'priority', 'deadline', 'progress', 'client_id']);

        // ─── Recent Tickets ───────────────────────────────────────────────────
        $recentTickets = Ticket::with('client')
            ->latest()
            ->take(5)
            ->get(['id', 'subject', 'status', 'priority', 'created_at', 'client_id']);

        // ─── Revenue Chart (last 6 months) ───────────────────────────────────
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

        // ─── Tasks by Status ─────────────────────────────────────────────────
        $tasksByStatus = [
            'todo'        => Task::where('status', 'todo')->count(),
            'in_progress' => Task::where('status', 'in_progress')->count(),
            'review'      => Task::where('status', 'review')->count(),
            'done'        => Task::where('status', 'done')->count(),
        ];

        return Inertia::render('Dashboard', [
            'stats'          => $stats,
            'recentProjects' => $recentProjects,
            'recentTickets'  => $recentTickets,
            'revenueChart'   => $revenueChart,
            'tasksByStatus'  => $tasksByStatus,
        ]);
    }
}
