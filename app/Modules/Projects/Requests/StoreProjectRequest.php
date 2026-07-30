<?php

namespace App\Modules\Projects\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Modules\Projects\Models\Project::class);
    }

    public function rules(): array
    {
        return [
            'client_id' => 'nullable|exists:clients,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|max:100',
            'status' => 'required|in:planning,active,in_progress,on_hold,completed,cancelled,overdue',
            'priority' => 'required|in:low,medium,high,urgent',
            'start_date' => 'nullable|date',
            'deadline' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'nullable|numeric|min:0',
            'progress' => 'nullable|integer|min:0|max:100',
            'tech_stack' => 'nullable|string',
            'language' => 'nullable|string',
            'github_link' => 'nullable|string|max:255',
            'assets_link' => 'nullable|string|max:255',
            'is_public' => 'nullable|boolean',
            'images' => 'nullable|array|max:5',
            'users' => 'nullable|array',
            'users.*' => 'exists:users,id',
        ];
    }
}
