<?php

namespace Tests\Feature\Auth;

use App\Modules\Auth\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GoogleAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_google_login_redirects_to_google(): void
    {
        $response = $this->get('/auth/google');

        $response->assertStatus(302);
        $this->assertStringContainsString('google.com', $response->headers->get('Location'));
    }

    public function test_google_callback_logs_in_existing_user(): void
    {
        $user = User::factory()->create([
            'email' => 'employee@knower.os',
            'google_id' => null,
        ]);

        $response = $this->get('/auth/google/callback?email=employee@knower.os&google_id=google_12345');

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($user);
        $this->assertEquals('google_12345', $user->fresh()->google_id);
    }

    public function test_google_callback_rejects_unregistered_email(): void
    {
        $response = $this->get('/auth/google/callback?email=unknown@google.com&google_id=google_99999');

        $response->assertRedirect('/login');
        $this->assertGuest();
    }
}
