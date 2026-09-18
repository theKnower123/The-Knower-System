<?php

namespace App\Modules\HR\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJobPostingRequest extends FormRequest
{
    public function authorize(): bool
    {
        $posting = $this->route('job_posting') ?? $this->route('job_posting_id');
        if (is_numeric($posting) || is_string($posting)) {
            $posting = \App\Modules\HR\Models\JobPosting::find($posting);
        }
        if ($posting) {
            return $this->user()->can('update', $posting);
        }
        return $this->user()->hasPermissionTo('hr.manage') || $this->user()->hasPermissionTo('hr.view');
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'type' => 'sometimes|in:full-time,part-time,contract,internship',
            'location' => 'nullable|string|max:255',
            'description' => 'sometimes|string',
            'requirements' => 'nullable|string',
            'status' => 'sometimes|in:draft,published,closed',
            'closing_date' => 'nullable|date',
        ];
    }
}
