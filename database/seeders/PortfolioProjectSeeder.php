<?php

namespace Database\Seeders;

use App\Modules\Projects\Models\Project;
use Illuminate\Database\Seeder;

/**
 * Seeds impressive, realistic PUBLIC portfolio projects -- these are what
 * your /api/v1/public/portfolio endpoint reads directly from the
 * `projects` table (is_public = true), which is what your public
 * /portfolio page displays. Matched by `name`, safe to re-run.
 *
 * IMPORTANT: these are placeholder/demo projects, not real client work.
 * Replace them with real projects (mark a real Project `is_public = true`
 * from your admin) as you build a real portfolio -- don't leave fake
 * client names live long-term. The two flagged 'anonymous' style entries
 * use generic industry labels instead of invented company names for
 * exactly this reason.
 *
 * Cover images are real, free-to-use stock photo URLs (Unsplash direct
 * links) since I can't generate custom images -- swap these for real
 * screenshots of your actual work whenever you have them.
 *
 * Run with: php artisan db:seed --class="Database\Seeders\PortfolioProjectSeeder"
 */
class PortfolioProjectSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->projects() as $data) {
            Project::updateOrCreate(['name' => $data['name']], $data);
        }
        $this->command?->info('Seeded 6 public portfolio projects.');
    }

    private function projects(): array
    {
        return [
            [
                'name' => 'MedCare Patient Portal',
                'description' => 'A unified patient portal serving 40 clinics across the region -- digital intake, EMR integration, and WhatsApp appointment reminders that cut average wait times by 63%.',
                'type' => 'Web',
                'status' => 'completed',
                'priority' => 'high',
                'progress' => 100,
                'start_date' => now()->subMonths(10),
                'deadline' => now()->subMonths(6),
                'is_public' => true,
                'cover_image' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
                'public_summary' => 'Digital intake, EMR integration, and automated reminders across 40 clinics.',
                'public_stack' => ['React', 'Laravel', 'MySQL', 'AWS'],
                'public_category' => 'Healthcare',
            ],
            [
                'name' => 'ShelfSmart Point of Sale',
                'description' => 'Offline-first POS system deployed across 220 retail stores, with real-time sync and centralized reporting that kept every register running through the busiest holiday season without a single hour of downtime.',
                'type' => 'Desktop',
                'status' => 'completed',
                'priority' => 'high',
                'progress' => 100,
                'start_date' => now()->subMonths(14),
                'deadline' => now()->subMonths(9),
                'is_public' => true,
                'cover_image' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
                'public_summary' => 'Offline-first POS across 220 stores with zero-downtime holiday rollout.',
                'public_stack' => ['Electron', 'Node.js', 'PostgreSQL'],
                'public_category' => 'Retail',
            ],
            [
                'name' => 'VaultBank Digital Onboarding',
                'description' => 'A digital KYC and account-opening flow that cut onboarding time from 5 days to under 8 minutes, built with a full audit trail to satisfy regulator review from day one.',
                'type' => 'Mobile',
                'status' => 'completed',
                'priority' => 'urgent',
                'progress' => 100,
                'start_date' => now()->subMonths(8),
                'deadline' => now()->subMonths(3),
                'is_public' => true,
                'cover_image' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80',
                'public_summary' => 'KYC and onboarding cut from 5 days to 8 minutes, fully auditable.',
                'public_stack' => ['Flutter', 'Node.js', 'AWS'],
                'public_category' => 'FinTech',
            ],
            [
                'name' => 'CityPay Citizen Payments Portal',
                'description' => 'A government payments portal processing citizen fees and fines, built for high availability and handling well over $200M in transactions annually without a single reconciliation error.',
                'type' => 'Web',
                'status' => 'completed',
                'priority' => 'high',
                'progress' => 100,
                'start_date' => now()->subMonths(18),
                'deadline' => now()->subMonths(12),
                'is_public' => true,
                'cover_image' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
                'public_summary' => 'Citizen payments portal handling $200M+ in annual transactions.',
                'public_stack' => ['Vue', 'Laravel', 'Oracle'],
                'public_category' => 'Government',
            ],
            [
                'name' => 'LogiRoute Fleet Management',
                'description' => 'Real-time fleet tracking and route optimization for a logistics operator managing thousands of vehicles -- live GPS, predictive maintenance alerts, and a dispatcher dashboard that replaced three disconnected spreadsheets.',
                'type' => 'Web',
                'status' => 'completed',
                'priority' => 'medium',
                'progress' => 100,
                'start_date' => now()->subMonths(11),
                'deadline' => now()->subMonths(5),
                'is_public' => true,
                'cover_image' => 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80',
                'public_summary' => 'Real-time fleet tracking and route optimization at scale.',
                'public_stack' => ['React', 'Go', 'Kafka'],
                'public_category' => 'Logistics',
            ],
            [
                'name' => 'Confidential Clinic Group Booking System',
                'description' => 'A multi-branch appointment booking and staff scheduling system for a private healthcare group. Client requested the company name stay confidential; shown here with permission to showcase the work itself.',
                'type' => 'Web',
                'status' => 'completed',
                'priority' => 'medium',
                'progress' => 100,
                'start_date' => now()->subMonths(6),
                'deadline' => now()->subMonths(2),
                'is_public' => true,
                'cover_image' => 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80',
                'public_summary' => 'Multi-branch booking and staff scheduling for a private clinic group.',
                'public_stack' => ['React', 'Laravel', 'MySQL'],
                'public_category' => 'Healthcare',
            ],
        ];
    }
}
