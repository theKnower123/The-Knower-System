<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('graduation_projects', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('workspace_id')->nullable()->index();
            $table->string('reference_id')->unique();
            $table->string('team_name');
            $table->string('university');
            $table->string('college');
            $table->unsignedTinyInteger('team_size')->default(1);
            $table->text('description')->nullable();
            $table->date('deadline')->nullable();
            $table->string('brief_attachment_path')->nullable();

            $table->string('project_type'); // hardware | software
            $table->string('service_type'); // consultation | partial_execution | full_execution
            $table->string('final_service_type')->nullable();
            $table->string('status')->default('pending_review');

            $table->decimal('quoted_price', 12, 2)->nullable();
            $table->boolean('deposit_paid')->default(false);
            $table->boolean('final_payment_paid')->default(false);
            $table->text('rejection_reason')->nullable();

            $table->boolean('hardware_handed_over')->default(false);
            $table->string('outcome')->nullable(); // passed | failed | unknown
            $table->text('outcome_notes')->nullable();
            $table->boolean('is_showcased')->default(false);

            $table->string('primary_contact_name');
            $table->string('primary_contact_phone');
            $table->string('primary_contact_email');

            $table->foreignId('linked_project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('clients')->nullOnDelete();
            $table->foreignId('deposit_invoice_id')->nullable()->constrained('invoices')->nullOnDelete();
            $table->foreignId('final_invoice_id')->nullable()->constrained('invoices')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('graduation_project_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('graduation_project_id')->constrained('graduation_projects')->cascadeOnDelete();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('role_in_team')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('graduation_project_members');
        Schema::dropIfExists('graduation_projects');
    }
};
