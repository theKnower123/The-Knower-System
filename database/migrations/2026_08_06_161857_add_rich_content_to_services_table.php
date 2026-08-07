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
        Schema::table('services', function (Blueprint $table) {
            if (!Schema::hasColumn('services', 'full_description')) {
                $table->longText('full_description')->nullable();
            }
            if (!Schema::hasColumn('services', 'hero_image')) {
                $table->string('hero_image')->nullable();
            }
            if (!Schema::hasColumn('services', 'badge_label')) {
                $table->string('badge_label')->nullable();
            }
            if (!Schema::hasColumn('services', 'cta_label')) {
                $table->string('cta_label')->nullable();
            }
            if (!Schema::hasColumn('services', 'features')) {
                $table->json('features')->nullable();
            }
            if (!Schema::hasColumn('services', 'benefits')) {
                $table->json('benefits')->nullable();
            }
            if (!Schema::hasColumn('services', 'highlights')) {
                $table->json('highlights')->nullable();
            }
            if (!Schema::hasColumn('services', 'tech_stack')) {
                $table->json('tech_stack')->nullable();
            }
            if (!Schema::hasColumn('services', 'process_steps')) {
                $table->json('process_steps')->nullable();
            }
            if (!Schema::hasColumn('services', 'faqs')) {
                $table->json('faqs')->nullable();
            }
            if (!Schema::hasColumn('services', 'seo_title')) {
                $table->string('seo_title')->nullable();
            }
            if (!Schema::hasColumn('services', 'seo_description')) {
                $table->text('seo_description')->nullable();
            }
            if (!Schema::hasColumn('services', 'seo_keywords')) {
                $table->string('seo_keywords')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            //
        });
    }
};
