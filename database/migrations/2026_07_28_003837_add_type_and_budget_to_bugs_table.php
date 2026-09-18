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
        Schema::table('bugs', function (Blueprint $table) {
            if (!Schema::hasColumn('bugs', 'type')) {
                $table->string('type')->default('bug');
            }
            if (!Schema::hasColumn('bugs', 'budget')) {
                $table->decimal('budget', 12, 2)->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bugs', function (Blueprint $table) {
            $table->dropColumn(['type', 'budget']);
        });
    }
};
