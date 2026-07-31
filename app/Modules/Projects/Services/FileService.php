<?php

namespace App\Modules\Projects\Services;

use App\Modules\Projects\Models\File;
use Illuminate\Database\Eloquent\Collection;

class FileService
{
    public function getAll(): Collection
    {
        return File::trashMode()->orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): File
    {
        return File::create($data);
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
