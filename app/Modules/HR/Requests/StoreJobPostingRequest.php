<?php

namespace App\Modules\HR\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobPostingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'type' => 'required|in:full-time,part-time,contract,internship',
            'location' => 'nullable|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'status' => 'required|in:draft,published,closed',
            'closing_date' => 'nullable|date',
        ];
    }
}
