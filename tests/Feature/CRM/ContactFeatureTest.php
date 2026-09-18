<?php

namespace Tests\Feature\CRM;

use App\Models\Contact;
use App\Models\Company;
use App\Models\Workspace;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_authorized_user_can_create_contact()
    {
        $user = User::factory()->create();
        Permission::firstOrCreate(['name' => 'create_contacts']);
        $role = Role::firstOrCreate(['name' => 'Project Manager']);
        $role->givePermissionTo('create_contacts');
        $user->assignRole($role);
        
        $workspace = Workspace::create(['name' => 'Test Workspace', 'slug' => 'test-workspace', 'owner_id' => $user->id]);
        $user->current_workspace_id = $workspace->id;
        $user->save();
        $company = Company::create(['company_name' => 'Stark Industries', 'workspace_id' => $workspace->id]);

        $response = $this->actingAs($user)->postJson('/api/v1/contacts', [
            'company_id' => $company->id,
            'first_name' => 'Tony',
            'last_name' => 'Stark',
            'email' => 'tony@stark.com',
            'type' => 'primary'
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.first_name', 'Tony');
                 
        $this->assertDatabaseHas('contacts', [
            'first_name' => 'Tony',
            'company_id' => $company->id
        ]);
    }
}
