<?php

namespace Database\Seeders;

use App\Enums\GraduationProjectOutcome;
use App\Enums\GraduationProjectStatus;
use App\Enums\GraduationProjectType;
use App\Enums\GraduationServiceType;
use App\Modules\CMS\Models\Testimonial;
use App\Modules\CRM\Models\Client;
use App\Modules\Finance\Models\Invoice;
use App\Modules\GraduationProjects\Models\GraduationProject;
use App\Modules\GraduationProjects\Models\GraduationProjectMember;
use App\Modules\Projects\Models\Milestone;
use App\Modules\Projects\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Seed sample graduation projects across all pipeline statuses,
 * linked projects/milestones/invoices, showcase items, and GP testimonials.
 *
 * php artisan db:seed --class="Database\Seeders\GraduationProjectSeeder"
 */
class GraduationProjectSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            foreach ($this->projects() as $payload) {
                $this->seedProject($payload);
            }

            foreach ($this->testimonials() as $t) {
                $gpId = GraduationProject::where('team_name', $t['company'])->value('id');
                if ($gpId) {
                    $t['graduation_project_id'] = $gpId;
                }

                if (!Schema::hasColumn('testimonials', 'is_approved')) {
                    unset($t['is_approved']);
                }
                if (!Schema::hasColumn('testimonials', 'rating')) {
                    unset($t['rating']);
                }

                Testimonial::updateOrCreate(
                    ['name' => $t['name'], 'source' => 'graduation_project'],
                    $t
                );
                $this->command?->info("Seeded GP testimonial from '{$t['name']}'.");
            }
        });
    }

    private function seedProject(array $payload): void
    {
        $members = $payload['members'] ?? [];
        $milestones = $payload['milestones'] ?? null;
        unset($payload['members'], $payload['milestones']);

        $gp = GraduationProject::withTrashed()->updateOrCreate(
            ['reference_id' => $payload['reference_id']],
            array_merge($payload, [
                'workspace_id' => 1,
                'deleted_at' => null,
            ])
        );

        if ($gp->trashed()) {
            $gp->restore();
        }

        GraduationProjectMember::where('graduation_project_id', $gp->id)->delete();
        foreach ($members as $member) {
            GraduationProjectMember::create(array_merge($member, [
                'graduation_project_id' => $gp->id,
            ]));
        }

        $status = $gp->status?->value ?? $gp->status;
        if (in_array($status, [
            GraduationProjectStatus::IN_PROGRESS->value,
            GraduationProjectStatus::DELIVERED->value,
        ], true)) {
            $this->ensureLinkedExecution($gp, $milestones);
        }

        $this->command?->info("Seeded graduation project {$gp->reference_id} ({$gp->team_name}) [{$status}].");
    }

    private function ensureLinkedExecution(GraduationProject $gp, ?array $milestoneStatuses): void
    {
        $client = Client::firstOrCreate(
            ['email' => $gp->primary_contact_email],
            [
                'workspace_id' => 1,
                'name' => $gp->team_name,
                'phone' => $gp->primary_contact_phone,
                'position' => 'Graduation Project Team',
                'status' => 'active',
            ]
        );

        $project = $gp->linked_project_id
            ? Project::find($gp->linked_project_id)
            : null;

        $status = $gp->status?->value ?? $gp->status;

        if (!$project) {
            $project = Project::create([
                'workspace_id' => 1,
                'client_id' => $client->id,
                'name' => "GP: {$gp->team_name}",
                'description' => $gp->description,
                'type' => ($gp->project_type?->value ?? $gp->project_type) === 'hardware'
                    ? 'Embedded/IoT'
                    : 'Software/Mobile',
                'status' => $status === 'delivered' ? 'completed' : 'in_progress',
                'priority' => 'medium',
                'start_date' => now()->subWeeks(4)->toDateString(),
                'deadline' => $gp->deadline?->toDateString(),
                'budget' => $gp->quoted_price,
                'progress' => $status === 'delivered' ? 100 : 45,
                'is_graduation_project' => true,
                'is_public' => false,
            ]);
        } else {
            $project->update([
                'is_graduation_project' => true,
                'client_id' => $client->id,
                'status' => $status === 'delivered' ? 'completed' : 'in_progress',
            ]);
        }

        $titles = [
            'Requirements Analysis',
            'Design (UI / Circuit & Schematic)',
            'Implementation & Coding',
            'Testing & Quality Assurance',
            'Documentation & Report',
            'Final Delivery & Defense Prep',
        ];

        if ($project->milestones()->count() === 0) {
            foreach ($titles as $i => $title) {
                $msStatus = $milestoneStatuses[$i] ?? 'pending';
                Milestone::create([
                    'workspace_id' => 1,
                    'project_id' => $project->id,
                    'title' => $title,
                    'status' => $msStatus,
                    'progress' => $msStatus === 'completed' ? 100 : ($msStatus === 'in_progress' ? 40 : 0),
                    'completed_at' => $msStatus === 'completed' ? now()->subDays(max(1, 6 - $i)) : null,
                ]);
            }
        }

        $depositAmount = max(1, round(((float) ($gp->quoted_price ?: 10000)) * 0.4, 2));
        $deposit = $gp->deposit_invoice_id
            ? Invoice::find($gp->deposit_invoice_id)
            : Invoice::where('invoice_number', 'INV-GP-DEP-' . $gp->reference_id)->first();

        if (!$deposit) {
            $payload = [
                'workspace_id' => 1,
                'client_id' => $client->id,
                'project_id' => $project->id,
                'invoice_number' => 'INV-GP-DEP-' . $gp->reference_id,
                'amount' => $depositAmount,
                'paid_amount' => $gp->deposit_paid ? $depositAmount : 0,
                'currency' => 'EGP',
                'status' => $gp->deposit_paid ? 'paid' : 'sent',
                'due_date' => now()->addDays(7)->toDateString(),
                'notes' => 'Graduation deposit',
            ];
            if (Schema::hasColumn('invoices', 'total_amount')) {
                $payload['total_amount'] = $depositAmount;
            }
            $deposit = Invoice::create($payload);
        }

        $final = null;
        if ($status === GraduationProjectStatus::DELIVERED->value) {
            $finalAmount = max(1, round(((float) ($gp->quoted_price ?: 10000)) * 0.6, 2));
            $final = $gp->final_invoice_id
                ? Invoice::find($gp->final_invoice_id)
                : Invoice::where('invoice_number', 'INV-GP-FIN-' . $gp->reference_id)->first();

            if (!$final) {
                $payload = [
                    'workspace_id' => 1,
                    'client_id' => $client->id,
                    'project_id' => $project->id,
                    'invoice_number' => 'INV-GP-FIN-' . $gp->reference_id,
                    'amount' => $finalAmount,
                    'paid_amount' => $gp->final_payment_paid ? $finalAmount : 0,
                    'currency' => 'EGP',
                    'status' => $gp->final_payment_paid ? 'paid' : 'sent',
                    'due_date' => now()->addDays(14)->toDateString(),
                    'notes' => 'Graduation final payment',
                ];
                if (Schema::hasColumn('invoices', 'total_amount')) {
                    $payload['total_amount'] = $finalAmount;
                }
                $final = Invoice::create($payload);
            }
        }

        $gp->update([
            'client_id' => $client->id,
            'linked_project_id' => $project->id,
            'deposit_invoice_id' => $deposit->id,
            'final_invoice_id' => $final?->id,
        ]);
    }

    private function projects(): array
    {
        return [
            [
                'reference_id' => 'GP-SEED-PEND-01',
                'team_name' => 'Nile Sensors',
                'university' => 'Cairo University',
                'college' => 'Faculty of Engineering',
                'team_size' => 4,
                'description' => "Smart greenhouse monitoring with ESP32, soil moisture sensors, and a Flutter companion app.\nProposed stack: ESP32, MQTT, Firebase, Flutter.\nCurrent progress: sensor board prototype only.",
                'deadline' => now()->addMonths(3)->toDateString(),
                'project_type' => GraduationProjectType::HARDWARE,
                'service_type' => GraduationServiceType::FULL_EXECUTION,
                'status' => GraduationProjectStatus::PENDING_REVIEW,
                'primary_contact_name' => 'Ahmed Hassan',
                'primary_contact_phone' => '+201011112222',
                'primary_contact_email' => 'ahmed.hassan.gp@example.com',
                'members' => [
                    ['name' => 'Ahmed Hassan', 'phone' => '+201011112222', 'email' => 'ahmed.hassan.gp@example.com', 'role_in_team' => 'Team Lead', 'is_primary' => true],
                    ['name' => 'Sara Ali', 'phone' => '+201033334444', 'email' => 'sara.ali.gp@example.com', 'role_in_team' => 'Firmware', 'is_primary' => false],
                    ['name' => 'Omar Nabil', 'phone' => '+201055556666', 'email' => 'omar.nabil.gp@example.com', 'role_in_team' => 'Mobile', 'is_primary' => false],
                ],
            ],
            [
                'reference_id' => 'GP-SEED-PEND-02',
                'team_name' => 'StudyBuddy AI',
                'university' => 'AUC',
                'college' => 'Computer Science',
                'team_size' => 3,
                'description' => "AI study planner with spaced-repetition flashcards and Arabic/English content.\nProposed stack: Next.js, Laravel API, OpenAI embeddings.\nNeed consultation on architecture + partial API.",
                'deadline' => now()->addMonths(4)->toDateString(),
                'project_type' => GraduationProjectType::SOFTWARE,
                'service_type' => GraduationServiceType::CONSULTATION,
                'status' => GraduationProjectStatus::PENDING_REVIEW,
                'primary_contact_name' => 'Farida Mansour',
                'primary_contact_phone' => '+201098765432',
                'primary_contact_email' => 'farida.mansour.gp@example.com',
                'members' => [
                    ['name' => 'Farida Mansour', 'phone' => '+201098765432', 'email' => 'farida.mansour.gp@example.com', 'role_in_team' => 'Primary Contact', 'is_primary' => true],
                    ['name' => 'Ramy Lotfy', 'phone' => '+201011223344', 'email' => 'ramy.lotfy.gp@example.com', 'role_in_team' => 'ML', 'is_primary' => false],
                ],
            ],
            [
                'reference_id' => 'GP-SEED-QUOT-01',
                'team_name' => 'Campus Connect',
                'university' => 'Ain Shams University',
                'college' => 'Faculty of Computer & Information Sciences',
                'team_size' => 3,
                'description' => "University student portal: course materials, announcements, and attendance QR scanning.\nProposed stack: Laravel, React, MySQL.\nNeed partial backend + API help.",
                'deadline' => now()->addMonths(2)->toDateString(),
                'project_type' => GraduationProjectType::SOFTWARE,
                'service_type' => GraduationServiceType::PARTIAL_EXECUTION,
                'final_service_type' => GraduationServiceType::PARTIAL_EXECUTION,
                'status' => GraduationProjectStatus::QUOTED,
                'quoted_price' => 18000,
                'primary_contact_name' => 'Nour El-Din',
                'primary_contact_phone' => '+201122223333',
                'primary_contact_email' => 'nour.eldin.gp@example.com',
                'members' => [
                    ['name' => 'Nour El-Din', 'phone' => '+201122223333', 'email' => 'nour.eldin.gp@example.com', 'role_in_team' => 'Primary Contact', 'is_primary' => true],
                    ['name' => 'Hana Magdy', 'phone' => '+201144445555', 'email' => 'hana.magdy.gp@example.com', 'role_in_team' => 'Frontend', 'is_primary' => false],
                ],
            ],
            [
                'reference_id' => 'GP-SEED-PROG-01',
                'team_name' => 'RoboTrack',
                'university' => 'Alexandria University',
                'college' => 'Faculty of Engineering',
                'team_size' => 5,
                'description' => 'Line-following robot with obstacle avoidance and live telemetry dashboard for defense demo.',
                'deadline' => now()->addMonth()->toDateString(),
                'project_type' => GraduationProjectType::HARDWARE,
                'service_type' => GraduationServiceType::FULL_EXECUTION,
                'final_service_type' => GraduationServiceType::FULL_EXECUTION,
                'status' => GraduationProjectStatus::IN_PROGRESS,
                'quoted_price' => 22000,
                'deposit_paid' => true,
                'primary_contact_name' => 'Youssef Kamal',
                'primary_contact_phone' => '+201266667777',
                'primary_contact_email' => 'youssef.kamal.gp@example.com',
                'members' => [
                    ['name' => 'Youssef Kamal', 'phone' => '+201266667777', 'email' => 'youssef.kamal.gp@example.com', 'role_in_team' => 'Team Lead', 'is_primary' => true],
                    ['name' => 'Laila Mostafa', 'phone' => '+201288889999', 'email' => 'laila.mostafa.gp@example.com', 'role_in_team' => 'Electronics', 'is_primary' => false],
                ],
                'milestones' => ['completed', 'completed', 'in_progress', 'pending', 'pending', 'pending'],
            ],
            [
                'reference_id' => 'GP-SEED-SOFT-01',
                'team_name' => 'MediQueue',
                'university' => 'Helwan University',
                'college' => 'Faculty of Computers & AI',
                'team_size' => 4,
                'description' => 'Clinic appointment & queue management web app with doctor dashboard and patient SMS notifications.',
                'deadline' => now()->subWeeks(2)->toDateString(),
                'project_type' => GraduationProjectType::SOFTWARE,
                'service_type' => GraduationServiceType::FULL_EXECUTION,
                'final_service_type' => GraduationServiceType::FULL_EXECUTION,
                'status' => GraduationProjectStatus::DELIVERED,
                'quoted_price' => 25000,
                'deposit_paid' => true,
                'final_payment_paid' => true,
                'hardware_handed_over' => false,
                'outcome' => GraduationProjectOutcome::PASSED,
                'outcome_notes' => 'Committee praised architecture docs and live staging demo.',
                'is_showcased' => true,
                'primary_contact_name' => 'Mariam Fathy',
                'primary_contact_phone' => '+201200001111',
                'primary_contact_email' => 'mariam.fathy.gp@example.com',
                'members' => [
                    ['name' => 'Mariam Fathy', 'phone' => '+201200001111', 'email' => 'mariam.fathy.gp@example.com', 'role_in_team' => 'Team Lead', 'is_primary' => true],
                    ['name' => 'Karim Adel', 'phone' => '+201212121212', 'email' => 'karim.adel.gp@example.com', 'role_in_team' => 'Backend', 'is_primary' => false],
                ],
                'milestones' => ['completed', 'completed', 'completed', 'completed', 'completed', 'completed'],
            ],
            [
                'reference_id' => 'GP-SEED-HARD-01',
                'team_name' => 'AquaSense',
                'university' => 'Mansoura University',
                'college' => 'Faculty of Engineering',
                'team_size' => 3,
                'description' => 'IoT water-quality monitoring buoy with LoRa uplink, PCB design, and 3D-printed casing for field demo.',
                'deadline' => now()->subMonth()->toDateString(),
                'project_type' => GraduationProjectType::HARDWARE,
                'service_type' => GraduationServiceType::FULL_EXECUTION,
                'final_service_type' => GraduationServiceType::FULL_EXECUTION,
                'status' => GraduationProjectStatus::DELIVERED,
                'quoted_price' => 28000,
                'deposit_paid' => true,
                'final_payment_paid' => true,
                'hardware_handed_over' => true,
                'outcome' => GraduationProjectOutcome::PASSED,
                'outcome_notes' => 'Hardware handover completed; firmware walkthrough done before defense.',
                'is_showcased' => true,
                'primary_contact_name' => 'Hassan Ibrahim',
                'primary_contact_phone' => '+201233334444',
                'primary_contact_email' => 'hassan.ibrahim.gp@example.com',
                'members' => [
                    ['name' => 'Hassan Ibrahim', 'phone' => '+201233334444', 'email' => 'hassan.ibrahim.gp@example.com', 'role_in_team' => 'Team Lead', 'is_primary' => true],
                    ['name' => 'Dina Samir', 'phone' => '+201255556666', 'email' => 'dina.samir.gp@example.com', 'role_in_team' => 'PCB Design', 'is_primary' => false],
                ],
                'milestones' => ['completed', 'completed', 'completed', 'completed', 'completed', 'completed'],
            ],
            [
                'reference_id' => 'GP-SEED-CANC-01',
                'team_name' => 'ParkEasy Draft',
                'university' => 'Tanta University',
                'college' => 'Faculty of Engineering',
                'team_size' => 2,
                'description' => 'Smart parking prototype — cancelled after team changed topic with supervisor.',
                'deadline' => now()->addWeeks(6)->toDateString(),
                'project_type' => GraduationProjectType::SOFTWARE,
                'service_type' => GraduationServiceType::PARTIAL_EXECUTION,
                'status' => GraduationProjectStatus::CANCELLED,
                'quoted_price' => 12000,
                'rejection_reason' => null,
                'primary_contact_name' => 'Mostafa Gaber',
                'primary_contact_phone' => '+201299988877',
                'primary_contact_email' => 'mostafa.gaber.gp@example.com',
                'members' => [
                    ['name' => 'Mostafa Gaber', 'phone' => '+201299988877', 'email' => 'mostafa.gaber.gp@example.com', 'role_in_team' => 'Primary Contact', 'is_primary' => true],
                ],
            ],
            [
                'reference_id' => 'GP-SEED-REJ-01',
                'team_name' => 'QuickBot Draft',
                'university' => 'Zagazig University',
                'college' => 'Faculty of Engineering',
                'team_size' => 2,
                'description' => 'Incomplete idea note — looking for someone to invent the whole project.',
                'deadline' => now()->addWeeks(3)->toDateString(),
                'project_type' => GraduationProjectType::HARDWARE,
                'service_type' => GraduationServiceType::CONSULTATION,
                'status' => GraduationProjectStatus::REJECTED,
                'rejection_reason' => 'Scope too vague for a viable consultation package; asked team to clarify requirements and re-submit.',
                'primary_contact_name' => 'Tamer Saeed',
                'primary_contact_phone' => '+201277778888',
                'primary_contact_email' => 'tamer.saeed.gp@example.com',
                'members' => [
                    ['name' => 'Tamer Saeed', 'phone' => '+201277778888', 'email' => 'tamer.saeed.gp@example.com', 'role_in_team' => 'Primary Contact', 'is_primary' => true],
                ],
            ],
        ];
    }

    private function testimonials(): array
    {
        return [
            [
                'workspace_id' => 1,
                'name' => 'Mariam Fathy',
                'client_name' => 'Mariam Fathy',
                'role' => 'Helwan University — MediQueue',
                'company' => 'MediQueue',
                'quote' => 'They delivered clean architecture docs and a staging demo our supervisor could click through. Defense felt prepared, not improvised.',
                'rating' => 5,
                'is_published' => true,
                'is_approved' => true,
                'source' => 'graduation_project',
                'anonymous' => false,
            ],
            [
                'workspace_id' => 1,
                'name' => 'Hassan Ibrahim',
                'client_name' => 'Hassan Ibrahim',
                'role' => 'Mansoura University — AquaSense',
                'company' => 'AquaSense',
                'quote' => 'From PCB to firmware walkthrough, everything was structured in milestones. Hardware handover happened on time before the discussion.',
                'rating' => 5,
                'is_published' => true,
                'is_approved' => true,
                'source' => 'graduation_project',
                'anonymous' => false,
            ],
            [
                'workspace_id' => 1,
                'name' => 'Youssef Kamal',
                'client_name' => 'Youssef Kamal',
                'role' => 'Alexandria University — RoboTrack',
                'company' => 'RoboTrack',
                'quote' => 'Weekly milestone updates kept our whole team aligned. We always knew what was done and what we still needed to explain.',
                'rating' => 5,
                'is_published' => true,
                'is_approved' => true,
                'source' => 'graduation_project',
                'anonymous' => false,
            ],
        ];
    }
}
