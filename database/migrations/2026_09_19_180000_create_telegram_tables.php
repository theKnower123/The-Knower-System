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
        // 1. Add Telegram columns to users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'telegram_chat_id')) {
                $table->string('telegram_chat_id')->nullable()->unique()->after('password');
            }
            if (!Schema::hasColumn('users', 'telegram_username')) {
                $table->string('telegram_username')->nullable()->after('telegram_chat_id');
            }
            if (!Schema::hasColumn('users', 'telegram_linked_at')) {
                $table->timestamp('telegram_linked_at')->nullable()->after('telegram_username');
            }
        });

        // 2. Telegram message logs (audit trail for every dispatch attempt)
        if (!Schema::hasTable('telegram_message_logs')) {
            Schema::create('telegram_message_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('chat_id')->index();
                $table->string('type')->index(); // template key or custom alert type
                $table->string('status')->index(); // sent, failed, pending
                $table->text('preview_text');
                $table->text('error_message')->nullable();
                $table->timestamp('sent_at')->nullable();
                $table->timestamps();
            });
        }

        // 3. Telegram templates (customizable bilingual notification templates)
        if (!Schema::hasTable('telegram_templates')) {
            Schema::create('telegram_templates', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->string('label');
                $table->string('category')->default('user')->index(); // user or admin
                $table->text('body_en');
                $table->text('body_ar');
                $table->json('available_variables')->nullable();
                $table->boolean('is_default_restored')->default(false);
                $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
            });
        }

        // 4. Telegram security events (audit log for recovery, linking blocks, etc.)
        if (!Schema::hasTable('telegram_security_events')) {
            Schema::create('telegram_security_events', function (Blueprint $table) {
                $table->id();
                $table->string('event_type')->index(); // reset_requested, reset_expired, reset_success, link_blocked, unlink_rejected, no_linked_account, account_unlinked
                $table->string('email')->nullable()->index();
                $table->string('role')->nullable();
                $table->string('status')->default('success')->index(); // success, blocked, rejected, warning
                $table->string('ip_address', 45)->nullable();
                $table->json('details')->nullable();
                $table->timestamps();
            });
        }

        // 5. Telegram password resets (single-use 5-minute tokens)
        if (!Schema::hasTable('telegram_password_resets')) {
            Schema::create('telegram_password_resets', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('email')->index();
                $table->string('token')->unique()->index();
                $table->timestamp('expires_at')->index();
                $table->timestamp('used_at')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('telegram_password_resets');
        Schema::dropIfExists('telegram_security_events');
        Schema::dropIfExists('telegram_templates');
        Schema::dropIfExists('telegram_message_logs');

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'telegram_linked_at')) {
                $table->dropColumn('telegram_linked_at');
            }
            if (Schema::hasColumn('users', 'telegram_username')) {
                $table->dropColumn('telegram_username');
            }
            if (Schema::hasColumn('users', 'telegram_chat_id')) {
                $table->dropColumn('telegram_chat_id');
            }
        });
    }
};
