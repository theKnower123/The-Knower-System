<?php

namespace Tests\Feature\CRM;

use App\Modules\CRM\Models\Quotation;
use App\Modules\CRM\Models\Lead;
use App\Modules\CRM\Models\Client;
use App\Modules\Settings\Models\Workspace;
use App\Modules\Auth\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuotationFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_authorized_user_can_create_quotation()
    {
        $user = User::factory()->create(['role' => 'administrator']);
        
        $workspace = Workspace::create(['name' => 'Test Workspace', 'slug' => 'test-workspace', 'owner_id' => $user->id]);
        $client = Client::create(['name' => 'Wayne Enterprises', 'company_name' => 'Wayne Enterprises', 'email' => 'contact@wayne.com', 'workspace_id' => $workspace->id]);
        $lead = Lead::create(['title' => 'Security Upgrade', 'client_id' => $client->id, 'workspace_id' => $workspace->id]);

        $response = $this->actingAs($user)->postJson('/api/v1/quotations', [
            'quotation_number' => 'QT-2026-001',
            'client_id' => $client->id,
            'lead_id' => $lead->id,
            'issue_date' => '2026-07-18',
            'valid_until' => '2026-08-18',
            'subtotal' => 50000.00,
            'total_amount' => 50000.00,
        ]);

        $response->assertStatus(201);
                 
        $this->assertDatabaseHas('quotations', [
            'quotation_number' => 'QT-2026-001',
            'lead_id' => $lead->id,
            'total_amount' => 50000.00
        ]);
    }
}
