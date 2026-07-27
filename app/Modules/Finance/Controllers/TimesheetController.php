<?php

namespace App\Modules\Finance\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Finance\Models\HourlyRate;
use App\Modules\Finance\Models\Timesheet;
use App\Modules\Projects\Models\TimeLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimesheetController extends Controller
{
    public function index(Request $request)
    {
        $timesheets = Timesheet::with(['user', 'approver'])
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(20);

        return Inertia::render('Finance/Timesheets', ['timesheets' => $timesheets]);
    }

    // Generates a pending timesheet for a user/period from raw time_logs
    public function generate(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
        ]);

        $timesheet = Timesheet::firstOrCreate($data, ['status' => 'pending']);

        return back()->with('success', "Timesheet #{$timesheet->id} generated.");
    }

    public function approve(Request $request, Timesheet $timesheet)
    {
        $this->authorize('approve', $timesheet); // requires a TimesheetPolicy

        $timesheet->approve($request->user());

        // Once approved, this feeds Finance/Revenue as a real cost line:
        // hours logged in period x HourlyRate for (user, project)

        return back()->with('success', 'Timesheet approved and locked.');
    }

    public function projectCost(int $projectId)
    {
        $logs = TimeLog::where('project_id', $projectId)
            ->whereHas('timesheet', fn ($q) => $q->where('status', 'approved'))
            ->get();

        $cost = $logs->sum(function ($log) use ($projectId) {
            $rate = HourlyRate::where('user_id', $log->user_id)
                ->where(fn ($q) => $q->where('project_id', $projectId)->orWhereNull('project_id'))
                ->latest('effective_from')
                ->value('rate_per_hour') ?? 0;

            return ($log->duration_minutes / 60) * $rate;
        });

        return response()->json(['project_id' => $projectId, 'labor_cost' => round($cost, 2)]);
    }
}
