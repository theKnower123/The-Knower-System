<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            if (!Schema::hasColumn('expenses', 'unit_price')) {
                $table->decimal('unit_price', 15, 2)->default(0)->after('amount');
            }
            if (!Schema::hasColumn('expenses', 'quantity')) {
                $table->decimal('quantity', 10, 2)->default(1)->after('unit_price');
            }
            if (!Schema::hasColumn('expenses', 'transfer_proof')) {
                $table->string('transfer_proof')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('expenses', 'receipt_path')) {
                $table->string('receipt_path')->nullable()->after('transfer_proof');
            }
            if (!Schema::hasColumn('expenses', 'expense_date')) {
                $table->date('expense_date')->nullable()->after('receipt_path');
            }
        });

        // Change payment_method column to string if it was enum
        try {
            Schema::table('expenses', function (Blueprint $table) {
                $table->string('payment_method', 50)->default('cash')->change();
            });
        } catch (\Throwable $e) {
            // Ignore if doctrine/dbal is missing or column change unsupported
        }
    }

    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropColumn(['unit_price', 'quantity', 'transfer_proof', 'receipt_path', 'expense_date']);
        });
    }
};
