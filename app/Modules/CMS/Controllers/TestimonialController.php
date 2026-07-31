<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\CMS\Models\Testimonial;

class TestimonialController extends Controller
{
    public function index() { return response()->json(["data" => Testimonial::trashMode()->latest()->get()]); }
    public function store(Request $request) { return response()->json(["data" => Testimonial::create($request->all())]); }
    public function show(Testimonial $model) { return response()->json(["data" => $model]); }
    public function update(Request $request, Testimonial $model) { $model->update($request->all()); return response()->json(["data" => $model]); }
    public function destroy(Testimonial $model) { $model->delete(); return response()->json(["message" => "Deleted"]); }
}
