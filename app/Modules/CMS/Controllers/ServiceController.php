<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\CMS\Models\Service;

class ServiceController extends Controller
{
    public function index() { return response()->json(["data" => Service::trashMode()->latest()->get()]); }
    public function store(Request $request) { return response()->json(["data" => Service::create($request->all())]); }
    public function show(Service $model) { return response()->json(["data" => $model]); }
    public function update(Request $request, Service $model) { $model->update($request->all()); return response()->json(["data" => $model]); }
    public function destroy(Service $model) { $model->delete(); return response()->json(["message" => "Deleted"]); }
}
