<?php

namespace App\Modules\Projects\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Modules\Projects\Models\File::class)
            || $this->user()->hasPermissionTo('file.upload');
    }

    public function rules(): array
    {
        return [
            'file' => ['nullable', 'file', 'max:51200'],
            'files' => ['nullable', 'array'],
            'files.*' => ['file', 'max:51200'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'file_name' => ['nullable', 'string', 'max:255'],
            'file_path' => ['nullable', 'string', 'max:500'],
            'size' => ['nullable', 'integer'],
            'type' => ['nullable', 'string', 'max:100'],
        ];
    }
}
