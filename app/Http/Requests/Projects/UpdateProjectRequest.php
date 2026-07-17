<?php

namespace App\Http\Requests\Projects;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('project'));
    }

    public function rules(): array
    {
        return [

            'client_id' => 'nullable|exists:clients,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|max:100',
            'status' => 'sometimes|required|in:planning,active,on_hold,completed,cancelled',
            'priority' => 'sometimes|required|in:low,medium,high,urgent',
            'start_date' => 'nullable|date',
            'deadline' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'nullable|numeric|min:0',
            'progress' => 'nullable|integer|between:0,100',
        
        ];
    }
}
