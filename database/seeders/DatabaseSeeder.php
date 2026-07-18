<?php

namespace Database\Seeders;

use App\Modules\Auth\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $allPermissions = [
            'view_users', 'create_users', 'edit_users', 'delete_users',
            'view_companies', 'create_companies', 'edit_companies', 'delete_companies',
            'view_clients', 'create_clients', 'edit_clients', 'delete_clients',
            'view_leads', 'create_leads', 'edit_leads', 'delete_leads',
            'view_contracts', 'create_contracts', 'edit_contracts', 'delete_contracts',
            'view_quotations', 'create_quotations', 'edit_quotations', 'delete_quotations',
            'view_projects', 'create_projects', 'edit_projects', 'delete_projects',
            'view_tasks', 'create_tasks', 'edit_tasks', 'delete_tasks',
            'view_bugs', 'create_bugs', 'edit_bugs', 'delete_bugs',
            'view_invoices', 'create_invoices', 'edit_invoices', 'delete_invoices',
            'view_payments', 'create_payments', 'edit_payments', 'delete_payments',
            'view_expenses', 'create_expenses', 'edit_expenses', 'delete_expenses',
            'view_servers', 'create_servers', 'edit_servers', 'delete_servers',
            'view_tickets', 'create_tickets', 'edit_tickets', 'delete_tickets',
            'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
        ];

        User::updateOrCreate(['email' => 'admin@theknoweros.com'], [
            'name' => 'Administrator',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'role' => 'super_admin',
            'permissions' => [], // Super admin bypasses this in the model
        ]);

        User::updateOrCreate(['email' => 'ceo@theknoweros.com'], [
            'name' => 'CEO',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'role' => 'ceo',
            'permissions' => $allPermissions,
        ]);

        User::updateOrCreate(['email' => 'pm@theknoweros.com'], [
            'name' => 'Project Manager',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'role' => 'project_manager',
            'permissions' => [
                'view_projects', 'create_projects', 'edit_projects', 'delete_projects',
                'view_tasks', 'create_tasks', 'edit_tasks', 'delete_tasks',
                'view_bugs', 'create_bugs', 'edit_bugs', 'delete_bugs',
                'view_clients', 'view_leads'
            ],
        ]);

        User::updateOrCreate(['email' => 'dev@theknoweros.com'], [
            'name' => 'Software Developer',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'role' => 'developer',
            'permissions' => [
                'view_projects', 'view_tasks', 'edit_tasks', 'view_bugs', 'create_bugs', 'edit_bugs'
            ],
        ]);

        User::updateOrCreate(['email' => 'accountant@theknoweros.com'], [
            'name' => 'Accountant',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'role' => 'accountant',
            'permissions' => [
                'view_invoices', 'create_invoices', 'edit_invoices', 'delete_invoices',
                'view_payments', 'create_payments', 'edit_payments', 'delete_payments',
                'view_expenses', 'create_expenses', 'edit_expenses', 'delete_expenses',
                'view_clients', 'view_projects'
            ],
        ]);

        User::updateOrCreate(['email' => 'hr@theknoweros.com'], [
            'name' => 'HR Manager',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'role' => 'hr',
            'permissions' => [
                'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
                'view_users'
            ],
        ]);

        User::updateOrCreate(['email' => 'client@theknoweros.com'], [
            'name' => 'Client User',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'role' => 'client',
            'permissions' => [],
        ]);
    }
}
