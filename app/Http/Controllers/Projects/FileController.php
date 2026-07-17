<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Http\Requests\Projects\StoreFileRequest;
use App\Http\Requests\Projects\UpdateFileRequest;
use App\Http\Resources\Projects\FileResource;
use App\Models\File;
use App\Services\Projects\FileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class FileController extends Controller
{
    protected FileService $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', File::class);

        $files = $this->fileService->getAll();
        
        // Load relations if needed
        $files->load(['project', 'uploader']);

        return response()->json([
            'success' => true,
            'message' => 'Files retrieved successfully.',
            'data' => FileResource::collection($files)
        ]);
    }

    public function store(StoreFileRequest $request): JsonResponse
    {
        $file = $this->fileService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'File created successfully.',
            'data' => new FileResource($file)
        ], 201);
    }

    public function show(File $file): JsonResponse
    {
        Gate::authorize('view', $file);

        return response()->json([
            'success' => true,
            'message' => 'File retrieved successfully.',
            'data' => new FileResource($file)
        ]);
    }

    public function update(UpdateFileRequest $request, File $file): JsonResponse
    {
        $file = $this->fileService->update($file, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'File updated successfully.',
            'data' => new FileResource($file)
        ]);
    }

    public function destroy(File $file): JsonResponse
    {
        Gate::authorize('delete', $file);

        $this->fileService->delete($file);

        return response()->json([
            'success' => true,
            'message' => 'File deleted successfully.',
            'data' => null
        ]);
    }
}
