<?php

namespace App\Modules\Support\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Support\Models\KbArticle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KbArticleController extends Controller
{
    // Admin-side management
    public function index()
    {
        return Inertia::render('Support/KnowledgeBase', [
            'articles' => KbArticle::with('creator')->latest()->paginate(20),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'body' => ['required', 'string'],
            'is_published' => ['boolean'],
        ]);

        KbArticle::create([...$data, 'created_by' => $request->user()->id]);

        return back()->with('success', 'Article created.');
    }

    public function togglePublish(KbArticle $article)
    {
        $article->update(['is_published' => ! $article->is_published]);

        return back();
    }

    // Public-facing help center, used to suggest articles during ticket creation
    public function search(Request $request)
    {
        $query = $request->validate(['q' => ['required', 'string']])['q'];

        $results = KbArticle::published()
            ->where(function ($qBuilder) use ($query) {
                $qBuilder->where('title', 'like', "%{$query}%")
                    ->orWhere('body', 'like', "%{$query}%");
            })
            ->limit(5)
            ->get(['id', 'title', 'category']);

        return response()->json($results);
    }
}
