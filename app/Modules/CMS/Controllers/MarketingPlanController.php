<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\CMS\Models\MarketingPlan;

class MarketingPlanController extends Controller
{
    public function index() { return response()->json(["data" => MarketingPlan::trashMode()->latest()->get()]); }
    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string',
            'plan_type' => 'required|string',
        ]);
        return response()->json(["data" => MarketingPlan::create($request->all())]);
    }
    public function show($id)
    {
        $model = MarketingPlan::trashMode()->findOrFail($id);
        return response()->json(["data" => $model]);
    }

    public function update(Request $request, $id)
    {
        $model = MarketingPlan::withTrashed()->findOrFail($id);
        $model->update($request->all());
        return response()->json(["data" => $model]);
    }

    public function destroy($id)
    {
        $model = MarketingPlan::findOrFail($id);
        $model->delete();
        return response()->json(["message" => "Deleted"]);
    }
}
