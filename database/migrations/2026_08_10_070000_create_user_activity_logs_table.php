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
        Schema::create('user_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->unsignedBigInteger('causer_id')->nullable()->index();
            $table->string('causer_name')->nullable();
            $table->string('action'); // e.g. "Edited Client Profile", "Account Frozen", "Successful Login"
            $table->string('category')->default('general')->index(); // "security", "auth", "profile", "crud", "file", "admin"
            $table->string('target_entity')->nullable(); // e.g. "Client #1024", "Invoice #801"
            $table->text('description')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_activity_logs');
    }
};
