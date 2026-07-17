
import React from 'react';
import { Head } from '@inertiajs/react';

export default function Roles() {
    return (
        <>
            <Head title="Roles & Permissions" />
            <div className="flex h-screen overflow-hidden bg-obsidian-base font-body-md text-body-md text-on-background">
                {/* Body Content Starts */}
                
{/* SideNavBar (Shared Component) */}
<nav className="hidden md:flex flex-col h-full py-6 px-4 bg-obsidian-base dark:bg-obsidian-base docked h-screen left-0 w-64 border-r border-outline-variant flat no shadows">
{/* Header */}
<div className="flex items-center gap-xs mb-gap-lg px-2">
<div className="w-10 h-10 rounded-lg bg-obsidian-elevated flex items-center justify-center border border-outline-variant/30 text-primary-container overflow-hidden">
<img className="w-full h-full object-cover" data-alt="A stylized geometric logo symbolizing a complex enterprise suite workspace, rendered in high contrast cyan and purple neon lines against a deep dark background. Sleek, professional, modern tech aesthetic suitable for a high-end application avatar." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJSuUqFRrVpsWLzFhB4d4bhVIj1X4aMk096oSL_GKkh-x86U0ChzxmpO0Tjb2oIAWtbDhoI5ULw1-GgMDgJ_E-DBrLBmgZjzGH4CkvpZBcZ-38XoyyGPO25RjgLpcm6d85pb2xdBbXjtbcdS6HTjlhCkK8QSowDvZ1hbDA-asDWdOd2Pd0CG1c44KDZSpK8dX4_5ZrfEZbkkyD3jzFEwl0DcXowiYe6iUG_3yOJVtEAq0_23F-N7FAepUbMSpx4sYQFzdI5vQPLiSg"/>
</div>
<div>
<h1 className="text-headline-md font-headline-md font-bold text-primary dark:text-primary leading-tight text-xl">The Knower OS</h1>
<p className="text-label-xs font-label-xs text-on-surface-variant">Enterprise Suite</p>
</div>
</div>
{/* Main Navigation */}
<div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
<a className="flex items-center gap-md px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200 group" href="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">dashboard</span>
<span className="text-label-sm font-label-sm">Dashboard</span>
</a>
<a className="flex items-center gap-md px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200 group" href="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">group</span>
<span className="text-label-sm font-label-sm">CRM</span>
</a>
<a className="flex items-center gap-md px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200 group" href="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">tactic</span>
<span className="text-label-sm font-label-sm">Projects</span>
</a>
<a className="flex items-center gap-md px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200 group" href="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">payments</span>
<span className="text-label-sm font-label-sm">Finance</span>
</a>
<a className="flex items-center gap-md px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200 group" href="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">monitoring</span>
<span className="text-label-sm font-label-sm">Analytics</span>
</a>
<a className="flex items-center gap-md px-3 py-2 rounded-lg bg-obsidian-elevated text-secondary-container font-bold border-r-2 border-secondary-container group scale-95 transition-transform duration-150 relative" href="#">
{/* Active indicator glow */}
<div className="absolute inset-0 bg-secondary-container/5 rounded-lg pointer-events-none"></div>
<span className="material-symbols-outlined text-[20px] text-secondary-container">settings</span>
<span className="text-label-sm font-label-sm text-secondary-container">Settings</span>
</a>
</div>
{/* Spacer */}
<div className="mt-auto pt-gap-md space-y-3 border-t border-outline-variant/30 mt-4">
<button className="w-full bg-primary-container text-on-primary-container hover:bg-primary-fixed transition-colors rounded-lg py-2 px-4 flex items-center justify-center gap-xs font-label-sm text-label-sm shadow-[0_0_10px_rgba(0,245,255,0.1)]">
<span className="material-symbols-outlined text-[18px]">add</span>
                New Workspace
            </button>
<div className="space-y-1">
<a className="flex items-center gap-md px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200 group" href="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">help</span>
<span className="text-label-sm font-label-sm">Help</span>
</a>
<a className="flex items-center gap-md px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200 group" href="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">account_circle</span>
<span className="text-label-sm font-label-sm">User Profile</span>
</a>
</div>
</div>
</nav>
{/* Main Content Canvas */}
<main className="flex-1 flex flex-col h-full bg-obsidian-base relative overflow-hidden">
{/* Ambient Background Glow */}
<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[100px] pointer-events-none"></div>
<div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-container/5 rounded-full blur-[120px] pointer-events-none"></div>
{/* TopNavBar (Shared Component) - Mobile Only */}
<header className="md:hidden flex justify-between items-center w-full px-margin-mobile h-16 sticky top-0 z-40 bg-obsidian-surface/80 dark:bg-obsidian-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant">
<div className="flex items-center gap-xs">
<span className="text-headline-md font-headline-md font-black text-primary text-xl">The Knower OS</span>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">menu</span>
</button>
</header>
{/* Page Header */}
<div className="px-margin-desktop py-gap-md pt-8 shrink-0 flex items-end justify-between border-b border-outline-variant/20 relative z-10">
<div>
<nav className="flex items-center gap-2 text-label-xs font-label-xs text-on-surface-variant mb-2">
<a className="hover:text-primary transition-colors" href="#">Settings</a>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-primary-container">Roles &amp; Permissions</span>
</nav>
<h2 className="text-display-lg font-display-lg text-primary tracking-tight">Access Control</h2>
<p className="text-body-md font-body-md text-on-surface-variant mt-2 max-w-2xl">Manage organizational roles and detailed system permissions. Changes propagate to active sessions immediately.</p>
</div>
<div className="flex items-center gap-3">
<button className="px-4 py-2 rounded-lg border border-primary-container text-primary-container font-label-sm text-label-sm hover:bg-primary-container/10 transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">history</span>
                    Audit Log
                </button>
<button className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-label-sm text-label-sm hover:bg-primary-fixed transition-colors shadow-[0_0_15px_rgba(0,245,255,0.15)] flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">save</span>
                    Save Changes
                </button>
</div>
</div>
{/* Content Area: Bento Layout */}
<div className="flex-1 overflow-hidden p-margin-desktop flex gap-gap-md relative z-10">
{/* Roles Sidebar (Glassmorphic Panel) */}
<aside className="w-72 shrink-0 flex flex-col bg-obsidian-surface/60 backdrop-blur-md border border-outline-variant/30 rounded-xl overflow-hidden shadow-lg relative">
{/* Inner glow top edge */}
<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
<div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-obsidian-elevated/50">
<h3 className="font-title-sm text-title-sm text-primary">System Roles</h3>
<button className="text-primary-container hover:text-primary-fixed transition-colors p-1 rounded hover:bg-primary-container/10">
<span className="material-symbols-outlined text-[20px]">add_circle</span>
</button>
</div>
<div className="p-2 space-y-1 overflow-y-auto custom-scrollbar flex-1">
{/* Search Roles */}
<div className="relative mb-3 px-2">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
<input className="w-full bg-obsidian-base border border-outline-variant/50 rounded-md py-1.5 pl-9 pr-3 text-sm text-primary focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-outline/50" placeholder="Filter roles..." type="text"/>
</div>
{/* Role Items */}
<button className="w-full flex flex-col items-start p-3 rounded-lg bg-primary-container/10 border border-primary-container/30 text-left relative group">
<div className="flex items-center justify-between w-full">
<span className="font-label-sm text-label-sm text-primary-container font-semibold">Super Administrator</span>
<span className="material-symbols-outlined text-[16px] text-primary-container">shield_person</span>
</div>
<span className="text-label-xs font-label-xs text-on-surface-variant mt-1">Full system access</span>
<span className="mt-2 text-[10px] uppercase tracking-wider text-outline px-2 py-0.5 rounded bg-obsidian-base border border-outline-variant/50">3 Users</span>
</button>
<button className="w-full flex flex-col items-start p-3 rounded-lg hover:bg-obsidian-elevated border border-transparent hover:border-outline-variant/30 text-left transition-colors group">
<div className="flex items-center justify-between w-full">
<span className="font-label-sm text-label-sm text-primary group-hover:text-primary-container transition-colors">Project Manager</span>
</div>
<span className="text-label-xs font-label-xs text-on-surface-variant mt-1">Scope: All Projects</span>
<span className="mt-2 text-[10px] uppercase tracking-wider text-outline px-2 py-0.5 rounded bg-obsidian-base border border-outline-variant/50 group-hover:border-outline-variant transition-colors">12 Users</span>
</button>
<button className="w-full flex flex-col items-start p-3 rounded-lg hover:bg-obsidian-elevated border border-transparent hover:border-outline-variant/30 text-left transition-colors group">
<div className="flex items-center justify-between w-full">
<span className="font-label-sm text-label-sm text-primary group-hover:text-primary-container transition-colors">Data Engineer</span>
</div>
<span className="text-label-xs font-label-xs text-on-surface-variant mt-1">Scope: Analytics &amp; Pipelines</span>
<span className="mt-2 text-[10px] uppercase tracking-wider text-outline px-2 py-0.5 rounded bg-obsidian-base border border-outline-variant/50 group-hover:border-outline-variant transition-colors">8 Users</span>
</button>
<button className="w-full flex flex-col items-start p-3 rounded-lg hover:bg-obsidian-elevated border border-transparent hover:border-outline-variant/30 text-left transition-colors group">
<div className="flex items-center justify-between w-full">
<span className="font-label-sm text-label-sm text-primary group-hover:text-primary-container transition-colors">Read-Only Viewer</span>
</div>
<span className="text-label-xs font-label-xs text-on-surface-variant mt-1">Scope: Global Reports</span>
<span className="mt-2 text-[10px] uppercase tracking-wider text-outline px-2 py-0.5 rounded bg-obsidian-base border border-outline-variant/50 group-hover:border-outline-variant transition-colors">45 Users</span>
</button>
<button className="w-full flex flex-col items-start p-3 rounded-lg hover:bg-obsidian-elevated border border-transparent hover:border-outline-variant/30 text-left transition-colors group">
<div className="flex items-center justify-between w-full">
<span className="font-label-sm text-label-sm text-primary group-hover:text-primary-container transition-colors">Finance Auditor</span>
</div>
<span className="text-label-xs font-label-xs text-on-surface-variant mt-1">Scope: Billing &amp; Invoices</span>
<span className="mt-2 text-[10px] uppercase tracking-wider text-outline px-2 py-0.5 rounded bg-obsidian-base border border-outline-variant/50 group-hover:border-outline-variant transition-colors">2 Users</span>
</button>
</div>
</aside>
{/* Main Permission Matrix (Data Table) */}
<div className="flex-1 flex flex-col bg-obsidian-surface/60 backdrop-blur-md border border-outline-variant/30 rounded-xl overflow-hidden shadow-lg relative">
{/* Inner glow top edge */}
<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-20"></div>
{/* Matrix Toolbar */}
<div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-obsidian-elevated/80 backdrop-blur-md z-10 shrink-0">
<div className="flex items-center gap-4">
<h3 className="font-title-sm text-title-sm text-primary">Permission Matrix</h3>
<div className="h-4 w-px bg-outline-variant"></div>
<div className="flex gap-2">
<button className="text-label-xs font-label-xs px-3 py-1 rounded bg-obsidian-base border border-primary-container/50 text-primary-container hover:bg-primary-container/10 transition-colors">All Modules</button>
<button className="text-label-xs font-label-xs px-3 py-1 rounded bg-obsidian-base border border-outline-variant text-on-surface-variant hover:text-primary hover:border-outline transition-colors">Finance</button>
<button className="text-label-xs font-label-xs px-3 py-1 rounded bg-obsidian-base border border-outline-variant text-on-surface-variant hover:text-primary hover:border-outline transition-colors">Projects</button>
</div>
</div>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
<input className="w-64 bg-obsidian-base border border-outline-variant/50 rounded-lg py-1.5 pl-9 pr-3 text-sm text-primary focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-outline/50" placeholder="Search permissions..." type="text"/>
</div>
</div>
{/* Table Container */}
<div className="flex-1 overflow-auto custom-scrollbar relative">
<table className="w-full text-left border-collapse">
<thead className="sticky top-0 z-10 bg-obsidian-surface/90 backdrop-blur-md border-b border-outline-variant shadow-sm shadow-obsidian-base/50">
<tr>
<th className="p-4 font-label-sm text-label-sm text-primary font-semibold min-w-[250px]">Permission Name</th>
<th className="p-4 font-label-sm text-label-sm text-primary font-semibold text-center w-32 border-l border-outline-variant/20">Admin</th>
<th className="p-4 font-label-sm text-label-sm text-primary font-semibold text-center w-32 border-l border-outline-variant/20">Manager</th>
<th className="p-4 font-label-sm text-label-sm text-primary font-semibold text-center w-32 border-l border-outline-variant/20">Engineer</th>
<th className="p-4 font-label-sm text-label-sm text-primary font-semibold text-center w-32 border-l border-outline-variant/20">Viewer</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/30 text-body-md font-body-md">
{/* Category Row */}
<tr className="bg-obsidian-elevated/30">
<td className="p-2 px-4 font-label-sm text-label-sm text-primary-container uppercase tracking-widest text-[10px] flex items-center gap-2" colspan="5">
<span className="material-symbols-outlined text-[14px]">folder_open</span>
                                    Project Management
                                </td>
</tr>
{/* Permission Row 1 */}
<tr className="hover:bg-obsidian-elevated/50 transition-colors group">
<td className="p-4">
<div className="flex flex-col">
<span className="text-primary font-medium">Create Projects</span>
<span className="text-label-xs text-on-surface-variant/70 font-code-sm">projects:create</span>
</div>
</td>
{/* Admin Cell */}
<td className="p-4 text-center border-l border-outline-variant/10">
<div className="flex justify-center items-center h-full">
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-obsidian-base border-2 border-primary-container appearance-none cursor-pointer z-10 transition-all duration-300 right-0" id="admin_p1" name="toggle" type="checkbox"/>
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-primary-container/80 cursor-pointer shadow-inner transition-colors duration-300" htmlFor="admin_p1"></label>
</div>
</div>
</td>
{/* Manager Cell */}
<td className="p-4 text-center border-l border-outline-variant/10">
<div className="flex justify-center items-center h-full">
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-obsidian-base border-2 border-primary-container appearance-none cursor-pointer z-10 transition-all duration-300 right-0" id="mgr_p1" name="toggle" type="checkbox"/>
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-primary-container/80 cursor-pointer shadow-inner transition-colors duration-300" htmlFor="mgr_p1"></label>
</div>
</div>
</td>
{/* Engineer Cell */}
<td className="p-4 text-center border-l border-outline-variant/10">
<div className="flex justify-center items-center h-full opacity-50">
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-outline-variant border-2 border-outline appearance-none cursor-not-allowed z-10 transition-all duration-300 left-0" disabled id="eng_p1" name="toggle" type="checkbox"/>
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-obsidian-base cursor-not-allowed shadow-inner transition-colors duration-300 border border-outline-variant" htmlFor="eng_p1"></label>
</div>
<span className="material-symbols-outlined text-[14px] text-outline ml-1" title="Disabled by higher policy">lock</span>
</div>
</td>
{/* Viewer Cell */}
<td className="p-4 text-center border-l border-outline-variant/10">
<div className="flex justify-center items-center h-full">
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-outline-variant border-2 border-outline appearance-none cursor-pointer z-10 transition-all duration-300 left-0" id="vw_p1" name="toggle" type="checkbox"/>
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-obsidian-base cursor-pointer shadow-inner transition-colors duration-300 border border-outline-variant" htmlFor="vw_p1"></label>
</div>
</div>
</td>
</tr>
{/* Permission Row 2 */}
<tr className="hover:bg-obsidian-elevated/50 transition-colors group">
<td className="p-4">
<div className="flex flex-col">
<span className="text-primary font-medium">View Projects</span>
<span className="text-label-xs text-on-surface-variant/70 font-code-sm">projects:read</span>
</div>
</td>
{/* Admin Cell (Implicitly checked and locked)*/}
<td className="p-4 text-center border-l border-outline-variant/10">
<div className="flex justify-center items-center h-full">
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in opacity-50">
<input defaultChecked className="absolute block w-5 h-5 rounded-full bg-obsidian-base border-2 border-primary-container right-0 z-10 cursor-not-allowed" disabled type="checkbox"/>
<label className="block overflow-hidden h-5 rounded-full bg-primary-container cursor-not-allowed"></label>
</div>
</div>
</td>
{/* Manager Cell */}
<td className="p-4 text-center border-l border-outline-variant/10">
<div className="flex justify-center items-center h-full">
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in opacity-50">
<input defaultChecked className="absolute block w-5 h-5 rounded-full bg-obsidian-base border-2 border-primary-container right-0 z-10 cursor-not-allowed" disabled type="checkbox"/>
<label className="block overflow-hidden h-5 rounded-full bg-primary-container cursor-not-allowed"></label>
</div>
</div>
</td>
{/* Engineer Cell */}
<td className="p-4 text-center border-l border-outline-variant/10">
<div className="flex justify-center items-center h-full">
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-obsidian-base border-2 border-primary-container appearance-none cursor-pointer z-10 transition-all duration-300 right-0" id="eng_p2" type="checkbox"/>
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-primary-container/80 cursor-pointer shadow-inner transition-colors duration-300" htmlFor="eng_p2"></label>
</div>
</div>
</td>
{/* Viewer Cell */}
<td className="p-4 text-center border-l border-outline-variant/10">
<div className="flex justify-center items-center h-full">
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-obsidian-base border-2 border-primary-container appearance-none cursor-pointer z-10 transition-all duration-300 right-0" id="vw_p2" type="checkbox"/>
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-primary-container/80 cursor-pointer shadow-inner transition-colors duration-300" htmlFor="vw_p2"></label>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</main>
<script>
        // Simple script to handle generic toggle interactions for visual feedback without forms
        document.querySelectorAll('.toggle-checkbox').forEach(toggle => {
            toggle.addEventListener('change', function() {
                // In a real app, this would dispatch an event to update the state
                if(!this.disabled) {
                    const row = this.closest('tr');
                    // Add subtle pulse effect to row when changed
                    row.classList.add('bg-primary-container/5');
                    setTimeout(() => row.classList.remove('bg-primary-container/5'), 300);
                }
            });
        });
    </script>

                {/* Body Content Ends */}
            </div>
        </>
    );
}
