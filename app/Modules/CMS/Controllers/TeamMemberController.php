<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\CMS\Models\TeamMember;

class TeamMemberController extends Controller
{
    public function index() { return response()->json(["data" => TeamMember::trashMode()->latest()->get()]); }
    public function store(Request $request) { return response()->json(["data" => TeamMember::create($request->all())]); }
    public function show(TeamMember $model) { return response()->json(["data" => $model]); }
    public function update(Request $request, TeamMember $model) { $model->update($request->all()); return response()->json(["data" => $model]); }
    public function destroy(TeamMember $model) { $model->delete(); return response()->json(["message" => "Deleted"]); }
}
