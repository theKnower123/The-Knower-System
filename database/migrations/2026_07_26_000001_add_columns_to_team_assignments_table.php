<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// NOTE: the original create_team_assignments_table migration only created
// id + timestamps, with no actual columns. This adds the columns the
// TeamAssignment model and Projects module need.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('team_assignments', function (Blueprint $table) {
            $table->foreignId('project_id')->after('id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('user_id')->after('project_id')->constrained('users')->cascadeOnDelete();
            $table->string('role_in_project')->nullable()->after('user_id');
            $table->unique(['project_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::table('team_assignments', function (Blueprint $table) {
            $table->dropUnique(['project_id', 'user_id']);
            $table->dropConstrainedForeignId('project_id');
            $table->dropConstrainedForeignId('user_id');
            $table->dropColumn('role_in_project');
        });
    }
};
