<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('testimonials', function (Blueprint $table) {
            $table->string('client_name')->nullable()->after('client_id');
            $table->boolean('anonymous')->default(false)->after('client_name');
            // client_id already FK'd to clients -- make it nullable if it wasn't,
            // since these testimonials can be added freestanding by Marketing.
        });
    }
    public function down(): void {
        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropColumn(['client_name', 'anonymous']);
        });
    }
};
