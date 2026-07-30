<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Use raw statement to reliably modify ENUM to VARCHAR in MySQL
        DB::statement("ALTER TABLE `projects` MODIFY COLUMN `status` VARCHAR(50) DEFAULT 'planning'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE `projects` MODIFY COLUMN `status` ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled') DEFAULT 'planning'");
    }
};
