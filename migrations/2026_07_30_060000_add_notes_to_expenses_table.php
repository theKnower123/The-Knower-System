<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            if (!Schema::hasColumn('expenses', 'notes')) {
                $table->text('notes')->nullable();
            }
            if (!Schema::hasColumn('expenses', 'description')) {
                $table->text('description')->nullable();
            }
            if (!Schema::hasColumn('expenses', 'updated_at')) {
                $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            }
        });
    }

    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            if (Schema::hasColumn('expenses', 'notes')) {
                $table->dropColumn('notes');
            }
            if (Schema::hasColumn('expenses', 'description')) {
                $table->dropColumn('description');
            }
        });
    }
};
