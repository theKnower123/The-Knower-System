<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('campaign_metrics', function (Blueprint $table) {
            $table->unsignedInteger('conversions')->default(0)->after('leads_generated');
        });
    }
    public function down(): void {
        Schema::table('campaign_metrics', function (Blueprint $table) {
            $table->dropColumn('conversions');
        });
    }
};
