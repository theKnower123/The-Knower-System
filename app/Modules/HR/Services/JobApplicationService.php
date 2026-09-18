<?php

namespace App\Modules\HR\Services;

use App\Modules\HR\Models\JobApplication;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class JobApplicationService
{
    public function getAll(): Collection
    {
        return JobApplication::trashMode()->with('jobPosting')->orderBy("id", "desc")->get();
    }

    public function findExisting(int $jobPostingId, string $email, ?string $phone = null): ?JobApplication
    {
        $cleanEmail = strtolower(trim($email));
        $cleanPhone = $phone ? trim($phone) : null;

        return JobApplication::withoutGlobalScopes()
            ->with('jobPosting')
            ->where('job_posting_id', $jobPostingId)
            ->where(function ($query) use ($cleanEmail, $cleanPhone) {
                $query->where('email', $cleanEmail);
                if ($cleanPhone !== null && $cleanPhone !== '') {
                    $query->orWhere('phone', $cleanPhone);
                }
            })
            ->latest('id')
            ->first();
    }

    public function create(array $data, ?UploadedFile $resume = null): JobApplication
    {
        if ($resume) {
            $path = $resume->store('resumes', 'public');
            $data['resume_path'] = $path;
        }

        if (empty($data['workspace_id'])) {
            if (!empty($data['job_posting_id'])) {
                $posting = \App\Modules\HR\Models\JobPosting::find($data['job_posting_id']);
                if ($posting) {
                    $data['workspace_id'] = $posting->workspace_id;
                }
            }
            if (empty($data['workspace_id'])) {
                $data['workspace_id'] = Auth::check() ? (Auth::user()->current_workspace_id ?? 1) : 1;
            }
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
