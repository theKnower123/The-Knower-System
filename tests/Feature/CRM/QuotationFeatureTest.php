<?php

namespace Tests\Feature\CRM;

use App\Models\Quotation;
use App\Models\Lead;
use App\Models\Company;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuotationFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_authorized_user_can_create_quotation()
    {
        $user = User::factory()->create();
        Permission::firstOrCreate(['name' => 'create_quotations']);
        $role = Role::firstOrCreate(['name' => 'Sales Representative']);
        $role->givePermissionTo('create_quotations');
        $user->assignRole($role);
        
        $company = Company::create(['company_name' => 'Wayne Enterprises']);
        $lead = Lead::create(['title' => 'Security Upgrade', 'company_id' => $company->id]);

        $response = $this->actingAs($user)->postJson('/api/v1/quotations', [
            'quotation_number' => 'QT-2026-001',
            'company_id' => $company->id,
            'lead_id' => $lead->id,
            'issue_date' => '2026-07-18',
            'valid_until' => '2026-08-18',
            'subtotal' => 50000.00,
            'total_amount' => 50000.00,
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.quotation_number', 'QT-2026-001');
                 
        $this->assertDatabaseHas('quotations', [
            'quotation_number' => 'QT-2026-001',
            'lead_id' => $lead->id,
            'total_amount' => 50000.00
        ]);
    }
}
