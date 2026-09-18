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
        Schema::disableForeignKeyConstraints();

        if (Schema::hasColumn('leads', 'contact_id')) {
            Schema::table('leads', function (Blueprint $table) {
                $table->dropForeign(['contact_id']);
                $table->dropColumn('contact_id');
            });
        }

        Schema::table('leads', function (Blueprint $table) {
            if (!Schema::hasColumn('leads', 'name')) {
                $table->string('name')->after('id')->nullable();
            }
            if (!Schema::hasColumn('leads', 'email')) {
                $table->string('email')->after('name')->nullable();
            }
            if (!Schema::hasColumn('leads', 'phone')) {
                $table->string('phone')->after('email')->nullable();
            }
        });

        Schema::dropIfExists('contacts');

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            //
        });
    }
};
