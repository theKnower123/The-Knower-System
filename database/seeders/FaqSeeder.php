<?php

namespace Database\Seeders;

use App\Modules\CMS\Models\Faq;
use Illuminate\Database\Seeder;

/**
 * Run with: php artisan db:seed --class="Database\Seeders\FaqSeeder"
 * Safe to re-run: matches by `question`, updates if it exists, creates if not.
 */
class FaqSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->faqs() as $i => $faq) {
            $faq['sort_order'] = $i + 1;
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                $faq
            );
            $this->command?->info("Seeded FAQ: '{$faq['question']}'.");
        }
    }

    private function faqs(): array
    {
        return [
            // ---- General ----
            [
                'group' => 'General',
                'question' => 'What does The Knower actually do?',
                'answer' => 'We design, build, host, and maintain custom software -- web systems, mobile apps, and desktop applications -- for businesses that have outgrown spreadsheets and off-the-shelf tools.',
            ],
            [
                'group' => 'General',
                'question' => 'Do you only build systems, or can you host and maintain one I already have?',
                'answer' => 'Both. We build from scratch, or we can host and maintain a system someone else built for you, after a technical review of the codebase.',
            ],
            [
                'group' => 'General',
                'question' => 'What industries do you work with?',
                'answer' => 'Healthcare, retail, logistics, pharmacies, law offices, and general small-to-medium businesses are our most common clients, but the platform adapts to most operational workflows.',
            ],

            // ---- Pricing ----
            [
                'group' => 'Pricing',
                'question' => 'How is pricing structured?',
                'answer' => 'Software is a one-time build fee plus monthly hosting. Maintenance is a separate monthly plan with included hours. See our Pricing page for exact ranges by project size.',
            ],
            [
                'group' => 'Pricing',
                'question' => 'Why is Enterprise pricing not a fixed number?',
                'answer' => 'Large multi-module systems vary too much in scope to quote sight-unseen. We scope the project on a call first, then send a written proposal.',
            ],
            [
                'group' => 'Pricing',
                'question' => 'Do you offer a discount for paying yearly?',
                'answer' => 'Yes -- 15% off any monthly hosting or maintenance plan when paid annually upfront.',
            ],

            // ---- Process & Timeline ----
            [
                'group' => 'Process',
                'question' => 'How long does a typical project take?',
                'answer' => 'Simple systems: 2-4 weeks. Mid-size business systems: 6-12 weeks. Enterprise platforms: scoped individually based on modules and integrations.',
            ],
            [
                'group' => 'Process',
                'question' => 'Will I be able to see progress during the build?',
                'answer' => 'Yes -- we work in short iterations with regular check-ins and demo builds, not a single reveal at the end.',
            ],
            [
                'group' => 'Process',
                'question' => 'What happens after launch?',
                'answer' => 'Every project includes a short post-launch support window. After that, ongoing changes are covered by a Maintenance plan, or billed individually for larger requests.',
            ],

            // ---- Technical ----
            [
                'group' => 'Technical',
                'question' => 'Do I own the source code?',
                'answer' => 'Yes, completely, once the project is delivered and paid for -- no vendor lock-in.',
            ],
            [
                'group' => 'Technical',
                'question' => 'Can you connect a mobile or desktop app to a system you already built for me?',
                'answer' => 'Yes -- this is our most cost-effective add-on since the backend, database, and authentication already exist.',
            ],
            [
                'group' => 'Technical',
                'question' => 'Do you support Arabic and English (RTL) together?',
                'answer' => 'Yes, this is standard on every project we build, not an optional add-on.',
            ],

            // ---- Support ----
            [
                'group' => 'Support',
                'question' => 'What if something breaks outside business hours?',
                'answer' => 'Maintenance — Priority plan clients get same-day response with a priority queue. Basic plan includes emergency downtime response within 24 hours.',
            ],
            [
                'group' => 'Support',
                'question' => 'What counts as a "small edit" under a Maintenance plan?',
                'answer' => 'Things like adding/removing a button, changing text or colors, adding a form field, or fixing a bug in existing functionality. New modules or redesigns are quoted as separate projects.',
            ],
        ];
    }
}
