<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->decimal('spent', 12, 2)->default(0)->after('budget');
            $table->string('status')->default('draft')->after('spent'); // draft/active/paused/ended
            $table->string('landing_section_key')->nullable()->after('status');
        });
    }
    public function down(): void {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn(['spent', 'status', 'landing_section_key']);
        });
    }
};
