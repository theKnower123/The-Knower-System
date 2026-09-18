<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add whatsapp_number to contacts table
        if (Schema::hasTable('contacts') && !Schema::hasColumn('contacts', 'whatsapp_number')) {
            Schema::table('contacts', function (Blueprint $table) {
                $table->string('whatsapp_number', 50)->nullable()->after('phone');
            });
        }

        // Add inquiry_type and interested_plan to leads table
        Schema::table('leads', function (Blueprint $table) {
            if (!Schema::hasColumn('leads', 'inquiry_type')) {
                // pricing_plan | demo_request | business | general
                $table->string('inquiry_type', 50)->nullable()->default('general')->after('lead_source');
            }
            if (!Schema::hasColumn('leads', 'interested_plan')) {
                $table->string('interested_plan', 100)->nullable()->after('inquiry_type');
            }
        });
    }

    public function down(): void
    {
        if (Schema::hasTable('contacts')) {
            Schema::table('contacts', function (Blueprint $table) {
                if (Schema::hasColumn('contacts', 'whatsapp_number')) {
                    $table->dropColumn('whatsapp_number');
                }
            });
        }
        Schema::table('leads', function (Blueprint $table) {
            if (Schema::hasColumn('leads', 'inquiry_type'))    $table->dropColumn('inquiry_type');
            if (Schema::hasColumn('leads', 'interested_plan')) $table->dropColumn('interested_plan');
        });
    }
};
