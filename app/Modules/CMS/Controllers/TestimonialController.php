<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\CMS\Models\Testimonial;

class TestimonialController extends Controller
{
    public function index() { return response()->json(["data" => Testimonial::trashMode()->latest()->get()]); }
    public function store(Request $request) { return response()->json(["data" => Testimonial::create($request->all())]); }
    public function show($id) { return response()->json(["data" => Testimonial::trashMode()->findOrFail($id)]); }
    public function update(Request $request, $id) { $model = Testimonial::withTrashed()->findOrFail($id); $model->update($request->all()); return response()->json(["data" => $model]); }
    public function destroy($id) { $model = Testimonial::findOrFail($id); $model->delete(); return response()->json(["message" => "Deleted"]); }
}
