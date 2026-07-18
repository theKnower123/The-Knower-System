<?php

namespace App\Modules\HR\Services;

use App\Modules\HR\Models\JobApplication;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class JobApplicationService
{
    public function getAll(): Collection
    {
        return JobApplication::with('jobPosting')->latest()->get();
    }

    public function create(array $data, ?UploadedFile $resume = null): JobApplication
    {
        if ($resume) {
            $path = $resume->store('resumes', 'public');
            $data['resume_path'] = $path;
        }

        return JobApplication::create($data);
    }

    public function update(JobApplication $jobApplication, array $data): JobApplication
    {
        $jobApplication->update($data);
        return $jobApplication;
    }

    public function delete(JobApplication $jobApplication): ?bool
    {
        if ($jobApplication->resume_path) {
            Storage::disk('public')->delete($jobApplication->resume_path);
        }
        return $jobApplication->delete();
    }
}
