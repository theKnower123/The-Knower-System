<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('social_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_tenancy_id')->nullable()->index();
            $table->string('platform'); // facebook, instagram, tiktok, linkedin, x, youtube, whatsapp
            $table->string('handle');
            $table->text('access_token_encrypted')->nullable();
            $table->foreignId('connected_by')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['active', 'disconnected'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('social_accounts');
    }
};
