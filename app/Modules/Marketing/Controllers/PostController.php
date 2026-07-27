<?php

namespace App\Modules\Marketing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Marketing\Models\Post;
use App\Modules\Marketing\Requests\StorePostRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with(['creator', 'approver', 'accounts'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Marketing/Calendar', [
            'posts' => $posts,
        ]);
    }

    public function store(StorePostRequest $request)
    {
        $post = Post::create([
            ...$request->safe()->except('account_ids'),
            'created_by' => $request->user()->id,
            'status' => 'draft',
        ]);

        $post->accounts()->sync($request->validated()['account_ids']);

        return back()->with('success', 'Post created as draft.');
    }

    public function submitForApproval(Post $post)
    {
        $post->submitForApproval();

        // TODO: notify Marketing Admin / Manager

        return back()->with('success', 'Submitted for approval.');
    }

    public function approve(Request $request, Post $post)
    {
        $this->authorize('approve', $post); // requires a PostPolicy

        $post->approve($request->user());

        return back()->with('success', 'Post approved and scheduled.');
    }

    public function requestChanges(Request $request, Post $post)
    {
        $request->validate(['reason' => ['required', 'string']]);

        $post->update(['status' => 'draft']);

        // TODO: notify Content Writer with $request->reason

        return back()->with('success', 'Changes requested.');
    }
}
