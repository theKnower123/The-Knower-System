<?php

namespace App\Http\Requests\HR;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLeaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('leave'));
    }

    public function rules(): array
    {
        return [

            'type' => 'sometimes|required|in:annual,sick,emergency,unpaid,other',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'status' => 'sometimes|required|in:pending,approved,rejected',
            'reason' => 'nullable|string',
        
        ];
    }
}
