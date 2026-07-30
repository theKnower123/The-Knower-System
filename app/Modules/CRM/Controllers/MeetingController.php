<?php

namespace App\Modules\CRM\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Projects\Models\Meeting;

class MeetingController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Meeting::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client_id' => 'nullable',
            'project_id' => 'nullable',
            'description' => 'nullable|string',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date',
            'location' => 'nullable|string',
        ]);

        $meeting = Meeting::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Meeting created successfully.',
            'data' => $meeting
        ], 201);
    }

    public function show(Meeting $meeting)
    {
        return response()->json([
            'success' => true,
            'data' => $meeting
        ]);
    }

    public function update(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'client_id' => 'nullable',
            'project_id' => 'nullable',
            'description' => 'nullable|string',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date',
            'location' => 'nullable|string',
        ]);

        $meeting->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Meeting updated successfully.',
            'data' => $meeting
        ]);
    }

    public function destroy(Meeting $meeting)
    {
        $meeting->delete();

        return response()->json([
            'success' => true,
            'message' => 'Meeting deleted successfully.'
        ]);
    }
}
