<?php

namespace App\Modules\AI\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\AI\Models\AiSuggestion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AiSuggestionController extends Controller
{
    public function index()
    {
        return Inertia::render('Ai/Suggestions', [
            'pending' => AiSuggestion::where('status', 'pending')->latest()->paginate(20),
        ]);
    }

    public function accept(Request $request, AiSuggestion $suggestion)
    {
        $suggestion->accept($request->user());

        // TODO: apply the suggestion to its target_table/target_id based on suggestion_type

        return back()->with('success', 'Suggestion accepted and applied.');
    }

    public function reject(Request $request, AiSuggestion $suggestion)
    {
        $suggestion->reject($request->user());

        return back()->with('success', 'Suggestion rejected.');
    }
}
