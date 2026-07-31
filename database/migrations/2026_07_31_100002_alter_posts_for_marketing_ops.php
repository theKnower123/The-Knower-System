<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('media_label')->nullable()->after('content');
            $table->text('note')->nullable()->after('status');
            $table->unsignedInteger('reach')->nullable()->after('note');
            $table->unsignedInteger('engagement')->nullable()->after('reach');
        });

        // Extend status enum-like column to include changes_requested if it's a string column (it already is, no enum constraint at DB level in sqlite/mysql without check -- safe no-op if unconstrained).
    }
    public function down(): void {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['media_label', 'note', 'reach', 'engagement']);
        });
    }
};
