<?php

namespace App\Modules\CRM\Services;

use App\Modules\CRM\Models\Client;
use App\Modules\Auth\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ClientService
{
    public function getAll(): Collection
    {
        return Client::trashMode()->orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): Client
    {
        return DB::transaction(function () use ($data) {
            $wantsPortalAccount = !empty($data['create_portal_account']) && !empty($data['password']);

            $client = Client::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'position' => $data['position'] ?? null,
                'status' => $data['status'] ?? 'active',
            ]);

            if ($wantsPortalAccount) {
                $this->createOrUpdatePortalAccount($client, $data);
            }

            \App\Services\UserActivityLogger::log(
                $client->user_id ?? (auth()->id() ?? $client->id),
                "Created Client: {$client->name}",
                "crm",
                "Client #{$client->id}",
                "New client account onboarded into system.",
                "Clients",
                "create"
            );

            return $client->fresh();
        });
    }

    public function update(Client $client, array $data): Client
    {
        return DB::transaction(function () use ($client, $data) {
            $client->update(array_filter([
                'name' => $data['name'] ?? null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'position' => $data['position'] ?? null,
                'status' => $data['status'] ?? null,
            ], fn ($v) => $v !== null));

            $wantsPortalAccount = !empty($data['create_portal_account']);

            if ($wantsPortalAccount && !empty($data['password'])) {
                $this->createOrUpdatePortalAccount($client, $data);
            } elseif (array_key_exists('create_portal_account', $data) && !$wantsPortalAccount && $client->user_id) {
                // Portal access explicitly disabled -- deactivate the login
                // account rather than deleting it, so history/audit trail
                // (invoices, tickets, etc. created "by" that user) stays intact.
                $client->user()->update(['status' => 'inactive']);
            }

            $updated = $client->fresh();

            \App\Services\UserActivityLogger::log(
                $updated->user_id ?? (auth()->id() ?? $updated->id),
                "Updated Client: {$updated->name}",
                "crm",
                "Client #{$updated->id}",
                "Updated client information or portal configuration.",
                "Clients",
                "edit"
            );

            return $updated;
        });
    }

    /**
     * Creates a new Client Portal login (User) for this client, or updates
     * the password/email on an existing one. This is the piece that was
     * completely missing before -- clients had nowhere to log in from.
     */
    protected function createOrUpdatePortalAccount(Client $client, array $data): void
    {
        if ($client->user_id) {
            // Already has a login -- just update password/email if changed.
            $client->user()->update(array_filter([
                'email' => $data['email'] ?? null,
                'password' => !empty($data['password']) ? Hash::make($data['password']) : null,
                'status' => 'active',
            ], fn ($v) => $v !== null));

            return;
        }

        $existingUser = User::where('email', $data['email'])->first();
        if ($existingUser) {
            // Don't silently hijack an unrelated existing account.
            throw new \RuntimeException("A user account with email {$data['email']} already exists.");
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'client',
            'status' => 'active',
        ]);

        $client->update(['user_id' => $user->id]);
    }

    public function delete(Client $client): ?bool
    {
        \App\Services\UserActivityLogger::log(
            $client->user_id ?? (auth()->id() ?? $client->id),
            "Deleted Client: {$client->name}",
            "crm",
            "Client #{$client->id}",
            "Client profile moved to trash.",
            "Clients",
            "delete"
        );

        return $client->delete();
    }
}
