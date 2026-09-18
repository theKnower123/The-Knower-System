<?php

namespace App\Modules\HR\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJobApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        $app = $this->route('job_application') ?? $this->route('job_application_id');
        if (is_numeric($app) || is_string($app)) {
            $app = \App\Modules\HR\Models\JobApplication::find($app);
        }
        if ($app) {
            return $this->user()->can('update', $app);
        }
        return $this->user()->hasPermissionTo('hr.manage') || $this->user()->hasPermissionTo('hr.view');
    }

    public function rules(): array
    {
        return [
            'status' => 'sometimes|in:pending,reviewing,interviewing,hired,rejected',
            'notes' => 'nullable|string',
        ];
    }
}
