<?php

namespace App\Modules\HR\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        $att = $this->route('attendance') ?? $this->route('id');
        if (is_numeric($att) || is_string($att)) {
            $att = \App\Modules\HR\Models\Attendance::find($att);
        }
        if ($att) {
            return $this->user()->can('update', $att);
        }
        return $this->user()->hasPermissionTo('hr.manage') || $this->user()->hasPermissionTo('attendance.manage') || $this->user()->hasPermissionTo('hr.view');
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'sometimes|required|exists:employees,id',
            'date' => 'sometimes|required|date',
            'check_in' => 'nullable|string',
            'check_out' => 'nullable|string',
            'status' => 'sometimes|required|in:present,absent,late,on_leave,half_day',
        ];
    }
}
