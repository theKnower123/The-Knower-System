<?php

// Add these routes into your existing routes/web.php inside the
// authenticated + role-gated middleware group.

use App\Modules\AI\Controllers\AiSuggestionController;
use App\Modules\CMS\Controllers\LandingBuilderController;
use App\Modules\Finance\Controllers\TimesheetController;
use App\Modules\Hosting\Controllers\DeploymentController;
use App\Modules\Marketing\Controllers\CampaignController;
use App\Modules\Marketing\Controllers\PostController;
use App\Modules\Marketing\Controllers\SocialAccountController;
use App\Modules\Support\Controllers\KbArticleController;
use Illuminate\Support\Facades\Route;

// --- Marketing ---
Route::prefix('marketing')->name('marketing.')->group(function () {
    Route::get('accounts', [SocialAccountController::class, 'index'])->name('accounts.index');
    Route::post('accounts', [SocialAccountController::class, 'store'])->name('accounts.store');
    Route::post('accounts/{account}/assign', [SocialAccountController::class, 'assignUser'])->name('accounts.assign');
    Route::post('accounts/{account}/disconnect', [SocialAccountController::class, 'disconnect'])->name('accounts.disconnect');

    Route::get('posts', [PostController::class, 'index'])->name('posts.index');
    Route::post('posts', [PostController::class, 'store'])->name('posts.store');
    Route::post('posts/{post}/submit', [PostController::class, 'submitForApproval'])->name('posts.submit');
    Route::post('posts/{post}/approve', [PostController::class, 'approve'])->name('posts.approve');
    Route::post('posts/{post}/request-changes', [PostController::class, 'requestChanges'])->name('posts.requestChanges');

    Route::get('campaigns', [CampaignController::class, 'index'])->name('campaigns.index');
    Route::post('campaigns', [CampaignController::class, 'store'])->name('campaigns.store');
    Route::get('campaigns/{campaign}', [CampaignController::class, 'show'])->name('campaigns.show');
});

// --- CMS: Landing page builder ---
Route::prefix('cms/landing')->name('cms.landing.')->group(function () {
    Route::get('/', [LandingBuilderController::class, 'index'])->name('index');
    Route::post('sections/reorder', [LandingBuilderController::class, 'reorderSections'])->name('sections.reorder');
    Route::post('sections/{section}/toggle', [LandingBuilderController::class, 'toggleSection'])->name('sections.toggle');
    Route::patch('portfolio/{entry}', [LandingBuilderController::class, 'updateShowcaseEntry'])->name('portfolio.update');
    Route::post('portfolio/{entry}/toggle', [LandingBuilderController::class, 'toggleVisibility'])->name('portfolio.toggle');
});

// --- Support: Knowledge Base ---
Route::prefix('support/kb')->name('support.kb.')->group(function () {
    Route::get('/', [KbArticleController::class, 'index'])->name('index');
    Route::post('/', [KbArticleController::class, 'store'])->name('store');
    Route::post('{article}/toggle-publish', [KbArticleController::class, 'togglePublish'])->name('togglePublish');
});
Route::get('help/search', [KbArticleController::class, 'search'])->name('help.search'); // public, no auth

// --- AI Layer ---
Route::prefix('ai')->name('ai.')->group(function () {
    Route::get('suggestions', [AiSuggestionController::class, 'index'])->name('suggestions.index');
    Route::post('suggestions/{suggestion}/accept', [AiSuggestionController::class, 'accept'])->name('suggestions.accept');
    Route::post('suggestions/{suggestion}/reject', [AiSuggestionController::class, 'reject'])->name('suggestions.reject');
});

// --- Hosting: Deployments ---
Route::prefix('hosting/deployments')->name('hosting.deployments.')->group(function () {
    Route::get('/', [DeploymentController::class, 'index'])->name('index');
    Route::post('/', [DeploymentController::class, 'store'])->name('store');
});

// --- Finance: Timesheets ---
Route::prefix('finance/timesheets')->name('finance.timesheets.')->group(function () {
    Route::get('/', [TimesheetController::class, 'index'])->name('index');
    Route::post('generate', [TimesheetController::class, 'generate'])->name('generate');
    Route::post('{timesheet}/approve', [TimesheetController::class, 'approve'])->name('approve');
    Route::get('project/{project}/cost', [TimesheetController::class, 'projectCost'])->name('projectCost');
});
