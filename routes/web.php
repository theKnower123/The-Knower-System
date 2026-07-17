<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Redirect root to dashboard or login ─────────────────────────────────────
Route::get('/', function () {
    return redirect()->route('dashboard');
});

// ─── Dashboard ────────────────────────────────────────────────────────────────
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// ─── Authenticated routes ─────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Core Platform Routes
    Route::get('/roles', function () {
        return Inertia::render('Core/Roles');
    })->name('roles.index');

    Route::get('/workspaces', function () {
        return Inertia::render('Core/Workspaces');
    })->name('workspaces.index');

    // CRM Routes
    Route::get('/companies', function () {
        return Inertia::render('CRM/Companies');
    })->name('companies.index');

    Route::get('/contacts', function () {
        return Inertia::render('CRM/Contacts');
    })->name('contacts.index');

    Route::get('/leads', function () {
        return Inertia::render('CRM/Leads');
    })->name('leads.index');

    Route::get('/quotations', function () {
        return Inertia::render('CRM/Quotations');
    })->name('quotations.index');
});

require __DIR__.'/auth.php';
