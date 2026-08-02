<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoice_items', function (Blueprint $table) {
            if (!Schema::hasColumn('invoice_items', 'invoice_id')) {
                $table->foreignId('invoice_id')->after('id')->constrained('invoices')->cascadeOnDelete();
            }
            if (!Schema::hasColumn('invoice_items', 'description')) {
                $table->string('description')->after('invoice_id');
            }
            if (!Schema::hasColumn('invoice_items', 'qty')) {
                $table->unsignedInteger('qty')->default(1)->after('description');
            }
            if (!Schema::hasColumn('invoice_items', 'unit_price')) {
                $table->decimal('unit_price', 10, 2)->after('qty');
            }
        });
    }

    public function down(): void
    {
        Schema::table('invoice_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('invoice_id');
            $table->dropColumn(['description', 'qty', 'unit_price']);
        });
    }
};
