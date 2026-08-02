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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->string('channel')->default('website'); // website, email, whatsapp, portal, api
            $table->string('status')->default('waiting'); // waiting, assigned, in_progress, pending_customer, resolved, closed
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('assigned_agent_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('contact_id')->nullable()->constrained('users')->nullOnDelete(); // Assuming contacts are users/clients
            $table->string('tags')->nullable();
            $table->string('priority')->default('normal'); // low, normal, high, urgent
            $table->timestamp('sla_due_at')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->boolean('unread')->default(true);
            $table->foreignId('workspace_id')->nullable()->constrained('workspaces')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
