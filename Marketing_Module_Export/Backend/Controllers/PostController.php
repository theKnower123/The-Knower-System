<?php

namespace App\Modules\Marketing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Marketing\Models\Post;
use App\Modules\Marketing\Requests\StorePostRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['creator', 'approver', 'accounts']);

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('account_id')) {
            $query->whereHas('accounts', function ($q) use ($request) {
                $q->where('social_accounts.id', $request->query('account_id'));
            });
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where('content', 'like', "%{$search}%");
        }

        $posts = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Marketing/Calendar', [
            'posts' => $posts,
            'filters' => $request->only(['status', 'account_id', 'search']),
        ]);
    }

    public function store(StorePostRequest $request)
    {
        $validated = $request->validated();
        $mediaPath = null;

        if ($request->hasFile('media')) {
            $mediaPath = $request->file('media')->store('marketing_media', 'public');
        } elseif ($request->filled('media_path')) {
            $mediaPath = $request->input('media_path');
        }

        $status = $request->input('status', 'draft');

        $history = [
            [
                'status' => $status,
                'user_id' => $request->user()->id,
                'user_name' => $request->user()->name,
                'action' => 'created',
                'timestamp' => now()->toDateTimeString(),
            ]
        ];

        $post = Post::create([
            'content' => $validated['content'],
            'media_path' => $mediaPath,
            'scheduled_at' => $validated['scheduled_at'] ?? null,
            'created_by' => $request->user()->id,
            'status' => $status,
            'status_history' => $history,
        ]);

        $post->accounts()->sync($validated['account_ids']);

        activity()
            ->causedBy($request->user())
            ->performedOn($post)
            ->log("Created post #{$post->id} with status {$status}");

        return back()->with('success', 'Post created successfully.');
    }

    public function submitForApproval(Request $request, Post $post)
    {
        $history = $post->status_history ?? [];
        $history[] = [
            'status' => 'pending_approval',
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name,
            'action' => 'submitted_for_approval',
            'timestamp' => now()->toDateTimeString(),
        ];

        $post->update([
            'status' => 'pending_approval',
            'status_history' => $history,
        ]);

        activity()
            ->causedBy($request->user())
            ->performedOn($post)
            ->log("Submitted post #{$post->id} for approval");

        return back()->with('success', 'Submitted for approval.');
    }

    public function approve(Request $request, Post $post)
    {
        $newStatus = $post->scheduled_at && $post->scheduled_at->isFuture() ? 'scheduled' : 'published';

        $history = $post->status_history ?? [];
        $history[] = [
            'status' => $newStatus,
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name,
            'action' => 'approved',
            'timestamp' => now()->toDateTimeString(),
            'notes' => $request->input('notes'),
        ];

        $post->update([
            'status' => $newStatus,
            'approved_by' => $request->user()->id,
            'published_at' => $newStatus === 'published' ? now() : null,
            'rejection_reason' => null,
            'status_history' => $history,
        ]);

        activity()
            ->causedBy($request->user())
            ->performedOn($post)
            ->log("Approved post #{$post->id}");

        return back()->with('success', "Post approved and marked as {$newStatus}.");
    }

    public function requestChanges(Request $request, Post $post)
    {
        $request->validate(['reason' => ['required', 'string']]);

        $history = $post->status_history ?? [];
        $history[] = [
            'status' => 'rejected',
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name,
            'action' => 'requested_changes',
            'reason' => $request->reason,
            'timestamp' => now()->toDateTimeString(),
        ];

        $post->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
            'status_history' => $history,
        ]);

        activity()
            ->causedBy($request->user())
            ->performedOn($post)
            ->log("Requested changes for post #{$post->id}: {$request->reason}");

        return back()->with('success', 'Changes requested for post.');
    }

    public function bulkApprove(Request $request)
    {
        $request->validate([
            'post_ids' => ['required', 'array'],
            'post_ids.*' => ['exists:posts,id'],
        ]);

        $posts = Post::whereIn('id', $request->post_ids)->get();

        foreach ($posts as $post) {
            $newStatus = $post->scheduled_at && $post->scheduled_at->isFuture() ? 'scheduled' : 'published';
            $history = $post->status_history ?? [];
            $history[] = [
                'status' => $newStatus,
                'user_id' => $request->user()->id,
                'user_name' => $request->user()->name,
                'action' => 'bulk_approved',
                'timestamp' => now()->toDateTimeString(),
            ];

            $post->update([
                'status' => $newStatus,
                'approved_by' => $request->user()->id,
                'published_at' => $newStatus === 'published' ? now() : null,
                'rejection_reason' => null,
                'status_history' => $history,
            ]);

            activity()
                ->causedBy($request->user())
                ->performedOn($post)
                ->log("Bulk approved post #{$post->id}");
        }

        return back()->with('success', count($posts) . ' posts approved.');
    }

    public function bulkRequestChanges(Request $request)
    {
        $request->validate([
            'post_ids' => ['required', 'array'],
            'post_ids.*' => ['exists:posts,id'],
            'reason' => ['required', 'string'],
        ]);

        $posts = Post::whereIn('id', $request->post_ids)->get();

        foreach ($posts as $post) {
            $history = $post->status_history ?? [];
            $history[] = [
                'status' => 'rejected',
                'user_id' => $request->user()->id,
                'user_name' => $request->user()->name,
                'action' => 'bulk_requested_changes',
                'reason' => $request->reason,
                'timestamp' => now()->toDateTimeString(),
            ];

            $post->update([
                'status' => 'rejected',
                'rejection_reason' => $request->reason,
                'status_history' => $history,
            ]);

            activity()
                ->causedBy($request->user())
                ->performedOn($post)
                ->log("Bulk requested changes on post #{$post->id}: {$request->reason}");
        }

        return back()->with('success', count($posts) . ' posts marked for changes.');
    }
}
