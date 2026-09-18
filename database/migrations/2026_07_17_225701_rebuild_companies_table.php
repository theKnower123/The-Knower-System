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
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('companies');
        Schema::enableForeignKeyConstraints();
        
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            
            // Basic Information
            $table->string('company_name')->index();
            $table->string('legal_name')->nullable();
            $table->string('company_code')->unique()->nullable();
            $table->string('company_type')->nullable()->index(); // e.g. Enterprise, SMB, Startup
            $table->string('industry')->nullable()->index();
            $table->string('company_size')->nullable(); // e.g. 1-10, 11-50, etc.
            $table->string('status')->default('active')->index(); // Enum: active, inactive, archived
            
            // Registration
            $table->string('tax_number')->nullable();
            $table->string('commercial_registration')->nullable();
            $table->string('vat_number')->nullable();
            $table->string('country')->nullable()->index();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->text('address')->nullable();
            
            // Contact Information
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable();
            $table->string('mobile')->nullable();
            $table->string('website')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('contact_person_name')->nullable();
            $table->string('contact_person_position')->nullable();
            
            // Business Information
            $table->decimal('annual_revenue', 15, 2)->nullable();
            $table->decimal('expected_project_value', 15, 2)->nullable();
            $table->string('preferred_currency', 3)->default('USD');
            $table->string('timezone')->nullable();
            $table->string('language')->default('en');
            
            // Sales
            $table->string('lead_source')->nullable();
            $table->foreignId('account_owner')->nullable()->constrained('users')->nullOnDelete();
            $table->string('sales_stage')->nullable()->index(); // Enum: prospect, qualified, negotiation, closed_won, closed_lost
            $table->string('priority')->default('medium'); // Enum: low, medium, high, urgent
            $table->date('customer_since')->nullable();
            $table->timestamp('last_contact_at')->nullable();
            $table->timestamp('next_follow_up_at')->nullable();
            
            // AI
            $table->text('company_summary')->nullable();
            $table->json('ai_tags')->nullable();
            $table->string('ai_sentiment')->nullable(); // positive, neutral, negative
            $table->integer('ai_score')->nullable(); // 0-100
            
            // Metadata
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
