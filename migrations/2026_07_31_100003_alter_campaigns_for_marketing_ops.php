<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('campaigns', function (Blueprint $table) {
            if (!Schema::hasColumn('campaigns', 'spent')) {
                $table->decimal('spent', 12, 2)->default(0)->after('budget');
            }
            if (!Schema::hasColumn('campaigns', 'status')) {
                $table->string('status')->default('draft');
            }
            if (!Schema::hasColumn('campaigns', 'landing_section_key')) {
                $table->string('landing_section_key')->nullable();
            }
        });
    }
    public function down(): void {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn(['spent', 'status', 'landing_section_key']);
        });
    }
};
