<?php

namespace Database\Seeders;

use App\Modules\CMS\Models\Testimonial;
use Illuminate\Database\Seeder;

/**
 * Run with: php artisan db:seed --class="Database\Seeders\TestimonialSeeder"
 * Safe to re-run: matches by `name`, updates if it exists, creates if not.
 */
class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->testimonials() as $t) {
            Testimonial::updateOrCreate(
                ['name' => $t['name']],
                $t
            );
            $this->command?->info("Seeded testimonial from '{$t['name']}'.");
        }
    }

    private function testimonials(): array
    {
        return [
            [
                'name' => 'Salma Fahmy',
                'client_name' => 'Salma Fahmy',
                'role' => 'Operations Director',
                'company' => 'Nile Pharma',
                'quote' => 'The Knower team replaced five disconnected tools with one system our staff actually enjoys using. Order processing time dropped by over 60% in the first quarter alone.',
                'anonymous' => false,
                'is_published' => true,
            ],
            [
                'name' => 'Youssef Amrani',
                'client_name' => 'Youssef Amrani',
                'role' => 'Fleet Manager',
                'company' => 'Atlas Logistics',
                'quote' => 'Realtime visibility across our fleet paid for the project within two quarters. Support after launch has been just as responsive as during the build.',
                'anonymous' => false,
                'is_published' => true,
            ],
            [
                'name' => 'Anonymous',
                'client_name' => null,
                'role' => 'Operations Lead',
                'company' => 'Regional Retail Chain',
                'quote' => 'Delivery was on time and the handover documentation was the best we\'ve received from any vendor. Our internal team was able to take over confidently.',
                'anonymous' => true,
                'is_published' => true,
            ],
            [
                'name' => 'Karim El-Sayed',
                'client_name' => 'Karim El-Sayed',
                'role' => 'Founder',
                'company' => 'Cedar Retail',
                'quote' => 'We came in wanting a simple storefront and left with a system that actually understands our inventory. Worth every pound.',
                'anonymous' => false,
                'is_published' => true,
            ],
            [
                'name' => 'Mona Adly',
                'client_name' => 'Mona Adly',
                'role' => 'Clinic Manager',
                'company' => 'Kairo Medical Group',
                'quote' => 'Patient onboarding used to take 15 minutes of paperwork. Now it takes under two. The mobile app they built alongside the system was the part our staff loves most.',
                'anonymous' => false,
                'is_published' => true,
            ],
            [
                'name' => 'Tarek Hussein',
                'client_name' => 'Tarek Hussein',
                'role' => 'IT Manager',
                'company' => 'Alexandria Trading Co.',
                'quote' => 'We hosted our old system with a cheap provider for years and paid for it in downtime. Switching hosting to The Knower was the single best infrastructure decision we made this year.',
                'anonymous' => false,
                'is_published' => true,
            ],
        ];
    }
}
