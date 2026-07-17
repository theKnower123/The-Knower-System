<?php

namespace Tests\Feature\Core;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

class WorkspaceFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_create_workspace()
    {
        $superAdmin = User::factory()->create();
        $role = Role::firstOrCreate(['name' => 'Super Admin']);
        $superAdmin->assignRole($role);

        $response = $this->actingAs($superAdmin)->postJson('/api/v1/workspaces', [
            'name' => 'Acme Corp Workspace'
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Acme Corp Workspace');
                 
        $this->assertDatabaseHas('workspaces', [
            'name' => 'Acme Corp Workspace',
            'owner_id' => $superAdmin->id
        ]);
    }

    public function test_user_can_switch_workspace()
    {
        $user = User::factory()->create();
        $role = Role::firstOrCreate(['name' => 'Super Admin']);
        $user->assignRole($role);
        
        $workspace = Workspace::create([
            'name' => 'Test',
            'slug' => 'test',
            'owner_id' => $user->id
        ]);

        $response = $this->actingAs($user)->postJson("/api/v1/workspaces/{$workspace->id}/switch");

        $response->assertStatus(200);
        
        $this->assertEquals($workspace->id, $user->fresh()->current_workspace_id);
    }
}
