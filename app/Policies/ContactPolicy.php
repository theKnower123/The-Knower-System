<?php
namespace App\Policies;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContactPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool { return $user->hasPermissionTo('view_contacts'); }
    public function view(User $user, Contact $contact): bool { return $user->hasPermissionTo('view_contacts'); }
    public function create(User $user): bool { return $user->hasPermissionTo('create_contacts'); }
    public function update(User $user, Contact $contact): bool { return $user->hasPermissionTo('edit_contacts'); }
    public function delete(User $user, Contact $contact): bool { return $user->hasPermissionTo('delete_contacts'); }
}
