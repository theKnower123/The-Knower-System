<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subtasks', function (Blueprint $table) {
            $table->foreignId('task_id')->after('id')->constrained('tasks')->cascadeOnDelete();
            $table->string('title')->after('task_id');
            $table->boolean('is_done')->default(false)->after('title');
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
