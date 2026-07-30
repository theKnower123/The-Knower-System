<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subtasks', function (Blueprint $table) {
            if (!Schema::hasColumn('subtasks', 'task_id')) {
                $table->foreignId('task_id')->after('id')->constrained('tasks')->cascadeOnDelete();
            }
            if (!Schema::hasColumn('subtasks', 'title')) {
                $table->string('title')->after('task_id');
            }
            if (!Schema::hasColumn('subtasks', 'is_done')) {
                $table->boolean('is_done')->default(false)->after('title');
            }
        });
    }

    public function down(): void
    {
        Schema::table('subtasks', function (Blueprint $table) {
            $table->dropConstrainedForeignId('task_id');
            $table->dropColumn(['title', 'is_done']);
        });
    }
};
