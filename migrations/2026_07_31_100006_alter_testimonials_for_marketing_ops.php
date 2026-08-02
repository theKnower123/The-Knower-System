<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('testimonials', function (Blueprint $table) {
            if (!Schema::hasColumn('testimonials', 'client_name')) {
                $table->string('client_name')->nullable();
            }
            if (!Schema::hasColumn('testimonials', 'anonymous')) {
                $table->boolean('anonymous')->default(false);
            }
        });
    }
    public function down(): void {
        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropColumn(['client_name', 'anonymous']);
        });
    }
};
