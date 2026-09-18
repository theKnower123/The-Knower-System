<?php

namespace App\Modules\Marketing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class MarketingActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with('causer')
            ->latest();

        // Search
        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('log_name', 'like', "%{$search}%")
                  ->orWhere('subject_type', 'like', "%{$search}%");
            });
        }

        // Filter by Module / Subject Type
        if ($request->filled('module')) {
            $module = $request->query('module');
            if ($module === 'social_accounts') {
                $query->where('subject_type', 'LIKE', '%SocialAccount%');
            } elseif ($module === 'posts') {
                $query->where('subject_type', 'LIKE', '%Post%');
            } elseif ($module === 'campaigns') {
                $query->where('subject_type', 'LIKE', '%Campaign%');
            } elseif ($module === 'landing') {
                $query->where(function($q) {
                    $q->where('subject_type', 'LIKE', '%LandingSection%')
                      ->orWhere('subject_type', 'LIKE', '%PortfolioEntry%')
                      ->orWhere('subject_type', 'LIKE', '%Testimonial%');
                });
            } elseif ($module === 'leads') {
                $query->where('subject_type', 'LIKE', '%Lead%');
            }
        }

        // Filter by Actor (Causer)
        if ($request->filled('actor_id')) {
            $query->where('causer_id', $request->query('actor_id'));
        }

        // Filter by Date Range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->query('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->query('date_to'));
        }

        $logs = $query->paginate(30)->withQueryString();
        $actors = User::select('id', 'name')->get();

        return Inertia::render('Marketing/ActivityLog', [
            'logs' => $logs,
            'actors' => $actors,
            'filters' => $request->only(['search', 'module', 'actor_id', 'date_from', 'date_to']),
        ]);
    }
}
