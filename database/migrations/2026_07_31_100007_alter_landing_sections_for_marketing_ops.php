<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('landing_sections', function (Blueprint $table) {
            $table->string('label')->nullable()->after('section_key');
        });
    }
    public function down(): void {
        Schema::table('landing_sections', function (Blueprint $table) {
            $table->dropColumn('label');
        });
    }
};
