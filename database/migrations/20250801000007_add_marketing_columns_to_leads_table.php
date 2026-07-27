<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->string('source')->nullable()->after('id'); // facebook_ad, instagram, referral, direct
            $table->string('utm_campaign')->nullable();
            $table->string('utm_source')->nullable();
            $table->date('follow_up_date')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn(['source', 'utm_campaign', 'utm_source', 'follow_up_date']);
        });
    }
};
