<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'is_graduation_project')) {
                $table->boolean('is_graduation_project')->default(false)->after('is_public');
            }
        });

        Schema::table('milestones', function (Blueprint $table) {
            if (!Schema::hasColumn('milestones', 'completed_at')) {
                $table->timestamp('completed_at')->nullable()->after('status');
            }
        });

        Schema::table('testimonials', function (Blueprint $table) {
            if (!Schema::hasColumn('testimonials', 'source')) {
                $table->string('source')->nullable()->after('is_published');
            }
            if (!Schema::hasColumn('testimonials', 'graduation_project_id')) {
                $table->foreignId('graduation_project_id')
                    ->nullable()
                    ->after('source')
                    ->constrained('graduation_projects')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            if (Schema::hasColumn('testimonials', 'graduation_project_id')) {
                $table->dropConstrainedForeignId('graduation_project_id');
            }
            if (Schema::hasColumn('testimonials', 'source')) {
                $table->dropColumn('source');
            }
        });

        Schema::table('milestones', function (Blueprint $table) {
            if (Schema::hasColumn('milestones', 'completed_at')) {
                $table->dropColumn('completed_at');
            }
        });

        Schema::table('projects', function (Blueprint $table) {
            if (Schema::hasColumn('projects', 'is_graduation_project')) {
                $table->dropColumn('is_graduation_project');
            }
        });
    }
};
