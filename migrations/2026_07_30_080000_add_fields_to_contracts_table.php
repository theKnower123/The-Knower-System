<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            if (!Schema::hasColumn('contracts', 'project_id')) {
                $table->foreignId('project_id')->nullable()->after('client_id')->constrained('projects')->nullOnDelete();
            }
            if (!Schema::hasColumn('contracts', 'type')) {
                $table->string('type', 100)->nullable();
            }
            if (!Schema::hasColumn('contracts', 'amount')) {
                $table->decimal('amount', 15, 2)->nullable();
            }
            if (!Schema::hasColumn('contracts', 'notes')) {
                $table->text('notes')->nullable();
            }
            if (!Schema::hasColumn('contracts', 'description')) {
                $table->text('description')->nullable();
            }
            if (!Schema::hasColumn('contracts', 'file')) {
                $table->string('file')->nullable();
            }
            if (!Schema::hasColumn('contracts', 'document')) {
                $table->string('document')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            if (Schema::hasColumn('contracts', 'project_id')) {
                $table->dropForeign(['project_id']);
                $table->dropColumn('project_id');
            }
            if (Schema::hasColumn('contracts', 'type')) {
                $table->dropColumn('type');
            }
            if (Schema::hasColumn('contracts', 'amount')) {
                $table->dropColumn('amount');
            }
            if (Schema::hasColumn('contracts', 'notes')) {
                $table->dropColumn('notes');
            }
            if (Schema::hasColumn('contracts', 'description')) {
                $table->dropColumn('description');
            }
            if (Schema::hasColumn('contracts', 'document')) {
                $table->dropColumn('document');
            }
        });
    }
};
