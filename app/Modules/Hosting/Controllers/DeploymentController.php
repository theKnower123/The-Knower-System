<?php

namespace App\Modules\Hosting\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Hosting\Models\Deployment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeploymentController extends Controller
{
    // Rendered as a tab inside HostingServers$Id.tsx
    public function index(Request $request)
    {
        $deployments = Deployment::with(['project', 'server', 'deployedBy'])
            ->when($request->server_id, fn ($q) => $q->where('server_id', $request->server_id))
            ->when($request->project_id, fn ($q) => $q->where('project_id', $request->project_id))
            ->latest()
            ->paginate(20);

        return Inertia::render('Hosting/Deployments', ['deployments' => $deployments]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => ['required', 'exists:projects,id'],
            'server_id' => ['required', 'exists:servers,id'],
            'version_tag' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string'],
        ]);

        Deployment::create([...$data, 'deployed_by' => $request->user()->id]);

        return back()->with('success', 'Deployment logged.');
    }
}
