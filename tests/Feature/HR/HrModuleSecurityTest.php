<?php

namespace Tests\Feature\HR;

use App\Modules\Auth\Models\User;
use App\Modules\HR\Models\JobPosting;
use App\Modules\HR\Models\JobApplication;
use App\Modules\HR\Models\Employee;
use App\Modules\HR\Models\Attendance;
use App\Modules\HR\Models\Leave;
use App\Modules\Settings\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class HrModuleSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected User $hrUser;
    protected User $regularUser;
    protected Workspace $workspace;

    protected function setUp(): void
    {
        parent::setUp();

        $this->hrUser = User::factory()->create(['role' => 'hr']);
        $this->regularUser = User::factory()->create(['role' => 'client']);
        $this->workspace = Workspace::create([
            'name' => 'HR Test Workspace',
            'slug' => 'hr-test-workspace',
            'owner_id' => $this->hrUser->id,
        ]);
    }

    public function test_public_applicant_can_view_active_jobs_and_submit_job_application()
    {
        Storage::fake('public');

        $job = JobPosting::create([
            'title' => 'Senior Developer',
            'type' => 'full-time',
            'description' => 'Great position',
            'status' => 'published',
        ]);

        $activeResponse = $this->getJson('/api/v1/job-postings/active');
        $activeResponse->assertStatus(200)
            ->assertJsonFragment(['title' => 'Senior Developer']);

        $resumeFile = UploadedFile::fake()->create('resume.pdf', 500, 'application/pdf');

        $applyResponse = $this->postJson('/api/v1/job-applications', [
            'job_posting_id' => $job->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'phone' => '1234567890',
            'cover_letter' => 'I love coding.',
            'resume' => $resumeFile,
        ]);

        $applyResponse->assertStatus(201);
        $this->assertDatabaseHas('job_applications', [
            'job_posting_id' => $job->id,
            'email' => 'john.doe@example.com',
        ]);

        // Duplicate submission test
        $duplicateResponse = $this->postJson('/api/v1/job-applications', [
            'job_posting_id' => $job->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'phone' => '1234567890',
        ]);

        $duplicateResponse->assertStatus(422)
            ->assertJson([
                'already_submitted' => true,
            ]);

        // Public status check test
        $statusResponse = $this->getJson("/api/v1/job-applications/status?job_posting_id={$job->id}&email=john.doe@example.com");
        $statusResponse->assertStatus(200)
            ->assertJsonFragment(['email' => 'john.doe@example.com', 'status' => 'pending']);
    }

    public function test_hr_user_can_create_job_posting_and_regular_user_is_forbidden()
    {
        $payload = [
            'title' => 'Frontend Engineer',
            'type' => 'full-time',
            'description' => 'React & TypeScript',
            'status' => 'draft',
        ];

        // Regular user should get 403 Forbidden
        $forbiddenResponse = $this->actingAs($this->regularUser)->postJson('/api/v1/job-postings', $payload);
        $forbiddenResponse->assertStatus(403);

        // HR User should succeed
        $successResponse = $this->actingAs($this->hrUser)->postJson('/api/v1/job-postings', $payload);
        $successResponse->assertStatus(201);

        $this->assertDatabaseHas('job_postings', [
            'title' => 'Frontend Engineer',
        ]);

        $postingId = $successResponse->json('data.id');

        // Test updating job posting
        $updateResponse = $this->actingAs($this->hrUser)->putJson("/api/v1/job-postings/{$postingId}", [
            'title' => 'Senior Frontend Engineer',
            'status' => 'published',
        ]);
        $updateResponse->assertStatus(200);
        $this->assertDatabaseHas('job_postings', [
            'id' => $postingId,
            'title' => 'Senior Frontend Engineer',
            'status' => 'published',
        ]);
    }

    public function test_hr_user_can_update_job_application_status()
    {
        $job = JobPosting::create([
            'title' => 'QA Lead',
            'type' => 'full-time',
            'description' => 'QA position',
            'status' => 'published',
        ]);

        $app = JobApplication::create([
            'job_posting_id' => $job->id,
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->hrUser)->putJson("/api/v1/job-applications/{$app->id}", [
            'status' => 'interviewing',
            'notes' => 'Great candidate',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('job_applications', [
            'id' => $app->id,
            'status' => 'interviewing',
        ]);
    }

    public function test_employee_and_attendance_crud_operations()
    {
        $employeeData = [
            'name' => 'Alice Smith',
            'email' => 'alice@company.com',
            'password' => 'secret123',
            'role' => 'developer',
            'department' => 'Engineering',
            'position' => 'Backend Engineer',
            'salary' => 6000,
            'status' => 'active',
        ];

        $empResponse = $this->actingAs($this->hrUser)->postJson('/api/v1/employees', $employeeData);
        $empResponse->assertStatus(201);

        $employeeId = $empResponse->json('data.id');

        $attendanceResponse = $this->actingAs($this->hrUser)->postJson('/api/v1/attendance', [
            'employee_id' => $employeeId,
            'date' => '2026-07-31',
            'check_in' => '09:00',
            'check_out' => '17:00',
            'status' => 'present',
        ]);

        $attendanceResponse->assertStatus(201);
        $this->assertDatabaseHas('attendance', [
            'employee_id' => $employeeId,
            'status' => 'present',
        ]);
    }

    public function test_leave_creation_and_validation()
    {
        $user = User::factory()->create();
        $employee = Employee::create([
            'user_id' => $user->id,
            'workspace_id' => $this->workspace->id,
            'department' => 'HR',
            'position' => 'Specialist',
            'status' => 'active',
        ]);

        $invalidLeave = $this->actingAs($this->hrUser)->postJson('/api/v1/leaves', [
            'employee_id' => $employee->id,
            'type' => 'annual',
            'start_date' => '2026-08-10',
            'end_date' => '2026-08-05', // End date before start date!
        ]);
        $invalidLeave->assertStatus(422);

        $validLeave = $this->actingAs($this->hrUser)->postJson('/api/v1/leaves', [
            'employee_id' => $employee->id,
            'type' => 'annual',
            'start_date' => '2026-08-05',
            'end_date' => '2026-08-10',
            'reason' => 'Summer vacation',
        ]);
        $validLeave->assertStatus(201);
        $this->assertDatabaseHas('leaves', [
            'employee_id' => $employee->id,
            'type' => 'annual',
        ]);
    }
}
