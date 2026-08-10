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
        Schema::table('user_activity_logs', function (Blueprint $table) {
            $table->string('module')->nullable()->after('category')->index();
            $table->string('action_type')->nullable()->after('module')->index(); // create, edit, delete, upload, login, freeze, restore
            $table->string('causer_role')->nullable()->after('causer_name');
            $table->json('properties')->nullable()->after('description'); // stores before & after changes diff
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_activity_logs', function (Blueprint $table) {
            $table->dropColumn(['module', 'action_type', 'causer_role', 'properties']);
        });
    }
};
