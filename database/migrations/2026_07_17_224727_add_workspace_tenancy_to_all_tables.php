<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('workspaces', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('workspace_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('current_workspace_id')->nullable()->constrained('workspaces')->nullOnDelete();
        });

        $tables = [
            'companies', 'clients', 'leads', 'contracts', 'quotations',
            'projects', 'milestones', 'tasks', 'bugs', 'files',
            'invoices', 'payments', 'expenses',
            'servers', 'hosting_accounts', 'domains', 'ssl_certificates',
            'tickets', 'ticket_messages',
            'employees', 'attendances', 'leaves'
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->foreignId('workspace_id')->nullable()->constrained()->cascadeOnDelete();
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'companies', 'clients', 'leads', 'contracts', 'quotations',
            'projects', 'milestones', 'tasks', 'bugs', 'files',
            'invoices', 'payments', 'expenses',
            'servers', 'hosting_accounts', 'domains', 'ssl_certificates',
            'tickets', 'ticket_messages',
            'employees', 'attendances', 'leaves'
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropForeign(['workspace_id']);
                    $table->dropColumn('workspace_id');
                });
            }
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['current_workspace_id']);
            $table->dropColumn('current_workspace_id');
        });

        Schema::dropIfExists('workspace_user');
        Schema::dropIfExists('workspaces');
    }
};
