<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\CMS\Models\BlogPost;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    public function index()
    {
        return response()->json(["data" => BlogPost::trashMode()->latest()->get()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'body' => 'nullable|string',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'is_published' => 'nullable|boolean',
            'author_name' => 'nullable|string|max:255',
        ]);

        $data = $request->except('cover_image');

        // Handle image upload
        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('blog-images', $filename, 'public');
            $data['cover_image'] = '/storage/' . $path;
        }

        $post = BlogPost::create($data);

        return response()->json(["data" => $post], 201);
    }

    public function show($id)
    {
        $model = BlogPost::trashMode()->findOrFail($id);
        return response()->json(["data" => $model]);
    }

    public function update(Request $request, $id)
    {
        $model = BlogPost::withTrashed()->findOrFail($id);
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $data = $request->except('cover_image');

        // Handle image upload
        if ($request->hasFile('cover_image')) {
            // Delete old image if exists
            if ($model->cover_image) {
                $oldPath = str_replace('/storage/', '', $model->cover_image);
                Storage::disk('public')->delete($oldPath);
            }

            $file = $request->file('cover_image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('blog-images', $filename, 'public');
            $data['cover_image'] = '/storage/' . $path;
        }

        $model->update($data);
        return response()->json(["data" => $model->fresh()]);
    }

    public function destroy($id)
    {
        $model = BlogPost::findOrFail($id);
        // Delete cover image when post is permanently deleted
        if ($model->cover_image) {
            $path = str_replace('/storage/', '', $model->cover_image);
            Storage::disk('public')->delete($path);
        }

        $model->delete();
        return response()->json(["message" => "Deleted"]);
    }
}
