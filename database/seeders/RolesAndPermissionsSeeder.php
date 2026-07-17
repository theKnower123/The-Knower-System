<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create core permissions
        $permissions = [
            'view_users', 'create_users', 'edit_users', 'delete_users',
            'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
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

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create Super Admin and assign all permissions
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        // Super Admin bypasses permissions via Gate::before in AuthServiceProvider

        // Create Organization Admin
        $orgAdmin = Role::firstOrCreate(['name' => 'Organization Admin']);
        $orgAdmin->givePermissionTo(Permission::all());

        // Create Project Manager
        $pm = Role::firstOrCreate(['name' => 'Project Manager']);
        $pm->givePermissionTo([
            'view_projects', 'create_projects', 'edit_projects', 'delete_projects',
            'view_tasks', 'create_tasks', 'edit_tasks', 'delete_tasks',
            'view_bugs', 'create_bugs', 'edit_bugs', 'delete_bugs',
            'view_clients', 'view_leads'
        ]);

        // Create Developer / Staff
        $dev = Role::firstOrCreate(['name' => 'Developer']);
        $dev->givePermissionTo([
            'view_projects', 'view_tasks', 'edit_tasks', 'view_bugs', 'create_bugs', 'edit_bugs'
        ]);

        // Create Accountant
        $accountant = Role::firstOrCreate(['name' => 'Accountant']);
        $accountant->givePermissionTo([
            'view_invoices', 'create_invoices', 'edit_invoices', 'delete_invoices',
            'view_payments', 'create_payments', 'edit_payments', 'delete_payments',
            'view_expenses', 'create_expenses', 'edit_expenses', 'delete_expenses',
            'view_clients', 'view_projects'
        ]);

        // Create HR Manager
        $hr = Role::firstOrCreate(['name' => 'HR Manager']);
        $hr->givePermissionTo([
            'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
            'view_users'
        ]);

        // Create Client Role
        $client = Role::firstOrCreate(['name' => 'Client']);
        // Client permissions are inherently restricted by policies to their own data
    }
}
