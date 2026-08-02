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
        Schema::create('error_logs', function (Blueprint $table) {
            $table->id();
            $table->string('correlation_id')->nullable()->index();
            $table->string('request_id')->nullable()->index();
            $table->integer('status_code')->nullable()->index();
            $table->text('message')->nullable();
            $table->string('exception_type')->nullable();
            $table->string('file')->nullable();
            $table->integer('line')->nullable();
            $table->longText('stack_trace')->nullable();
            $table->string('url')->nullable();
            $table->string('method', 10)->nullable();
            $table->string('ip')->nullable();
            $table->text('browser')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('workspace_id')->nullable()->constrained('workspaces')->nullOnDelete();
            $table->string('module')->nullable();
            $table->longText('request_payload')->nullable();
            $table->longText('headers')->nullable();
            $table->float('response_time')->nullable(); // in milliseconds
            $table->longText('response_payload')->nullable();
            $table->string('log_channel')->default('application')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('error_logs');
    }
};
