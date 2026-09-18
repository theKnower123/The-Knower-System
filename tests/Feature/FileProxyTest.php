<?php

namespace Tests\Feature;

use App\Modules\Projects\Models\File;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileProxyTest extends TestCase
{
    use RefreshDatabase;

    public function test_file_proxy_streams_file_without_exposing_s3_url(): void
    {
        Storage::fake('s3');
        Storage::disk('s3')->put('projects/test-doc.pdf', 'Sample PDF Content');

        $user = \App\Modules\Auth\Models\User::factory()->create();
        $workspace = \App\Modules\Settings\Models\Workspace::create(['name' => 'Default Workspace', 'slug' => 'default', 'owner_id' => $user->id]);
        $client = \App\Modules\CRM\Models\Client::create([
            'workspace_id' => $workspace->id,
            'name' => 'Acme Corp',
            'email' => 'acme@example.com',
        ]);
        $project = \App\Modules\Projects\Models\Project::create([
            'workspace_id' => 1,
            'client_id' => $client->id,
            'name' => 'Test Project',
            'status' => 'in_progress',
        ]);

        $file = File::create([
            'project_id' => $project->id,
            'uploaded_by' => $user->id,
            'file_name' => 'test-doc.pdf',
            'file_path' => 'projects/test-doc.pdf',
            'size' => 1024,
            'type' => 'pdf',
        ]);

        $this->assertEquals(route('file.show', $file->id), $file->url);

        $response = $this->get('/file/' . $file->id);

        $response->assertStatus(200);
        $this->assertEquals('Sample PDF Content', $response->streamedContent());
    }

    public function test_file_proxy_returns_404_for_non_existent_file(): void
    {
        $response = $this->get('/file/99999');

        $response->assertStatus(404);
    }
}
