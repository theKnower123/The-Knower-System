<?php

namespace App\Modules\HR\Services;

use App\Modules\HR\Models\JobPosting;
use Illuminate\Database\Eloquent\Collection;

class JobPostingService
{
    public function getAll(): Collection
    {
        return JobPosting::with('department')->latest()->get();
    }

    public function getActive(): Collection
    {
        return JobPosting::with('department')
            ->where('status', 'published')
            ->where(function($q) {
                $q->whereNull('closing_date')
                  ->orWhere('closing_date', '>=', now());
            })
            ->latest()
            ->get();
    }

    public function create(array $data): JobPosting
    {
        return JobPosting::create($data);
    }

    public function update(JobPosting $jobPosting, array $data): JobPosting
    {
        $jobPosting->update($data);
        return $jobPosting;
    }

    public function delete(JobPosting $jobPosting): ?bool
    {
        return $jobPosting->delete();
    }
}
