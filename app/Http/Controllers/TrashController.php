<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TrashController extends Controller
{
    protected $modelMap = [
        'companies' => \App\Modules\CRM\Models\Company::class,
        'clients' => \App\Modules\CRM\Models\Client::class,
        'contacts' => \App\Modules\CRM\Models\Contact::class,
        'leads' => \App\Modules\CRM\Models\Lead::class,
        'meetings' => \App\Modules\Projects\Models\Meeting::class,
        'quotations' => \App\Modules\CRM\Models\Quotation::class,
        'contracts' => \App\Modules\CRM\Models\Contract::class,
        'projects' => \App\Modules\Projects\Models\Project::class,
        'milestones' => \App\Modules\Projects\Models\Milestone::class,
        'tasks' => \App\Modules\Projects\Models\Task::class,
        'bugs' => \App\Modules\Projects\Models\Bug::class,
        'files' => \App\Modules\Projects\Models\File::class,
        'invoices' => \App\Modules\Finance\Models\Invoice::class,
        'payments' => \App\Modules\Finance\Models\Payment::class,
        'expenses' => \App\Modules\Finance\Models\Expense::class,
        'domains' => \App\Modules\Hosting\Models\Domain::class,
        'hosting' => \App\Modules\Hosting\Models\HostingAccount::class,
        'servers' => \App\Modules\Hosting\Models\Server::class,
        'ssl' => \App\Modules\Hosting\Models\SslCertificate::class,
        'tickets' => \App\Modules\Support\Models\Ticket::class,
        'employees' => \App\Modules\HR\Models\Employee::class,
        'departments' => \App\Modules\HR\Models\Department::class,
        'attendance' => \App\Modules\HR\Models\Attendance::class,
        'leaves' => \App\Modules\HR\Models\Leave::class,
        'marketing-plans' => \App\Modules\CMS\Models\MarketingPlan::class,
        'testimonials' => \App\Modules\CMS\Models\Testimonial::class,
        'faqs' => \App\Modules\CMS\Models\Faq::class,
        'blog-posts' => \App\Modules\CMS\Models\BlogPost::class,
        'team-members' => \App\Modules\CMS\Models\TeamMember::class,
        'services-cms' => \App\Modules\CMS\Models\Service::class,
        'roles' => \App\Modules\Core\Models\Role::class, // if needed
    ];

    protected function getModelClass($module)
    {
        if (isset($this->modelMap[$module])) {
            return $this->modelMap[$module];
        }
        abort(404, "Module $module not found.");
    }

    public function restore($module, $id)
    {
        $class = $this->getModelClass($module);
        $record = $class::withTrashed()->find($id);
        if (!$record) abort(404);

        $policy = \Illuminate\Support\Facades\Gate::getPolicyFor($class);
        if ($policy && method_exists($policy, 'restore')) {
            \Illuminate\Support\Facades\Gate::authorize('restore', $record);
        } else {
            $user = auth()->user() ?? request()->user();
            if (!$user || (!in_array($user->role, ['admin', 'super_admin']) && !(method_exists($user, 'hasPermission') && $user->hasPermission('cms.manage')))) {
                abort(403, 'Unauthorized action.');
            }
        }

        $record->restore();
        return response()->json(['message' => 'Restored successfully.']);
    }

    public function forceDelete($module, $id)
    {
        $class = $this->getModelClass($module);
        $record = $class::withTrashed()->find($id);
        if (!$record) abort(404);

        $policy = \Illuminate\Support\Facades\Gate::getPolicyFor($class);
        if ($policy && method_exists($policy, 'forceDelete')) {
            \Illuminate\Support\Facades\Gate::authorize('forceDelete', $record);
        } else {
            $user = auth()->user() ?? request()->user();
            if (!$user || (!in_array($user->role, ['admin', 'super_admin']) && !(method_exists($user, 'hasPermission') && $user->hasPermission('cms.manage')))) {
                abort(403, 'Unauthorized action.');
            }
        }

        $record->forceDelete();
        return response()->json(['message' => 'Permanently deleted successfully.']);
    }
}
