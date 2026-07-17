
import React from 'react';
import { Head } from '@inertiajs/react';

export default function Workspaces() {
    return (
        <>
            <Head title="Workspace Management" />
            <div className="flex h-screen overflow-hidden bg-obsidian-base font-body-md text-body-md text-on-background">
                {/* Body Content Starts */}
                
{/* SideNavBar (Shared Component) */}
<nav className="hidden md:flex flex-col h-screen left-0 w-64 bg-obsidian-base border-r border-outline-variant py-6 px-4 z-50 sticky top-0">
{/* Header */}
<div className="mb-8 px-2 flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-obsidian-elevated flex items-center justify-center border border-outline-variant">
<img alt="Organization Workspace Logo" className="w-6 h-6 object-contain" data-alt="A sleek, minimalist geometric logo representing an organization workspace. The logo uses a palette of cyan and deep obsidian. The design is abstract, suggesting connectivity and enterprise software. It sits perfectly centered in a dark UI element." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHP6Jdla_wI4uyX84XAaWLDqMgdH0Ic7OdCsbxCnzXNMRrK5yrrA_ongKx8iUXk8yFYo19rL-0wj3MSCYkjETqYfmxF6fopHTlamSnXlSwE7x3AD4K5XcI_4HE1qmrnOK7nr8KbnTeFQo9FoeI94pXC9y-nXKSNQjC2W219GR_3yEwvIfTIBWIfZIuOwuiRMhHIPLUIIlib-26uf-gz80b_IbjJ14D3PzGTado3FutR-WJeax3aVHvMA0MUVQYGC9EXg7MP2WDUkEM"/>
</div>
<div>
<h1 className="text-headline-md font-headline-md font-bold text-primary truncate">The Knower OS</h1>
<p className="text-label-sm font-label-sm text-on-surface-variant">Enterprise Suite</p>
</div>
</div>
{/* CTA */}
<button className="mb-8 w-full py-2 px-4 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined" style="font-size: 18px;">add</span>
            New Workspace
        </button>
{/* Main Navigation */}
<ul className="flex-1 space-y-1 overflow-y-auto">
<li>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200" href="#">
<span className="material-symbols-outlined">dashboard</span>
                    Dashboard
                </a>
</li>
<li>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200" href="#">
<span className="material-symbols-outlined">group</span>
                    CRM
                </a>
</li>
<li>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200" href="#">
<span className="material-symbols-outlined">tactic</span>
                    Projects
                </a>
</li>
<li>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200" href="#">
<span className="material-symbols-outlined">payments</span>
                    Finance
                </a>
</li>
<li>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200" href="#">
<span className="material-symbols-outlined">monitoring</span>
                    Analytics
                </a>
</li>
{/* Active State */}
<li>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-obsidian-elevated text-secondary-container font-label-md text-label-md border-r-2 border-secondary-container scale-95 transition-transform duration-150" href="#">
<span className="material-symbols-outlined">settings</span>
                    Settings
                </a>
</li>
</ul>
{/* Footer Navigation */}
<ul className="mt-auto space-y-1 pt-4 border-t border-outline-variant">
<li>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200" href="#">
<span className="material-symbols-outlined">help</span>
                    Help
                </a>
</li>
<li>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-obsidian-elevated hover:text-primary transition-colors duration-200" href="#">
<span className="material-symbols-outlined">account_circle</span>
                    User Profile
                </a>
</li>
</ul>
</nav>
{/* Main Content Canvas */}
<main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
{/* TopNavBar (Shared Component) - Mobile Only */}
<header className="md:hidden flex justify-between items-center w-full px-margin-mobile h-16 sticky top-0 z-40 bg-obsidian-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary" style="font-size: 24px;">menu</span>
<span className="text-headline-md font-headline-md font-black text-primary">The Knower OS</span>
</div>
<div className="flex items-center gap-4">
<div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
<img alt="User Avatar" className="w-full h-full object-cover" data-alt="A small, circular avatar image of a professional user. The person has a neutral expression, wearing modern business casual attire against a clean, minimal dark gray background. Lighting is soft and even." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo-SbIe1fNkGxuZkmGJfjNZHY1XwpQkO918SCQPMzDm7vFsnKEBMOEiiOePwybVMRIr0k0ASTAXvhSFVerjAMxCx7YY8OD8j3j8CXCdwX3x9xR9UUZLG8ITtVVn1RantQ-zhGPnvonqtk24n12vj2MmzJ6Ocd-OqTOHP6yONr5l2TPZtSdEB5yKH27dnr_AfRnkfdP14OD9h04QfZPoMm3InvsSxQCoTcX_Sggpg8afI0jt2rd3O9hberrQqgOH__D9xmNqmH4z7Eb"/>
</div>
</div>
</header>
{/* Scrollable Canvas */}
<div className="flex-1 overflow-y-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
{/* Page Header */}
<div className="max-w-container-max mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<h2 className="text-display-lg font-display-lg text-primary mb-2">Workspace Settings</h2>
<p className="text-body-lg font-body-lg text-on-surface-variant">Manage your organization's identity, team members, and permissions.</p>
</div>
<div className="flex items-center gap-3">
<button className="px-4 py-2 rounded-lg border border-outline-variant bg-transparent text-primary font-label-md text-label-md hover:bg-obsidian-elevated transition-colors flex items-center gap-2">
<span className="material-symbols-outlined" style="font-size: 18px;">download</span>
                        Export Data
                    </button>
<button className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary-fixed transition-colors flex items-center gap-2">
<span className="material-symbols-outlined" style="font-size: 18px;">person_add</span>
                        Invite Member
                    </button>
</div>
</div>
<div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{/* Left Column: Branding & Config (4 cols) */}
<div className="lg:col-span-4 space-y-6">
{/* Workspace Branding Card */}
<div className="glass-panel rounded-xl p-6">
<div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant">
<h3 className="text-headline-md font-headline-md text-primary">Identity</h3>
<span className="material-symbols-outlined text-on-surface-variant">palette</span>
</div>
<div className="flex items-start gap-4 mb-8">
<div className="w-20 h-20 rounded-xl bg-obsidian-base border border-outline-variant flex items-center justify-center relative group cursor-pointer">
<img alt="Workspace Logo" className="w-12 h-12 object-contain" data-alt="A large, square workspace logo placeholder. It features a bold, abstract geometric shape in cyan and slate, sitting precisely in the center of a very dark obsidian background. The design feels like modern enterprise tech." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkYSzLmdZglG6C3FtYXoja71HpJPASaN7W7ZU72u34OfnQjHvksLV9R6oHt7br7bSuyAwOAYhlT-0eTmAM8Xb-d0h9NIUONMjI-QBXYKvrpqvuijDOaPCFUFh-HdwFv0ur0Cb_T87g-hqjPsgjnHfPXuoeolWJyk73CKnRNSh0R_EYcCN83yOg0DBKikBU_dsn6MW4hYU9I1Nl_vVeL3TJwP-mLaR1KRNyBZPdRjPPcvZkexET_RVCM04MYA_WqwFUihcuJbMs0gT1"/>
<div className="absolute inset-0 bg-obsidian-elevated/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
<span className="material-symbols-outlined text-primary">edit</span>
</div>
</div>
<div className="flex-1">
<label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">WORKSPACE NAME</label>
<input className="w-full bg-obsidian-base border border-outline-variant rounded-lg px-3 py-2 text-body-md font-body-md text-primary focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none transition-all" type="text" value="Acme Corporation"/>
</div>
</div>
<div className="space-y-4">
<div>
<label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">PRIMARY COLOR</label>
<div className="flex gap-3">
<button className="w-8 h-8 rounded-full bg-[#00F5FF] ring-2 ring-offset-2 ring-offset-obsidian-surface ring-primary-container"></button>
<button className="w-8 h-8 rounded-full bg-[#A855F7] border border-outline-variant hover:scale-110 transition-transform"></button>
<button className="w-8 h-8 rounded-full bg-[#10B981] border border-outline-variant hover:scale-110 transition-transform"></button>
<button className="w-8 h-8 rounded-full bg-[#F59E0B] border border-outline-variant hover:scale-110 transition-transform"></button>
<button className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant bg-obsidian-base hover:bg-obsidian-elevated transition-colors">
<span className="material-symbols-outlined text-on-surface-variant" style="font-size: 16px;">add</span>
</button>
</div>
</div>
</div>
</div>
{/* Usage Stats Mini-Bento */}
<div className="grid grid-cols-2 gap-4">
<div className="glass-panel rounded-xl p-4">
<p className="text-label-sm font-label-sm text-on-surface-variant mb-1">SEATS USED</p>
<p className="text-headline-md font-headline-md text-primary">12 <span className="text-body-sm font-body-sm text-on-surface-variant">/ 20</span></p>
<div className="w-full bg-obsidian-base h-1.5 rounded-full mt-3 overflow-hidden">
<div className="bg-primary-container h-full rounded-full" style="width: 60%"></div>
</div>
</div>
<div className="glass-panel rounded-xl p-4">
<p className="text-label-sm font-label-sm text-on-surface-variant mb-1">API CALLS</p>
<p className="text-headline-md font-headline-md text-primary">8.4k</p>
<div className="flex items-center gap-1 mt-2 text-success-emerald">
<span className="material-symbols-outlined" style="font-size: 14px;">trending_up</span>
<span className="text-label-sm font-label-sm">12% this week</span>
</div>
</div>
</div>
</div>
{/* Right Column: Team Directory (8 cols) */}
<div className="lg:col-span-8 glass-panel rounded-xl flex flex-col h-[700px]">
{/* Table Toolbar */}
<div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div className="flex items-center gap-4">
<h3 className="text-headline-md font-headline-md text-primary">Directory</h3>
<span className="px-2 py-0.5 rounded-full bg-obsidian-base border border-outline-variant text-label-sm font-label-sm text-on-surface-variant">12 Members</span>
</div>
<div className="flex items-center gap-3">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style="font-size: 18px;">search</span>
<input className="w-full sm:w-64 pl-10 pr-4 py-2 bg-obsidian-base border border-outline-variant rounded-lg text-body-sm font-body-sm text-primary focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none transition-all placeholder:text-on-surface-variant/50" placeholder="Search members..." type="text"/>
</div>
<button className="p-2 rounded-lg border border-outline-variant bg-obsidian-base text-on-surface-variant hover:bg-obsidian-elevated hover:text-primary transition-colors">
<span className="material-symbols-outlined" style="font-size: 20px;">filter_list</span>
</button>
</div>
</div>
{/* Table Data Container */}
<div className="flex-1 overflow-auto">
<table className="w-full text-left border-collapse">
<thead className="sticky top-0 bg-obsidian-surface/95 backdrop-blur z-10 border-b border-outline-variant">
<tr>
<th className="py-3 px-4 w-12">
<input className="rounded bg-obsidian-base border-outline-variant text-primary-container focus:ring-primary-container focus:ring-offset-obsidian-surface" type="checkbox"/>
</th>
<th className="py-3 px-4 text-label-sm font-label-sm text-on-surface-variant font-medium">MEMBER</th>
<th className="py-3 px-4 text-label-sm font-label-sm text-on-surface-variant font-medium">ROLE</th>
<th className="py-3 px-4 text-label-sm font-label-sm text-on-surface-variant font-medium">STATUS</th>
<th className="py-3 px-4 text-label-sm font-label-sm text-on-surface-variant font-medium">LAST ACTIVE</th>
<th className="py-3 px-4 w-12"></th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/50">
{/* Row 1 */}
<tr className="table-row-hover transition-colors group cursor-pointer">
<td className="py-3 px-4">
<input className="rounded bg-obsidian-base border-outline-variant text-primary-container focus:ring-primary-container focus:ring-offset-obsidian-surface" type="checkbox"/>
</td>
<td className="py-3 px-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-obsidian-elevated border border-outline-variant flex items-center justify-center overflow-hidden">
<img alt="Sarah Chen" className="w-full h-full object-cover" data-alt="A tiny profile picture of an Asian woman with short black hair, wearing glasses and a minimalist white collared shirt, against a dark grey background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_PS0t-z2FUQJD5acrWUKU8oKmgQGVvZDbTvVe_A_05F0xH3cQqwwgGP2pYEhSr1L-EEFNNX24lBMVbx0MNr685Fx83xW9o2xSJk4Xevcbd2WSq1WxgA_UIkbgqTRJNUF8z_-cbtzcNc4S2DdcbsdY0VioTRqF1UM300dym7Oml7EHFF7dZkN5b_1I-E5TUo13gnCMzIPLTi3MAjS4UWiZaNjOTXgwdrPZGhQXaxny9_2yjxAmUTqilQDzL_-A7boA61G3tsARNKxU"/>
</div>
<div>
<p className="text-body-sm font-body-sm text-primary font-medium">Sarah Chen</p>
<p className="text-label-sm font-label-sm text-on-surface-variant">sarah@acme.co</p>
</div>
</div>
</td>
<td className="py-3 px-4">
<span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm font-label-sm bg-obsidian-base border border-primary-container/30 text-primary-container">Owner</span>
</td>
<td className="py-3 px-4">
<div className="flex items-center gap-1.5">
<div className="w-1.5 h-1.5 rounded-full bg-success-emerald"></div>
<span className="text-body-sm font-body-sm text-on-surface-variant">Active</span>
</div>
</td>
<td className="py-3 px-4 text-body-sm font-body-sm text-on-surface-variant">Just now</td>
<td className="py-3 px-4 text-right">
<button className="p-1 rounded text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-obsidian-elevated transition-all">
<span className="material-symbols-outlined" style="font-size: 20px;">more_horiz</span>
</button>
</td>
</tr>
{/* Row 2 */}
<tr className="table-row-hover transition-colors group cursor-pointer">
<td className="py-3 px-4">
<input className="rounded bg-obsidian-base border-outline-variant text-primary-container focus:ring-primary-container focus:ring-offset-obsidian-surface" type="checkbox"/>
</td>
<td className="py-3 px-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-obsidian-elevated border border-outline-variant flex items-center justify-center overflow-hidden">
<img alt="Marcus Johnson" className="w-full h-full object-cover" data-alt="A small avatar showing a Caucasian man with a neatly trimmed beard, wearing a dark crewneck t-shirt. He has a serious expression. Dark minimalist background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0LyZ6_Nln7jvxGO94w-9WdNV9Bqfw_r46qZxNAKWdF4kA97cDhP1_IHon20EElaIkEzKWvZoLQS3vx1TBPRPpKGwxNjDELCsmdXaruCEK87Zwam60tksHmJj2Z7L_OQEel9Pwf1FLkJVwoxNRL1__a274G93msNXBb17dRIn7h9YVDwLDNZjtv_Vc32gxSo6Y4vKL5XBKiVRDKljpmBzARLmlrQX-QFCAybPNFaWaUmuck0sKcvAqFBq1BLMlZCwKRDsJEmQcOFbP"/>
</div>
<div>
<p className="text-body-sm font-body-sm text-primary font-medium">Marcus Johnson</p>
<p className="text-label-sm font-label-sm text-on-surface-variant">mjohnson@acme.co</p>
</div>
</div>
</td>
<td className="py-3 px-4">
<span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm font-label-sm bg-obsidian-base border border-outline-variant text-on-surface-variant">Admin</span>
</td>
<td className="py-3 px-4">
<div className="flex items-center gap-1.5">
<div className="w-1.5 h-1.5 rounded-full bg-success-emerald"></div>
<span className="text-body-sm font-body-sm text-on-surface-variant">Active</span>
</div>
</td>
<td className="py-3 px-4 text-body-sm font-body-sm text-on-surface-variant">2 hours ago</td>
<td className="py-3 px-4 text-right">
<button className="p-1 rounded text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-obsidian-elevated transition-all">
<span className="material-symbols-outlined" style="font-size: 20px;">more_horiz</span>
</button>
</td>
</tr>
{/* Row 3 */}
<tr className="table-row-hover transition-colors group cursor-pointer">
<td className="py-3 px-4">
<input className="rounded bg-obsidian-base border-outline-variant text-primary-container focus:ring-primary-container focus:ring-offset-obsidian-surface" type="checkbox"/>
</td>
<td className="py-3 px-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-obsidian-base border border-outline-variant flex items-center justify-center text-label-sm font-label-sm text-primary">
                                                EL
                                            </div>
<div>
<p className="text-body-sm font-body-sm text-primary font-medium">Elena Lopez</p>
<p className="text-label-sm font-label-sm text-on-surface-variant">elena.l@acme.co</p>
</div>
</div>
</td>
<td className="py-3 px-4">
<span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm font-label-sm bg-obsidian-base border border-outline-variant text-on-surface-variant">Member</span>
</td>
<td className="py-3 px-4">
<div className="flex items-center gap-1.5">
<div className="w-1.5 h-1.5 rounded-full bg-warning-amber"></div>
<span className="text-body-sm font-body-sm text-on-surface-variant">Away</span>
</div>
</td>
<td className="py-3 px-4 text-body-sm font-body-sm text-on-surface-variant">Yesterday</td>
<td className="py-3 px-4 text-right">
<button className="p-1 rounded text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-obsidian-elevated transition-all">
<span className="material-symbols-outlined" style="font-size: 20px;">more_horiz</span>
</button>
</td>
</tr>
{/* Row 4 (Invited) */}
<tr className="table-row-hover transition-colors group cursor-pointer opacity-70">
<td className="py-3 px-4">
<input className="rounded bg-obsidian-base border-outline-variant text-primary-container focus:ring-primary-container focus:ring-offset-obsidian-surface" type="checkbox"/>
</td>
<td className="py-3 px-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-obsidian-base border border-outline-variant border-dashed flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant" style="font-size: 16px;">mail</span>
</div>
<div>
<p className="text-body-sm font-body-sm text-primary font-medium italic">Invited User</p>
<p className="text-label-sm font-label-sm text-on-surface-variant">david.w@acme.co</p>
</div>
</div>
</td>
<td className="py-3 px-4">
<span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm font-label-sm bg-obsidian-base border border-outline-variant text-on-surface-variant">Member</span>
</td>
<td className="py-3 px-4">
<div className="flex items-center gap-1.5">
<div className="w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
<span className="text-body-sm font-body-sm text-on-surface-variant">Pending</span>
</div>
</td>
<td className="py-3 px-4 text-body-sm font-body-sm text-on-surface-variant">-</td>
<td className="py-3 px-4 text-right">
<button className="p-1 rounded text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-obsidian-elevated transition-all">
<span className="material-symbols-outlined" style="font-size: 20px;">more_horiz</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
{/* Table Pagination/Footer */}
<div className="p-4 border-t border-outline-variant flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant bg-obsidian-surface/50 rounded-b-xl">
<div>Showing 1 to 4 of 12 entries</div>
<div className="flex items-center gap-2">
<button className="p-1 rounded hover:bg-obsidian-elevated hover:text-primary transition-colors disabled:opacity-50" disabled>
<span className="material-symbols-outlined" style="font-size: 20px;">chevron_left</span>
</button>
<button className="p-1 rounded hover:bg-obsidian-elevated hover:text-primary transition-colors">
<span className="material-symbols-outlined" style="font-size: 20px;">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</div>
{/* Footer (Shared Component) */}
<footer className="flex justify-between items-center w-full px-margin-desktop py-2 h-8 bg-obsidian-base border-t border-outline-variant z-40 mt-auto">
<div className="text-label-sm font-label-sm text-on-surface-variant">
                The Knower OS v2.4.0 • System Status: <span className="text-success-emerald">Operational</span>
</div>
<div className="flex gap-4">
<a className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>
<a className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">API Docs</a>
<a className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Server Health</a>
</div>
</footer>
</main>

                {/* Body Content Ends */}
            </div>
        </>
    );
}
