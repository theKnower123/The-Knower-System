<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('employees')) {
            Schema::table('employees', function (Blueprint $table) {
                if (!Schema::hasColumn('employees', 'updated_at')) {
                    $table->timestamp('updated_at')->nullable();
                }
            });
        }

        if (Schema::hasTable('attendance')) {
            Schema::table('attendance', function (Blueprint $table) {
                if (!Schema::hasColumn('attendance', 'workspace_id')) {
                    $table->foreignId('workspace_id')->nullable()->constrained()->cascadeOnDelete();
                }
                if (!Schema::hasColumn('attendance', 'updated_at')) {
                    $table->timestamp('updated_at')->nullable();
                }
            });
        }

        if (Schema::hasTable('job_postings')) {
            Schema::table('job_postings', function (Blueprint $table) {
                if (!Schema::hasColumn('job_postings', 'workspace_id')) {
                    $table->foreignId('workspace_id')->nullable()->constrained()->cascadeOnDelete();
                }
            });
        }

        if (Schema::hasTable('job_applications')) {
            Schema::table('job_applications', function (Blueprint $table) {
                if (!Schema::hasColumn('job_applications', 'workspace_id')) {
                    $table->foreignId('workspace_id')->nullable()->constrained()->cascadeOnDelete();
                }
            });
        }
    }

    public function down(): void
    {
        // Safety migration
    }
};
