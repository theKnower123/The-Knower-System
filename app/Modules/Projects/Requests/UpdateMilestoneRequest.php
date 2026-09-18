<?php

namespace App\Modules\Projects\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMilestoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('milestone'));
    }

    public function rules(): array
    {
        return [

            'project_id' => 'sometimes|required|exists:projects,id',
            'title' => 'sometimes|required|string|max:255',
            'deadline' => 'nullable|date',
            'progress' => 'nullable|integer|between:0,100',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
        
        ];
    }
}
