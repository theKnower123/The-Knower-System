<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('portfolio_entries', function (Blueprint $table) {
            $table->string('title')->nullable()->after('project_id');
            $table->string('client_label')->nullable()->after('show_client_name');
        });
    }
    public function down(): void {
        Schema::table('portfolio_entries', function (Blueprint $table) {
            $table->dropColumn(['title', 'client_label']);
        });
    }
};
