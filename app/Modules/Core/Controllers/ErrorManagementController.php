<?php

namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Models\ErrorLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ErrorManagementController extends Controller
{
    public function dashboard()
    {
        $today = Carbon::today();

        // Summary counts
        $todayErrors = ErrorLog::whereDate('created_at', $today)->count();
        $errors500 = ErrorLog::where('status_code', 500)->whereDate('created_at', $today)->count();
        $errors404 = ErrorLog::where('status_code', 404)->whereDate('created_at', $today)->count();
        $errors422 = ErrorLog::where('status_code', 422)->whereDate('created_at', $today)->count();
        $errors429 = ErrorLog::where('status_code', 429)->whereDate('created_at', $today)->count();

        // Top errors
        $topErrors = ErrorLog::select('message', 'status_code', DB::raw('count(*) as total'))
            ->groupBy('message', 'status_code')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        // Latest exceptions
        $latestExceptions = ErrorLog::orderByDesc('created_at')
            ->limit(10)
            ->get(['id', 'message', 'status_code', 'url', 'created_at', 'exception_type']);

        return Inertia::render('Admin/Errors/Dashboard', [
            'stats' => [
                'today' => $todayErrors,
                'error_500' => $errors500,
                'error_404' => $errors404,
                'error_422' => $errors422,
                'error_429' => $errors429,
            ],
            'topErrors' => $topErrors,
            'latestExceptions' => $latestExceptions,
        ]);
    }

    public function analytics()
    {
        $errorsByDay = ErrorLog::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as total'))
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get();

        $errorsByModule = ErrorLog::select('module', DB::raw('count(*) as total'))
            ->groupBy('module')
            ->orderByDesc('total')
            ->get();

        return Inertia::render('Admin/Errors/Analytics', [
            'errorsByDay' => $errorsByDay,
            'errorsByModule' => $errorsByModule,
        ]);
    }

    public function developerCenter(Request $request)
    {
        $query = ErrorLog::query()->with('user');

        if ($request->has('status_code')) {
            $query->where('status_code', $request->status_code);
        }

        if ($request->has('search')) {
            $query->where('message', 'like', '%' . $request->search . '%')
                  ->orWhere('url', 'like', '%' . $request->search . '%');
        }

        $logs = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Errors/DeveloperCenter', [
            'logs' => $logs,
            'filters' => $request->only(['status_code', 'search'])
        ]);
    }

    public function show($id)
    {
        $errorLog = ErrorLog::with('user')->findOrFail($id);

        return Inertia::render('Admin/Errors/Show', [
            'errorLog' => $errorLog
        ]);
    }
}
