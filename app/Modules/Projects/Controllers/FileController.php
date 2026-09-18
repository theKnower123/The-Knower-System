<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Requests\StoreFileRequest;
use App\Modules\Projects\Requests\UpdateFileRequest;
use App\Http\Resources\Projects\FileResource;
use App\Modules\Projects\Models\File;
use App\Modules\Projects\Services\FileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FileController extends Controller
{
    protected FileService $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function index(Request $request, $id = null): JsonResponse
    {
        Gate::authorize('viewAny', File::class);

        $projectId = $id ?? $request->route('id');
        $files = $projectId
            ? $this->fileService->getForProject((int) $projectId)
            : $this->fileService->getAll();

        $files->load(['project', 'uploader']);

        return response()->json([
            'success' => true,
            'message' => 'Files retrieved successfully.',
            'data' => FileResource::collection($files),
        ]);
    }

    public function store(StoreFileRequest $request, $id = null): JsonResponse
    {
        $projectId = (int) ($id ?? $request->route('id') ?? $request->input('project_id'));

        if ($request->hasFile('file')) {
            $file = $this->fileService->storeUpload($projectId, $request->file('file'), $request->user()?->id);
        } elseif ($request->hasFile('files')) {
            $uploaded = [];
            foreach ($request->file('files') as $upload) {
                $uploaded[] = $this->fileService->storeUpload($projectId, $upload, $request->user()?->id);
            }
            return response()->json([
                'success' => true,
                'message' => 'Files created successfully.',
                'data' => FileResource::collection(collect($uploaded)),
            ], 201);
        } else {
            $file = $this->fileService->create(array_merge($request->validated(), [
                'project_id' => $projectId,
                'uploaded_by' => $request->user()?->id,
            ]));
        }

        return response()->json([
            'success' => true,
            'message' => 'File created successfully.',
            'data' => new FileResource($file),
        ], 201);
    }

    public function show(File $file): JsonResponse
    {
        Gate::authorize('view', $file);

        return response()->json([
            'success' => true,
            'message' => 'File retrieved successfully.',
            'data' => new FileResource($file),
        ]);
    }

    public function update(UpdateFileRequest $request, File $file): JsonResponse
    {
        $file = $this->fileService->update($file, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'File updated successfully.',
            'data' => new FileResource($file),
        ]);
    }

    public function destroy(File $file): JsonResponse
    {
        Gate::authorize('delete', $file);

        $this->fileService->delete($file);

        return response()->json([
            'success' => true,
            'message' => 'File deleted successfully.',
            'data' => null,
        ]);
    }
}
