<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('platform')->unique(); // facebook, instagram, whatsapp, twitter, linkedin, youtube
            $table->string('url')->nullable();
            $table->string('label')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Seed default platforms
        DB::table('social_links')->insert([
            ['platform' => 'facebook',  'url' => null, 'label' => 'Facebook',  'is_active' => true, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['platform' => 'instagram', 'url' => null, 'label' => 'Instagram', 'is_active' => true, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['platform' => 'whatsapp',  'url' => null, 'label' => 'WhatsApp',  'is_active' => true, 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['platform' => 'twitter',   'url' => null, 'label' => 'X / Twitter','is_active' => true, 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['platform' => 'linkedin',  'url' => null, 'label' => 'LinkedIn',   'is_active' => true, 'sort_order' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['platform' => 'youtube',   'url' => null, 'label' => 'YouTube',    'is_active' => true, 'sort_order' => 6, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('social_links');
    }
};
