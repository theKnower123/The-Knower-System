<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add transfer_proof column to store uploaded payment proof screenshots.
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('transfer_proof')->nullable()->after('reference');
            $table->text('notes')->nullable()->after('transfer_proof');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['transfer_proof', 'notes']);
        });
    }
};
