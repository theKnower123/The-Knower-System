<?php

namespace App\Modules\Reports\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CRM\Models\Client;
use App\Modules\Projects\Models\Project;
use App\Modules\Finance\Models\Invoice;
use App\Modules\Finance\Models\Expense;
use App\Modules\Finance\Models\Payment;
use App\Modules\HR\Models\Employee;
use App\Modules\Support\Models\Ticket;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    // ── Revenue Report ─────────────────────────────────────────────────────────
    public function revenue(Request $request)
    {
        $year = $request->input('year', now()->year);

        $monthly = collect(range(1, 12))->map(function ($month) use ($year) {
            $revenue  = Invoice::where('status', 'paid')
                ->whereYear('updated_at', $year)
                ->whereMonth('updated_at', $month)
                ->sum('amount');

            $expenses = Expense::whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->sum('amount');

            return [
                'month'    => now()->month($month)->format('M'),
                'revenue'  => (float) $revenue,
                'expenses' => (float) $expenses,
                'profit'   => (float) ($revenue - $expenses),
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Revenue report generated.',
            'data' => [
                'year'          => $year,
                'total_revenue' => Invoice::where('status', 'paid')->whereYear('updated_at', $year)->sum('amount'),
                'total_expenses'=> Expense::whereYear('created_at', $year)->sum('amount'),
                'monthly'       => $monthly,
            ]
        ]);
    }

    // ── Projects Report ────────────────────────────────────────────────────────
    public function projects()
    {
        $summary = [
            'total'     => Project::count(),
            'planning'  => Project::where('status', 'planning')->count(),
            'active'    => Project::where('status', 'active')->count(),
            'on_hold'   => Project::where('status', 'on_hold')->count(),
            'completed' => Project::where('status', 'completed')->count(),
            'cancelled' => Project::where('status', 'cancelled')->count(),
            'overdue'   => Project::where('status', 'active')
                ->where('deadline', '<', now()->toDateString())
                ->count(),
        ];

        $projects = Project::with('client')->latest()->get(['id','name','status','priority','deadline','progress','client_id']);

        return response()->json([
            'success' => true,
            'message' => 'Projects report generated.',
            'data'    => compact('summary', 'projects'),
        ]);
    }

    // ── Clients Report ─────────────────────────────────────────────────────────
    public function clients()
    {
        $summary = [
            'total'    => Client::count(),
            'active'   => Client::where('status', 'active')->count(),
            'inactive' => Client::where('status', 'inactive')->count(),
            'prospect' => Client::where('status', 'prospect')->count(),
        ];

        $clients = Client::withCount(['projects', 'invoices', 'tickets'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Clients report generated.',
            'data'    => compact('summary', 'clients'),
        ]);
    }

    // ── Employees Report ───────────────────────────────────────────────────────
    public function employees()
    {
        $summary = [
            'total'      => Employee::count(),
            'active'     => Employee::where('status', 'active')->count(),
            'on_leave'   => Employee::where('status', 'on_leave')->count(),
            'terminated' => Employee::where('status', 'terminated')->count(),
        ];

        $employees = Employee::with('user')->latest('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'Employees report generated.',
            'data'    => compact('summary', 'employees'),
        ]);
    }

    // ── Finance Summary ────────────────────────────────────────────────────────
    public function finance()
    {
        $summary = [
            'total_invoiced'   => Invoice::sum('amount'),
            'total_paid'       => Invoice::where('status', 'paid')->sum('amount'),
            'total_unpaid'     => Invoice::where('status', 'sent')->sum('amount'),
            'total_expenses'   => Expense::sum('amount'),
            'total_payments'   => Payment::sum('amount'),
            'unpaid_invoices'  => Invoice::where('status', 'sent')->count(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Finance summary report generated.',
            'data'    => $summary,
        ]);
    }
}
