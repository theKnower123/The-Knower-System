<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('social_accounts', function (Blueprint $table) {
            $table->unsignedInteger('followers')->default(0)->after('handle');
        });
        // Rename account_assignments -> keep as-is, it already serves as the
        // "assigned team" pivot (social_account_id, user_id, role_on_account).
    }
    public function down(): void {
        Schema::table('social_accounts', function (Blueprint $table) {
            $table->dropColumn('followers');
        });
    }
};
