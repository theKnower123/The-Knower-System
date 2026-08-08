<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Auth\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Re-create the super admin first (no workspace yet)
        $admin = User::firstOrCreate(
            ['email' => 'omarmehawed4@knoweros.com'],
            [
                'name' => 'Omar Mehawed',
                'role' => 'super_admin',
                'password' => Hash::make('password')
            ]
        );

        // Create default workspace owned by admin
        $workspace = \App\Modules\Settings\Models\Workspace::firstOrCreate(
            ['id' => 1],
            ['name' => 'Main Workspace', 'slug' => 'main', 'owner_id' => $admin->id]
        );

        // Optionally update admin if current_workspace_id exists
        $admin->current_workspace_id = $workspace->id;
        $admin->save();

        // Let's create an example agent as well
        User::firstOrCreate(
            ['email' => 'agent@admin.com'],
            [
                'name' => 'Support Agent',
                'role' => 'support',
                'password' => Hash::make('password') 
            ]
        );
        $this->call([
            BlogPostSeeder::class,
            FaqSeeder::class,
            PricingPlanSeeder::class,
            ServiceContentSeeder::class,
            TestimonialSeeder::class,
        ]);
    }
}
