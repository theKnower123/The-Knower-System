<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. social_accounts
        if (!Schema::hasTable('social_accounts')) {
            Schema::create('social_accounts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('workspace_id')->default(1)->index();
                $table->string('platform'); // facebook, instagram, tiktok, linkedin, x, youtube, whatsapp
                $table->string('handle');
                $table->text('access_token_encrypted')->nullable();
                $table->foreignId('connected_by')->constrained('users')->cascadeOnDelete();
                $table->enum('status', ['active', 'disconnected'])->default('active');
                $table->timestamps();
                $table->softDeletes();
            });
        }

        // 2. account_assignments
        if (!Schema::hasTable('account_assignments')) {
            Schema::create('account_assignments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('social_account_id')->constrained('social_accounts')->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('role_on_account')->default('manager');
                $table->timestamps();
            });
        }

        // 3. posts
        if (!Schema::hasTable('posts')) {
            Schema::create('posts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('workspace_id')->default(1)->index();
                $table->text('content');
                $table->string('media_path')->nullable();
                $table->enum('status', ['draft', 'pending_approval', 'scheduled', 'published', 'rejected'])->default('draft');
                $table->timestamp('scheduled_at')->nullable();
                $table->timestamp('published_at')->nullable();
                $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
                $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
                $table->text('rejection_reason')->nullable();
                $table->json('status_history')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        } else {
            Schema::table('posts', function (Blueprint $table) {
                if (!Schema::hasColumn('posts', 'rejection_reason')) {
                    $table->text('rejection_reason')->nullable();
                }
                if (!Schema::hasColumn('posts', 'status_history')) {
                    $table->json('status_history')->nullable();
                }
            });
        }

        // 4. post_accounts
        if (!Schema::hasTable('post_accounts')) {
            Schema::create('post_accounts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('post_id')->constrained('posts')->cascadeOnDelete();
                $table->foreignId('social_account_id')->constrained('social_accounts')->cascadeOnDelete();
            });
        }

        // 5. campaigns
        if (!Schema::hasTable('campaigns')) {
            Schema::create('campaigns', function (Blueprint $table) {
                $table->id();
                $table->foreignId('workspace_id')->default(1)->index();
                $table->string('name');
                $table->string('platform');
                $table->enum('objective', ['traffic', 'leads', 'awareness', 'conversions'])->default('leads');
                $table->decimal('budget', 12, 2)->default(0);
                $table->date('start_date');
                $table->date('end_date')->nullable();
                $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
                $table->timestamps();
                $table->softDeletes();
            });
        }

        // 6. campaign_metrics
        if (!Schema::hasTable('campaign_metrics')) {
            Schema::create('campaign_metrics', function (Blueprint $table) {
                $table->id();
                $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
                $table->date('date');
                $table->unsignedInteger('reach')->default(0);
                $table->unsignedInteger('clicks')->default(0);
                $table->decimal('cost', 12, 2)->default(0);
                $table->unsignedInteger('leads_generated')->default(0);
                $table->timestamps();
            });
        }

        // 7. portfolio_entries
        if (!Schema::hasTable('portfolio_entries')) {
            Schema::create('portfolio_entries', function (Blueprint $table) {
                $table->id();
                $table->foreignId('workspace_id')->default(1)->index();
                $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
                $table->boolean('client_approved')->default(false);
                $table->boolean('is_visible')->default(false);
                $table->string('cover_image')->nullable();
                $table->text('description')->nullable();
                $table->json('tags')->nullable();
                $table->boolean('show_client_name')->default(false);
                $table->timestamps();
            });
        }

        // 8. testimonials
        if (!Schema::hasTable('testimonials')) {
            Schema::create('testimonials', function (Blueprint $table) {
                $table->id();
                $table->foreignId('workspace_id')->default(1)->index();
                $table->foreignId('client_id')->nullable()->constrained('clients')->nullOnDelete();
                $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
                $table->string('client_name')->nullable();
                $table->text('quote');
                $table->unsignedTinyInteger('rating')->default(5);
                $table->boolean('is_approved')->default(false);
                $table->timestamps();
            });
        } else {
            Schema::table('testimonials', function (Blueprint $table) {
                if (!Schema::hasColumn('testimonials', 'workspace_id')) {
                    $table->foreignId('workspace_id')->default(1)->index();
                }
                if (!Schema::hasColumn('testimonials', 'client_name')) {
                    $table->string('client_name')->nullable();
                }
            });
        }

        // 9. landing_sections
        if (!Schema::hasTable('landing_sections')) {
            Schema::create('landing_sections', function (Blueprint $table) {
                $table->id();
                $table->foreignId('workspace_id')->default(1)->index();
                $table->string('section_key'); // hero, services, featured_work, testimonials, pricing, cta
                $table->string('title')->nullable();
                $table->boolean('is_visible')->default(true);
                $table->unsignedInteger('sort_order')->default(0);
                $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
            });
        } else {
            Schema::table('landing_sections', function (Blueprint $table) {
                if (!Schema::hasColumn('landing_sections', 'title')) {
                    $table->string('title')->nullable();
                }
                if (!Schema::hasColumn('landing_sections', 'workspace_id')) {
                    $table->foreignId('workspace_id')->default(1)->index();
                }
            });
        }

        // 10. lead_followups
        if (!Schema::hasTable('lead_followups')) {
            Schema::create('lead_followups', function (Blueprint $table) {
                $table->id();
                $table->foreignId('workspace_id')->default(1)->index();
                $table->foreignId('lead_id')->constrained('leads')->cascadeOnDelete();
                $table->string('channel')->default('call'); // call, email, whatsapp, meeting
                $table->text('notes')->nullable();
                $table->string('outcome')->nullable(); // interested, callback_requested, proposal_sent, converted, not_interested
                $table->date('follow_up_date')->nullable();
                $table->date('next_follow_up_date')->nullable();
                $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
                $table->timestamps();
                $table->softDeletes();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_followups');
        Schema::dropIfExists('landing_sections');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('portfolio_entries');
        Schema::dropIfExists('campaign_metrics');
        Schema::dropIfExists('campaigns');
        Schema::dropIfExists('post_accounts');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('account_assignments');
        Schema::dropIfExists('social_accounts');
    }
};
