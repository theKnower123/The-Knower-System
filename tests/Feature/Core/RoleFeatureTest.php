<?php

namespace Tests\Feature\Core;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class RoleFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected User $superAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->superAdmin = User::factory()->create();
        $role = Role::create(['name' => 'Super Admin']);
        $this->superAdmin->assignRole($role);
    }

    public function test_super_admin_can_view_roles(): void
    {
        $response = $this->actingAs($this->superAdmin)->getJson('/api/v1/roles');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);
    }

    public function test_super_admin_can_create_role(): void
    {
        Permission::create(['name' => 'view_users']);

        $response = $this->actingAs($this->superAdmin)->postJson('/api/v1/roles', [
            'name' => 'Custom Role',
            'permissions' => ['view_users']
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Custom Role');
        
        $this->assertDatabaseHas('roles', ['name' => 'Custom Role']);
    }
}
