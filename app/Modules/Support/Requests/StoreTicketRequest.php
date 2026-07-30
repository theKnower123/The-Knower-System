<?php

namespace App\Modules\Support\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Modules\Support\Models\Ticket::class);
    }

    public function rules(): array
    { return []; }
}
