<?php

namespace App\Modules\Projects\Services;

use App\Modules\Projects\Models\File;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;

class FileService
{
    public function getAll(): Collection
    {
        return File::trashMode()->orderBy("id", "desc")->get();
    }

    public function getForProject(int $projectId): Collection
    {
        return File::trashMode()->where('project_id', $projectId)->orderBy('id', 'desc')->get();
    }

    public function create(array $data): File
    {
        return File::create($data);
    }

    public function storeUpload(int $projectId, UploadedFile $file, ?int $uploadedBy = null): File
    {
        $path = $file->store('projects/' . $projectId . '/files', 'public');

        return $this->create([
            'project_id' => $projectId,
            'uploaded_by' => $uploadedBy ?? Auth::id(),
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'size' => $file->getSize(),
            'type' => $file->getClientMimeType(),
        ]);
    }

    public function update(File $file, array $data): File
    {
        $file->update($data);
        return $file;
    }

    public function delete(File $file): ?bool
    {
        return $file->delete();
    }
}
