<?php
namespace App\Services\CRM;

use App\Models\Contact;
use Illuminate\Support\Facades\Auth;

class ContactService
{
    public function getAll()
    {
        return Contact::with(['company'])->latest()->paginate(25);
    }

    public function create(array $data): Contact
    {
        $data['created_by'] = Auth::id();
        return Contact::create($data);
    }

    public function update(Contact $contact, array $data): Contact
    {
        $data['updated_by'] = Auth::id();
        $contact->update($data);
        return $contact;
    }

    public function delete(Contact $contact): bool
    {
        return $contact->delete();
    }
}
