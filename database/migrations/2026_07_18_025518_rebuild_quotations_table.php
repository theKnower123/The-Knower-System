<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('quotations');
        
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            
            $table->string('quotation_number')->unique();
            $table->foreignId('parent_id')->nullable()->constrained('quotations')->nullOnDelete();
            $table->integer('version')->default(1);
            
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('contact_id')->nullable()->constrained('contacts')->nullOnDelete();
            $table->foreignId('lead_id')->nullable()->constrained('leads')->nullOnDelete();
            
            $table->string('status')->default('draft')->index(); // Enum
            
            $table->date('issue_date');
            $table->date('valid_until');
            
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            
            $table->text('terms_and_conditions')->nullable();
            $table->text('notes')->nullable();
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};
