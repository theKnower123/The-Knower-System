<?php

namespace Tests\Feature\CRM;

use App\Models\Company;
use App\Models\Workspace;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_authorized_user_can_create_company()
    {
        $user = User::factory()->create();
        Permission::firstOrCreate(['name' => 'create_companies']);
        $role = Role::firstOrCreate(['name' => 'Project Manager']);
        $role->givePermissionTo('create_companies');
        $user->assignRole($role);

        $workspace = Workspace::create(['name' => 'Test Workspace', 'slug' => 'test-workspace', 'owner_id' => $user->id]);
        $user->current_workspace_id = $workspace->id;
        $user->save();

        $response = $this->actingAs($user)->postJson('/api/v1/companies', [
            'company_name' => 'Stark Industries',
            'legal_name' => 'Stark Industries LLC',
            'company_type' => 'enterprise',
            'annual_revenue' => 1500000.50
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.company_name', 'Stark Industries');
                 
        $this->assertDatabaseHas('companies', [
            'company_name' => 'Stark Industries',
            'annual_revenue' => 1500000.50
        ]);
    }
}
