<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained('invoices')->cascadeOnDelete();
            $table->enum('method', ['cash', 'bank_transfer', 'vodafone_cash', 'instapay', 'paypal', 'stripe', 'other'])->default('bank_transfer');
            $table->decimal('amount', 15, 2);
            $table->timestamp('paid_at')->nullable();
            $table->string('reference')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
