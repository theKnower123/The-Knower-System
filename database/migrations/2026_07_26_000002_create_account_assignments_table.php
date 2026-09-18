<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('account_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('social_account_id')->constrained('social_accounts')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('role_on_account')->nullable(); // e.g. Social Media Manager
            $table->timestamps();

            $table->unique(['social_account_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('account_assignments');
    }
};
