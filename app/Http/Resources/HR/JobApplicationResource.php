<?php

namespace App\Http\Resources\HR;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class JobApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'jobPostingId' => (string) $this->job_posting_id,
            'jobTitle' => $this->whenLoaded('jobPosting', fn() => $this->jobPosting->title),
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'name' => trim($this->first_name . ' ' . $this->last_name),
            'email' => $this->email,
            'phone' => $this->phone,
            'resumeUrl' => $this->resume_path ? Storage::url($this->resume_path) : null,
            'coverLetter' => $this->cover_letter,
            'portfolioUrl' => $this->portfolio_url,
            'status' => $this->status,
            'notes' => $this->notes,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
