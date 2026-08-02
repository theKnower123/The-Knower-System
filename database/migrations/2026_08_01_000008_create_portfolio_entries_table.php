<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->boolean('client_approved')->default(false);
            $table->boolean('is_visible')->default(false);
            $table->string('cover_image')->nullable();
            $table->text('description')->nullable();
            $table->json('tags')->nullable(); // ["web","mobile","desktop","system"]
            $table->boolean('show_client_name')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_entries');
    }
};
