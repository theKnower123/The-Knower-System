<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MarketingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $workspace = \App\Modules\Settings\Models\Workspace::first();
        if (!$workspace) {
            $workspace = \App\Modules\Settings\Models\Workspace::create(['name' => 'Default Workspace', 'slug' => 'default', 'owner_id' => 1]);
        }
        $workspaceId = $workspace->id;

        \App\Modules\CMS\Models\MarketingPlan::create([
            'workspace_id' => $workspaceId,
            'name' => 'Business',
            'price_monthly' => 149.00,
            'price_yearly' => 1490.00,
            'blurb' => 'For growing software teams.',
            'features' => ['Up to 25 users', 'Unlimited projects', '100 GB storage', 'Email support', 'AI copilot (basic)'],
            'highlight' => true,
        ]);

        \App\Modules\CMS\Models\Testimonial::create([
            'workspace_id' => $workspaceId,
            'name' => 'Sarah Al-Khouri',
            'role' => 'CTO',
            'company' => 'MedCare Group',
            'quote' => 'The Knower shipped in months what our previous vendor couldn\'t in years. Rare to find a team this senior.',
            'avatar' => 'SA',
        ]);

        \App\Modules\CMS\Models\Faq::create([
            'workspace_id' => $workspaceId,
            'question' => 'What does The Knower do?',
            'answer' => 'We build custom software and ship a suite of products (CRM, ERP, HR, POS, AI, CMS) for growing businesses.',
            'group' => 'General',
        ]);
    }
}
