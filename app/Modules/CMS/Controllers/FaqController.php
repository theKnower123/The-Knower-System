<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\CMS\Models\Faq;

class FaqController extends Controller
{
    public function index() { return response()->json(["data" => Faq::trashMode()->latest()->get()]); }
    public function store(Request $request) { return response()->json(["data" => Faq::create($request->all())]); }
    public function show(Faq $model) { return response()->json(["data" => $model]); }
    public function update(Request $request, Faq $model) { $model->update($request->all()); return response()->json(["data" => $model]); }
    public function destroy(Faq $model) { $model->delete(); return response()->json(["message" => "Deleted"]); }
}
