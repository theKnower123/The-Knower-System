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
        $tables = array_map(fn($t) => $t->name ?? $t->TABLE_NAME ?? ((array)$t)[array_key_first((array)$t)], DB::select("SELECT name FROM sqlite_master WHERE type='table'"));
        $excluded = ['migrations', 'sqlite_sequence', 'password_reset_tokens', 'failed_jobs', 'personal_access_tokens'];

        foreach ($tables as $table) {
            if (!in_array($table, $excluded) && !Schema::hasColumn($table, 'deleted_at')) {
                Schema::table($table, function (Blueprint $t) {
                    $t->softDeletes();
                });
            }
        }
    }

    public function down(): void
    {
        $tables = array_map(fn($t) => $t->name ?? $t->TABLE_NAME ?? ((array)$t)[array_key_first((array)$t)], DB::select("SELECT name FROM sqlite_master WHERE type='table'"));
        $excluded = ['migrations', 'sqlite_sequence', 'password_reset_tokens', 'failed_jobs', 'personal_access_tokens'];

        foreach ($tables as $table) {
            if (!in_array($table, $excluded) && Schema::hasColumn($table, 'deleted_at')) {
                Schema::table($table, function (Blueprint $t) {
                    $t->dropSoftDeletes();
                });
            }
        }
    }
};
