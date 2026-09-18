<?php

namespace Database\Seeders;

use App\Modules\CMS\Models\MarketingPlan;
use Illuminate\Database\Seeder;

/**
 * Seeds the 9 recurring pricing plans (Software / Hosting / Maintenance)
 * straight from the pricing spreadsheet you sent. Only the RECURRING
 * monthly/yearly numbers go here -- the one-time build price ranges,
 * add-ons, and standalone platform pricing from the spreadsheet are
 * reference material for quoting by hand, not something this table's
 * schema (price_monthly/price_yearly) can represent as a range.
 *
 * Safe to re-run: matches by `name`, updates if it exists, creates if not.
 *
 * Run with: php artisan db:seed --class="Database\Seeders\PricingPlanSeeder"
 */
class PricingPlanSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->plans() as $plan) {
            $plan['price_yearly'] = round($plan['price_monthly'] * 12 * 0.85, 2);

            MarketingPlan::updateOrCreate(
                ['name' => $plan['name']],
                $plan
            );
            $this->command?->info("Seeded plan '{$plan['name']}'.");
        }
    }

    private function plans(): array
    {
        return [
            // ---------------- SOFTWARE (bundled hosting) ----------------
            [
                'name' => 'Starter',
                'plan_type' => 'software',
                'price_monthly' => 350,
                'blurb' => 'Simple website or a small single-purpose system. One-time build: 8,000-15,000 EGP, billed separately before this monthly hosting begins.',
                'features' => [
                    '1 hosting account',
                    'SSL certificate',
                    'Basic email support',
                    'Minor post-launch bug fixes for 14 days',
                ],
                'highlight' => false,
                'cta_text' => 'Get Started',
            ],
            [
                'name' => 'Business',
                'plan_type' => 'software',
                'price_monthly' => 700,
                'blurb' => 'Mid-size system such as a simple CRM or booking + payments platform. One-time build: 20,000-40,000 EGP, billed separately before this monthly hosting begins.',
                'features' => [
                    'Custom dashboard',
                    'Up to 5 user accounts',
                    'Priority hosting resources',
                    'Monthly automated backups',
                    '30 days post-launch support',
                ],
                'highlight' => true,
                'cta_text' => 'Get Started',
            ],
            [
                'name' => 'Enterprise',
                'plan_type' => 'software',
                'price_monthly' => 1800,
                'blurb' => 'Large, multi-module platform (ERP-style, multiple departments, integrations). No fixed build price -- every Enterprise project gets a written proposal after a scoping call.',
                'features' => [
                    'Full modular platform',
                    'Unlimited users',
                    'Dedicated server resources',
                    'Priority support channel',
                    'Formal SLA available on request',
                ],
                'highlight' => false,
                'cta_text' => 'Request a Quote',
            ],

            // ---------------- HOSTING ONLY ----------------
            [
                'name' => 'Hosting — Basic',
                'plan_type' => 'hosting',
                'price_monthly' => 450,
                'blurb' => 'Small external website (brochure site, portfolio, small blog). One-time migration fee: 500-1,000 EGP.',
                'features' => [
                    'Shared hosting environment',
                    'SSL certificate',
                    'Weekly automated backups',
                    'Uptime monitoring',
                    'Email support',
                ],
                'highlight' => false,
                'cta_text' => 'Get Started',
            ],
            [
                'name' => 'Hosting — Standard',
                'plan_type' => 'hosting',
                'price_monthly' => 950,
                'blurb' => 'Mid-size external system (small SaaS, internal business tool). One-time migration fee: 1,000-2,000 EGP. Includes 1 free deployment/update per month.',
                'features' => [
                    'Better CPU/RAM allocation',
                    'Daily automated backups',
                    'Uptime + error monitoring with alerts',
                    'Priority email support',
                ],
                'highlight' => true,
                'cta_text' => 'Get Started',
            ],
            [
                'name' => 'Hosting — Dedicated',
                'plan_type' => 'hosting',
                'price_monthly' => 2200,
                'blurb' => 'Large external system or high-traffic site that needs its own server. Migration fee quoted per server spec after a technical review.',
                'features' => [
                    'Dedicated server resources (not shared)',
                    'Custom scaling as traffic grows',
                    '24/7 monitoring',
                    'Priority support with faster response time',
                ],
                'highlight' => false,
                'cta_text' => 'Request a Quote',
            ],

            // ---------------- MAINTENANCE ----------------
            [
                'name' => 'Maintenance — Basic',
                'plan_type' => 'maintenance',
                'price_monthly' => 600,
                'blurb' => 'For systems that just need to stay safe and online, no active feature work. No code changes included -- small edits billed at 300 EGP/hour.',
                'features' => [
                    'Security patches applied monthly',
                    'Uptime checks',
                    'Monthly written health report',
                    'Emergency downtime response within 24h',
                ],
                'highlight' => false,
                'cta_text' => 'Get Started',
            ],
            [
                'name' => 'Maintenance — Standard',
                'plan_type' => 'maintenance',
                'price_monthly' => 1500,
                'blurb' => 'For clients who need small, regular tweaks without a new project each time. Up to 3 hours/month included; unused hours do not roll over.',
                'features' => [
                    'Everything in Basic',
                    'Up to 3 hours/month of small changes',
                    'Same-week response time',
                ],
                'highlight' => true,
                'cta_text' => 'Get Started',
            ],
            [
                'name' => 'Maintenance — Priority',
                'plan_type' => 'maintenance',
                'price_monthly' => 2800,
                'blurb' => 'For active, fast-moving projects with frequent small requests. Up to 8 hours/month included; unused hours do not roll over.',
                'features' => [
                    'Everything in Standard',
                    'Up to 8 hours/month',
                    'Same-day response',
                    'Priority queue ahead of Basic/Standard clients',
                ],
                'highlight' => false,
                'cta_text' => 'Get Started',
            ],
        ];
    }
}
