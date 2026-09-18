<?php

namespace App\Modules\Support\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('ticketmessage'));
    }

    public function rules(): array
    {
        return [
            // TODO: Add rules

        ];
    }
}
