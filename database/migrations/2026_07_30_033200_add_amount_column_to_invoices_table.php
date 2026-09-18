<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            if (!Schema::hasColumn('invoices', 'amount')) {
                $table->decimal('amount', 15, 2)->default(0)->after('invoice_number');
            }
        });

        if (Schema::hasColumn('invoices', 'total_amount') && Schema::hasColumn('invoices', 'amount')) {
            DB::statement('UPDATE invoices SET amount = total_amount WHERE (amount = 0 OR amount IS NULL) AND total_amount IS NOT NULL AND total_amount > 0');
        }
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            if (Schema::hasColumn('invoices', 'amount')) {
                $table->dropColumn('amount');
            }
        });
    }
};
