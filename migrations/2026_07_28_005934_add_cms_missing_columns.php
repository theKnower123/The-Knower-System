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
        Schema::table('faqs', function (Blueprint $table) {
            if (!Schema::hasColumn('faqs', 'is_active')) {
                $table->boolean('is_active')->default(true);
            }
        });
        Schema::table('blog_posts', function (Blueprint $table) {
            if (!Schema::hasColumn('blog_posts', 'author_name')) {
                $table->string('author_name')->nullable();
            }
            if (!Schema::hasColumn('blog_posts', 'cover_image')) {
                $table->string('cover_image')->nullable();
            }
        });
        Schema::table('services', function (Blueprint $table) {
            if (!Schema::hasColumn('services', 'is_active')) {
                $table->boolean('is_active')->default(true);
            }
        });
    }

    public function down(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn(['author_name', 'cover_image']);
        });
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
    }
};
