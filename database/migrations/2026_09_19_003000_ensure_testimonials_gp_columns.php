<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            if (!Schema::hasColumn('testimonials', 'is_approved')) {
                $table->boolean('is_approved')->default(false)->after('is_published');
            }
            if (!Schema::hasColumn('testimonials', 'rating')) {
                $table->unsignedTinyInteger('rating')->nullable()->after('quote');
            }
            if (!Schema::hasColumn('testimonials', 'client_id')) {
                $table->foreignId('client_id')->nullable()->after('graduation_project_id')->constrained('clients')->nullOnDelete();
            }
            if (!Schema::hasColumn('testimonials', 'project_id')) {
                $table->foreignId('project_id')->nullable()->after('client_id')->constrained('projects')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            if (Schema::hasColumn('testimonials', 'project_id')) {
                $table->dropConstrainedForeignId('project_id');
            }
            if (Schema::hasColumn('testimonials', 'client_id')) {
                $table->dropConstrainedForeignId('client_id');
            }
            if (Schema::hasColumn('testimonials', 'rating')) {
                $table->dropColumn('rating');
            }
            if (Schema::hasColumn('testimonials', 'is_approved')) {
                $table->dropColumn('is_approved');
            }
        });
    }
};
