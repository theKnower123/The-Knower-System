<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\CMS\Models\TeamMember;

class TeamMemberController extends Controller
{
    public function index() { return response()->json(["data" => TeamMember::trashMode()->latest()->get()]); }
    public function store(Request $request) { return response()->json(["data" => TeamMember::create($request->all())]); }
    public function show($id) { return response()->json(["data" => TeamMember::trashMode()->findOrFail($id)]); }
    public function update(Request $request, $id) { $model = TeamMember::withTrashed()->findOrFail($id); $model->update($request->all()); return response()->json(["data" => $model]); }
    public function destroy($id) { $model = TeamMember::findOrFail($id); $model->delete(); return response()->json(["message" => "Deleted"]); }
}
