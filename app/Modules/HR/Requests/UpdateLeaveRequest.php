<?php

namespace App\Modules\HR\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLeaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        $leave = $this->route('leave') ?? $this->route('id');
        if (is_numeric($leave) || is_string($leave)) {
            $leave = \App\Modules\HR\Models\Leave::find($leave);
        }
        if ($leave) {
            return $this->user()->can('update', $leave);
        }
        return $this->user()->hasPermissionTo('hr.manage') || $this->user()->hasPermissionTo('leave.manage') || $this->user()->hasPermissionTo('hr.view');
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
