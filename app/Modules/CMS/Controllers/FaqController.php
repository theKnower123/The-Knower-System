<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\CMS\Models\Faq;

class FaqController extends Controller
{
    public function index() { return response()->json(["data" => Faq::trashMode()->latest()->get()]); }
    public function store(Request $request) { return response()->json(["data" => Faq::create($request->all())]); }
    public function show($id) { return response()->json(["data" => Faq::trashMode()->findOrFail($id)]); }
    public function update(Request $request, $id) { $model = Faq::withTrashed()->findOrFail($id); $model->update($request->all()); return response()->json(["data" => $model]); }
    public function destroy($id) { $model = Faq::findOrFail($id); $model->delete(); return response()->json(["message" => "Deleted"]); }
}
