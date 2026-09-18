# The Knower System — Complete Project Documentation & Continuation Roadmap

> **Last Updated:** 2026-07-25  
> **Stack:** Laravel 13 + React 19 + TypeScript + Inertia.js 3 + Tailwind CSS 4 + Vite 8  
> **Auth:** Laravel Sanctum 4 + Google2FA  
> **Permissions:** Spatie laravel-permission + custom RBAC layer  
> **Activity Logging:** Spatie laravel-activitylog  
> **Real-time:** Laravel Reverb (WebSockets)  
> **State:** Zustand + TanStack React Query  
> **Charts:** Recharts  
> **Calendar:** FullCalendar  
> **Animations:** GSAP  
> **i18n:** i18next (English + Arabic)  
> **UI Library:** Radix UI primitives (46 components via shadcn/ui pattern)

---

## Part 1 — What's Done (Verified Against Codebase)

### 1.1 Architecture

```
app/
├── Modules/           ← Domain-Driven modular backend
│   ├── AI/            (Controllers, Models[empty], Services[empty])
│   ├── Auth/          (Controllers[11], Models[User])
│   ├── CMS/           (Controllers[7], Models[6], Migrations, Requests, Routes, Services)
│   ├── CRM/           (Controllers[4], Models[4], Services[4], Requests[8], + Events/Jobs/Listeners/Policies/Repos/Routes/Views)
│   ├── Core/          (Controllers[7], Models[ErrorLog], Services[ErrorLoggingService])
│   ├── Finance/       (Controllers[3], Models[3], Services[3], + full module structure)
│   ├── Hosting/       (Controllers[4], Models[4], Services[4], + full module structure)
│   ├── HR/            (Controllers[6], Models[6], Services[6], Requests[12], + full module structure)
│   ├── Notifications/ (Controllers[1], Models)
│   ├── Projects/      (Controllers[8], Models[8], Services[6], + full module structure)
│   ├── Reports/       (Controllers[1], Models)
│   ├── Settings/      (Controllers[1], + full module structure)
│   └── Support/       (Controllers[4], Models[4], Services[3], + Http layer)
├── Http/
│   ├── Middleware/
│   │   ├── CheckPermission.php      ← Route-level permission gating
│   │   └── HandleInertiaRequests.php ← Shares auth.user + merged permissions to frontend
├── Providers/
│   └── AppServiceProvider.php
```

```
resources/js/
├── Pages/             ← 47 Inertia page components
│   ├── Admin/Errors/  (Show.tsx)
│   ├── Dashboards/    (CEODashboard, ClientDashboard, DeveloperDashboard, HRDashboard)
│   ├── Support/       (Automation, Contacts, Conversations, Dashboard, Inbox, LiveChat, Queue, Widget)
│   └── [44 root-level pages]
├── components/
│   ├── ui/            ← 46 Radix-based primitives (alert-dialog, dialog, sidebar, table, etc.)
│   ├── support/       (ActionRail, Badges, ContextPanel, ConversationList, ConversationThread)
│   ├── animations/    (PageTransition, StaggerList)
│   ├── public/        (ChatWidget, blocks, footer, header) ← Landing page
│   └── [13 shared components: app-sidebar, data-table, quick-form, resource-page, stat-card, etc.]
├── Layouts/           (AppLayout.tsx)
├── hooks/             (use-mobile.tsx)
├── lib/               (permissions.ts, utils.ts, format.ts, error-capture.ts, error-page.ts)
├── i18n/              (en.json, ar.json, index.ts)
├── store/             (auth.ts, i18n.ts)
├── app.tsx            ← Inertia app entry
├── public_app.tsx     ← Public/landing entry
└── styles.css
```

### 1.2 Routing

**Web Routes (`routes/web.php` — 152 lines):**

- `/` → Public landing page (`view('public')`)
- `/login`, `/forgot-password` → Auth pages
- All authenticated routes wrapped in `auth:sanctum` middleware
- Dynamic role-based dashboard: `/dashboard` renders different dashboards per `user.role` (HR → HRDashboard, CEO → CEODashboard, developer/designer/qa → DeveloperDashboard, client → ClientDashboard, default → Dashboard)
- Permission-gated route groups: `crm.view`, `project.view`, `task.view`, `bug.manage`, `finance.view`, `hosting.view`, `support.view`, `support.manage`, `hr.view`, `report.view`, `cms.manage`, `ai.use`, `settings.manage`
- Fallback route: ERP prefixes → 404, everything else → public landing

**API Routes (`routes/api.php` — 224 lines, prefixed `/api/v1`):**

- **Public (no auth):** Portfolio, pricing, testimonials, FAQs, blog, team, services, careers, support widget ingestion, active job postings, job application submission
- **Authenticated:** Full CRUD via `apiResource` for leads, clients, quotations, contracts, projects, milestones, tasks, bugs, meetings, time-logs, invoices, expenses, domains, hosting, servers, ssl, employees, departments, job-postings, job-applications, tickets, marketing-plans, testimonials, faqs, blog-posts, team-members, services-cms
- **Custom endpoints:** Client activity, project activity, task comments, project files, payments (index/store/destroy), ticket messages, attendance, leaves, notifications (index/unread/markAllRead/markAsRead/destroy)
- **Reports:** revenue, projects, clients, employees, finance
- **AI:** chat, generate-quotation, generate-tasks, project-summary, analyze-bug, summarize-ticket
- **Settings:** index, updateCompany, updateMail, updateSecurity
- **Security:** sessions, revokeSession, 2FA generate/enable/disable
- **Admin:** roles (apiResource), workspaces (apiResource + switch), permissions list, audit-logs, api-tokens

### 1.3 RBAC System (Fully Implemented)

**13 Roles:** super_admin, ceo, sales, project_manager, team_leader, developer, designer, qa, accountant, hr, support, support_manager, client

**37 Permissions:** dashboard.view, crm.view, lead.manage, client.manage, quotation.manage, contract.manage, project.view, project.manage, task.view, task.manage, task.update_status, bug.manage, file.upload, finance.view, invoice.manage, payment.manage, expense.manage, hosting.view, hosting.manage, domain.manage, server.manage, ssl.manage, hr.view, hr.manage, attendance.manage, leave.manage, payroll.manage, support.view, ticket.manage, ticket.reply, report.view, ai.use, settings.manage, user.manage, client_portal.view, code.review, design.upload, qa.test, cms.manage, support.inbox, support.tickets, support.canned, support.kb_read, support.manage

**Implementation:**

- Backend: `User::hasPermissionTo()` merges role defaults + custom user permissions. `super_admin` bypasses all checks.
- Backend: `CheckPermission` middleware enforces on routes
- Frontend: `HandleInertiaRequests` shares permissions array to Inertia (super_admin gets `['*']`)
- Frontend: `lib/permissions.ts` mirrors role→permission mapping for UI gating. `<Can>` component for conditional rendering.

### 1.4 Module Details — What Exists in Each

#### CRM Module

| Layer       | Files                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------- |
| Controllers | `ClientController`, `LeadController`, `QuotationController`, `ContractController`            |
| Models      | `Client`, `Lead`, `Quotation`, `Contract`                                                    |
| Services    | `ClientService`, `LeadService`, `QuotationService`, `ContractService`                        |
| Requests    | `Store/Update` for Client, Lead, Quotation, Contract (8 files)                               |
| DB Tables   | `leads`, `clients`, `quotations`, `contracts`, `meetings`                                    |
| Frontend    | `CrmClients.tsx`, `CrmLeads.tsx`, `CrmQuotations.tsx`, `CrmContracts.tsx`, `CrmMeetings.tsx` |

**Note:** `MeetingController` lives under Projects module but serves CRM meetings. Old `Company` and `Contact` modules were removed and merged into leads/clients.

#### HR Module

| Layer       | Files                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Controllers | `EmployeeController`, `AttendanceController`, `LeaveController`, `DepartmentController`, `JobPostingController`, `JobApplicationController` |
| Models      | `Employee`, `Attendance`, `Leave`, `Department`, `JobPosting`, `JobApplication`                                                             |
| Services    | `EmployeeService`, `AttendanceService`, `LeaveService`, `DepartmentService`, `JobPostingService`, `JobApplicationService`                   |
| Requests    | `Store/Update` for all 6 entities (12 files)                                                                                                |
| DB Tables   | `employees`, `attendance`, `leaves`, `departments`, `job_postings`, `job_applications`                                                      |
| Frontend    | `HrEmployees.tsx`, `HrAttendance.tsx`, `HrLeaves.tsx`, `HrDepartments.tsx`, `HrJobs.tsx`, `HrApplications.tsx`, `HrPayroll.tsx`             |

**Note:** Public job applications endpoint (`POST /api/v1/job-applications`) available without auth. Active jobs listing also public.

#### Projects & Tasks Module

| Layer       | Files                                                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Controllers | `ProjectController`, `TaskController`, `MilestoneController`, `BugController`, `FileController`, `TaskCommentController`, `MeetingController`, `TimeLogController` |
| Models      | `Project`, `Task`, `Milestone`, `Bug`, `File`, `TaskComment`, `Meeting`, `TimeLog`                                                                                 |
| Services    | `ProjectService`, `TaskService`, `MilestoneService`, `BugService`, `FileService`, `TaskCommentService`                                                             |
| DB Tables   | `projects`, `tasks`, `subtasks`, `milestones`, `bugs`, `files`, `task_comments`, `meetings`, `time_logs`, `team_assignments`                                       |
| Frontend    | `ProjectsIndex.tsx`, `Projects$Id.tsx`, `Tasks.tsx`, `Bugs.tsx`, `Time-Logs.tsx`                                                                                   |

#### Finance Module

| Layer       | Files                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------- |
| Controllers | `InvoiceController`, `PaymentController`, `ExpenseController`                             |
| Models      | `Invoice`, `Payment`, `Expense`                                                           |
| Services    | `InvoiceService`, `PaymentService`, `ExpenseService`                                      |
| DB Tables   | `invoices`, `invoice_items`, `payments`, `expenses`                                       |
| Frontend    | `FinanceInvoices.tsx`, `FinancePayments.tsx`, `FinanceExpenses.tsx`, `FinanceRevenue.tsx` |

#### Hosting Module

| Layer       | Files                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------- |
| Controllers | `ServerController`, `HostingAccountController`, `DomainController`, `SslCertificateController` |
| Models      | `Server`, `HostingAccount`, `Domain`, `SslCertificate`                                         |
| Services    | `ServerService`, `HostingAccountService`, `DomainService`, `SslCertificateService`             |
| DB Tables   | `servers`, `hosting_accounts`, `domains`, `ssl_certificates`                                   |
| Frontend    | `HostingServers.tsx`, `HostingAccounts.tsx`, `HostingDomains.tsx`, `HostingSsl.tsx`            |

#### Support Module

| Layer              | Files                                                                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Controllers        | `TicketController`, `TicketMessageController`, `ConversationController`, `IngestionController`                                                                                                                                                     |
| Models             | `Ticket`, `TicketMessage`, `Conversation`, `Message`                                                                                                                                                                                               |
| Services           | `TicketService`, `TicketMessageService`, `ConversationRoutingService`                                                                                                                                                                              |
| DB Tables          | `tickets`, `ticket_messages`, `conversations`, `messages`                                                                                                                                                                                          |
| Frontend           | `Support/Dashboard.tsx`, `Support/Queue.tsx`, `Support/Inbox.tsx`, `Support/LiveChat.tsx`, `Support/Conversations.tsx`, `Support/Contacts.tsx`, `Support/Automation.tsx`, `Support/Widget.tsx`, `SupportTicketsIndex.tsx`, `SupportTickets$Id.tsx` |
| Support Components | `ActionRail`, `Badges`, `ContextPanel`, `ConversationList`, `ConversationThread`                                                                                                                                                                   |

**Note:** `IngestionController` provides a unified public endpoint (`POST /api/v1/public/support/ingest`) for multi-channel message ingestion (website widget, email, API). Auto-creates guest users, auto-routes via `ConversationRoutingService`, sets SLA deadlines.

#### CMS Module

| Layer          | Files                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Controllers    | `BlogPostController`, `FaqController`, `ServiceController`, `TeamMemberController`, `TestimonialController`, `MarketingPlanController`, `PublicApiController` |
| Models         | `BlogPost`, `Faq`, `Service`, `TeamMember`, `Testimonial`, `MarketingPlan`                                                                                    |
| DB Tables      | `blog_posts`, `faqs`, `services`, `team_members`, `testimonials`, `marketing_plans`                                                                           |
| Frontend       | `CmsBlog.tsx`, `CmsFaqs.tsx`, `CmsPricing.tsx`, `CmsServices.tsx`, `CmsTeam.tsx`, `CmsTestimonials.tsx`                                                       |
| Public Landing | `public/ChatWidget.tsx`, `public/blocks.tsx`, `public/footer.tsx`, `public/header.tsx`                                                                        |

**Note:** `PublicApiController` exposes 8 public read-only endpoints for the landing page (portfolio, pricing, testimonials, faqs, blog, team, services, careers).

#### Core Module

| Layer       | Files                                                                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Controllers | `DashboardController`, `ErrorManagementController`, `RoleController`, `WorkspaceController`, `SecurityController`, `ApiTokenController`, `AuditLogController`              |
| Models      | `ErrorLog`                                                                                                                                                                 |
| Services    | `ErrorLoggingService`                                                                                                                                                      |
| Frontend    | `Dashboard.tsx`, `Dashboards/` (4 role-specific), `Admin/Errors/Show.tsx`, `Settings.tsx`, `Profile.tsx`, `Portal.tsx`, `Calendar.tsx`, `Notifications.tsx`, `Reports.tsx` |

**DashboardController** aggregates: total/new clients, active/completed/overdue projects, pending/overdue tasks, monthly revenue, unpaid invoices, open tickets, online employees, expiring domains/hosting, revenue chart (6 months), tasks by status.

#### AI Module

| Layer       | Files                        |
| ----------- | ---------------------------- |
| Controllers | `AiController` (6 endpoints) |
| Models      | (empty directory)            |
| Services    | (empty directory)            |
| Frontend    | `Ai.tsx`                     |

**Current state:** All 6 endpoints are placeholder/template implementations with `TODO: Integrate with OpenAI / Gemini API` comments. They return static/template data. Endpoints: `chat`, `generateQuotation`, `generateTasks`, `projectSummary` (functional — reads real project data), `analyzeBug` (static suggestions), `summarizeTicket` (functional — reads real ticket data).

#### Reports Module

| Layer       | Files                                                                            |
| ----------- | -------------------------------------------------------------------------------- |
| Controllers | `ReportController` (5 endpoints: revenue, projects, clients, employees, finance) |
| Frontend    | `Reports.tsx`                                                                    |

**Current state:** Backend is **fully functional** — aggregates real data from Invoice, Expense, Payment, Project, Client, Employee models. Revenue report includes monthly breakdown with profit calculation. Frontend `Reports.tsx` needs to be wired to consume these endpoints.

#### Auth Module

| Controllers | 11 files: AuthController, AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationNotificationController, EmailVerificationPromptController, NewPasswordController, PasswordController, PasswordResetLinkController, ProfileController, RegisteredUserController, VerifyEmailController |
| Models | `User` — custom RBAC with `hasPermissionTo()`, `getAllPermissions()`, `hasRole()`, `isOnline()` |

### 1.5 Database — 68 Migration Files

**Users & Auth:** users (name, email, phone, avatar, password, role, permissions, status, last_login_at, 2FA fields), personal_access_tokens, cache, jobs/job_batches/failed_jobs

**Activity:** activity_log (with event + batch_uuid columns)

**CRM:** leads, clients, quotations, contracts, meetings (with client_id)

**Projects:** projects (public fields, tech stack, team), milestones, tasks, subtasks, task_comments, bugs, files, time_logs, team_assignments

**Finance:** invoices (with paid_amount), invoice_items, payments, expenses

**Hosting:** servers, hosting_accounts, domains, ssl_certificates

**Support:** tickets, ticket_messages, conversations, messages

**HR:** employees (with extended details), attendance, leaves, departments, job_postings, job_applications

**CMS:** blog_posts, faqs, services, team_members, testimonials, marketing_plans

**Core:** error_logs, notifications

**Cross-cutting:** workspace_tenancy added to all major tables. Three alignment migration phases completed (Phase 1, 2, 3).

### 1.6 Seeders

- `DatabaseSeeder.php` — Main seeder
- `MarketingSeeder.php` — Seeds CMS/marketing content

### 1.7 Shared Frontend Infrastructure

| Component                   | Purpose                                             |
| --------------------------- | --------------------------------------------------- |
| `app-sidebar.tsx`           | Main navigation sidebar with permission-gated links |
| `app-header.tsx`            | Top header bar                                      |
| `data-table.tsx`            | Reusable data table component                       |
| `quick-form.tsx`            | Generic form builder                                |
| `resource-page.tsx`         | Standard CRUD page wrapper                          |
| `stat-card.tsx`             | Dashboard KPI card                                  |
| `status-badge.tsx`          | Color-coded status indicators                       |
| `confirm-delete-button.tsx` | AlertDialog-based delete confirmation               |
| `can.tsx`                   | Permission-gated rendering component                |
| `page-header.tsx`           | Page title + breadcrumb                             |
| `mode-toggle.tsx`           | Dark/light theme switcher                           |
| `theme-provider.tsx`        | Theme context provider                              |
| `i18n-bootstrap.tsx`        | i18n initialization                                 |

### 1.8 Global Features Completed

- ✅ Role-Based Access Control (13 roles, 37+ permissions, backend + frontend sync)
- ✅ Enterprise Error Management (`error_logs` table, `ErrorManagementController` with dashboard/analytics/developerCenter/show)
- ✅ Custom AlertDialog replacing all `confirm()` calls
- ✅ "Description" → "Details" terminology standardized
- ✅ Workspace tenancy columns on all tables
- ✅ 2FA via Google2FA
- ✅ Activity logging via Spatie
- ✅ i18n (English + Arabic)
- ✅ Dark/light mode
- ✅ GSAP page transitions and stagger animations
- ✅ Public landing page with ChatWidget, header, footer, content blocks
- ✅ Dynamic role-based dashboards (4 variants)
- ✅ Public API for landing page content
- ✅ Multi-channel support ingestion with auto-routing
- ✅ Composer `dev` script runs server + queue + logs + vite concurrently

---

## Part 2 — Gap Analysis: What's Missing Entirely

### 2.1 Sales & Digital Marketing (Social Media Ops)

CMS covers public content but no module for managing social accounts, content calendars, approval workflows, or ad campaigns.

**New tables needed:**

| Table                 | Key Columns                                                                          |
| --------------------- | ------------------------------------------------------------------------------------ |
| `social_accounts`     | id, platform, handle, access_token_encrypted, connected_by, status                   |
| `account_assignments` | id, social_account_id, user_id, role_on_account                                      |
| `posts`               | id, content, media_path, status, scheduled_at, published_at, created_by, approved_by |
| `post_accounts`       | id, post_id, social_account_id                                                       |
| `campaigns`           | id, name, platform, objective, budget, start_date, end_date, created_by              |
| `campaign_metrics`    | id, campaign_id, date, reach, clicks, cost, leads_generated                          |

**New pages:** `MarketingAccounts.tsx`, `MarketingCalendar.tsx`, `MarketingCampaigns.tsx`

**Existing table changes:** Add `source`, `utm_campaign`, `utm_source`, `follow_up_date` to `leads`

### 2.2 Landing Page Visibility Control

No client-approval-before-publishing safeguard or drag-and-drop section manager.

**New tables:**

| Table               | Key Columns                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `portfolio_entries` | id, project_id, client_approved, is_visible, cover_image, description, tags |
| `landing_sections`  | id, section_key, is_visible, sort_order, updated_by                         |

**New page:** `CmsLandingBuilder.tsx`

### 2.3 Knowledge Base

Support has tickets and conversations but no self-serve help articles.

**New table:**

| Table         | Key Columns                                         |
| ------------- | --------------------------------------------------- |
| `kb_articles` | id, title, category, body, is_published, created_by |

**New pages:** `SupportKnowledgeBase.tsx` + public `HelpCenter.tsx`

### 2.4 Deep AI Layer

`AiController` has 6 endpoints but all are placeholder/template. No `AiAssistantService`, no AI models, no AI services files exist. The `Models/` and `Services/` directories under `app/Modules/AI/` are **empty**.

**New tables:**

| Table              | Key Columns                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| `ai_conversations` | id, source_type, source_id, role, message, created_at                                                  |
| `ai_suggestions`   | id, target_table, target_id, suggestion_type, content, status (pending/accepted/rejected), reviewed_by |
| `lead_scores`      | id, lead_id, score, factors_json, calculated_at                                                        |

**New backend service:** `app/Modules/AI/Services/AiAssistantService.php` — callable from Support (ticket triage), CRM (lead scoring), CMS (post draft generation), Projects (weekly digest)

**Critical rule:** Every AI output that reaches a client or gets published must pass through a human approval flag — never fully automatic.

### 2.5 Deployment Tracking

Hosting tracks servers/domains/SSL but no record of deployments.

**New table:**

| Table         | Key Columns                                                            |
| ------------- | ---------------------------------------------------------------------- |
| `deployments` | id, project_id, server_id, version_tag, deployed_by, notes, created_at |

**New page:** `HostingDeployments.tsx` or tab inside server detail page

### 2.6 Hourly Rates & Timesheet Approval

`time_logs` exists but no hourly rates or timesheet approval workflow feeding into Finance.

**New tables:**

| Table          | Key Columns                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `hourly_rates` | id, user_id, project_id (nullable), rate_per_hour, currency, effective_from |
| `timesheets`   | id, user_id, period_start, period_end, status, approved_by, approved_at     |

**New page:** `FinanceTimesheets.tsx`

---

## Part 3 — Polish List (Exists But Needs Fixing)

| #   | Area                  | Issue                                                                           | Action                                                                                                 |
| --- | --------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | Module Controllers    | Deeper CRUD not fully mapped in all controllers                                 | Audit every React form against its controller — confirm store/update/destroy all persist correctly     |
| 2   | Mobile Responsiveness | Data tables break on mobile (Invoices, CRM Leads)                               | Apply shared responsive table component pattern (same fix used for Manage Team)                        |
| 3   | AI Integration        | `Ai.tsx` is isolated, `AI/Models/` and `AI/Services/` are empty                 | Build `AiAssistantService` (Section 2.4) callable from every module                                    |
| 4   | Reports Frontend      | `Reports.tsx` doesn't consume the 5 working backend endpoints                   | Wire frontend to `GET /api/v1/reports/{revenue,projects,clients,employees,finance}` — backend is ready |
| 5   | CRM MeetingController | Lives in Projects module, not CRM                                               | Move to CRM module or keep as shared (document decision)                                               |
| 6   | Support Routing       | `ConversationRoutingService` exists but WebSocket broadcasting is commented out | Uncomment and test with Laravel Reverb                                                                 |

---

## Part 4 — Cross-Module Consistency Checks

- [ ] **Tenancy enforcement:** Confirm `workspace_tenancy` is enforced via global scope in every query, not just present as a column
- [ ] **AlertDialog:** Confirm the unified AlertDialog has replaced `confirm()` in all pages including newer Support pages (Automation, Widget, LiveChat, Contacts, Conversations)
- [ ] **Details vs Description:** Verify consistency across DB columns, translation files (en.json/ar.json), and hardcoded strings in newer components
- [ ] **Activity logging:** Confirm `activity_log` captures create/update/delete on every module (check CRM, Marketing, Deployments, Timesheets once added)
- [ ] **Permission sync:** Frontend `lib/permissions.ts` and backend `User::getAllPermissions()` must stay in sync — currently `support_manager` role exists in frontend but not in backend `getAllPermissions()` match block

---

## Part 5 — Build Order

| Phase | What                                           | Priority   | Reason                                                 |
| ----- | ---------------------------------------------- | ---------- | ------------------------------------------------------ |
| **A** | Polish list (Section 3)                        | 🔴 Highest | Affects modules already in use                         |
| **B** | Sales & Digital Marketing + Landing Visibility | 🟠 High    | Revenue-driving features                               |
| **C** | Knowledge Base                                 | 🟡 Medium  | Quick win, reduces support load                        |
| **D** | Hourly Rates + Timesheet Approval              | 🟡 Medium  | Unlocks real profitability in Finance                  |
| **E** | Deployment Tracking                            | 🟢 Low     | Small addition to Hosting                              |
| **F** | Deep AI Layer                                  | 🔵 Last    | Biggest effort, depends on clean data from all modules |
| **G** | Final Reports aggregation                      | 🔵 Last    | Once Finance/HR/Projects/Marketing data is all clean   |

---

## Part 6 — New Database Tables Summary

```
social_accounts     (id, platform, handle, access_token_encrypted, connected_by, status)
account_assignments (id, social_account_id, user_id, role_on_account)
posts               (id, content, media_path, status, scheduled_at, published_at, created_by, approved_by)
post_accounts       (id, post_id, social_account_id)
campaigns           (id, name, platform, objective, budget, start_date, end_date, created_by)
campaign_metrics    (id, campaign_id, date, reach, clicks, cost, leads_generated)
portfolio_entries   (id, project_id, client_approved, is_visible, cover_image, description, tags)
landing_sections    (id, section_key, is_visible, sort_order, updated_by)
kb_articles         (id, title, category, body, is_published, created_by)
ai_conversations    (id, source_type, source_id, role, message, created_at)
ai_suggestions      (id, target_table, target_id, suggestion_type, content, status, reviewed_by)
lead_scores         (id, lead_id, score, factors_json, calculated_at)
deployments         (id, project_id, server_id, version_tag, deployed_by, notes, created_at)
hourly_rates        (id, user_id, project_id, rate_per_hour, currency, effective_from)
timesheets          (id, user_id, period_start, period_end, status, approved_by, approved_at)
```

---

## Part 7 — Key File Reference

| Purpose               | Path                                                          |
| --------------------- | ------------------------------------------------------------- |
| Web routes            | `routes/web.php`                                              |
| API routes            | `routes/api.php`                                              |
| Auth routes           | `routes/auth.php`                                             |
| User model            | `app/Modules/Auth/Models/User.php`                            |
| Permission middleware | `app/Http/Middleware/CheckPermission.php`                     |
| Inertia shared data   | `app/Http/Middleware/HandleInertiaRequests.php`               |
| Frontend permissions  | `resources/js/lib/permissions.ts`                             |
| Frontend entry        | `resources/js/app.tsx`                                        |
| Public entry          | `resources/js/public_app.tsx`                                 |
| Layout                | `resources/js/Layouts/AppLayout.tsx`                          |
| Sidebar nav           | `resources/js/components/app-sidebar.tsx`                     |
| Theme/styles          | `resources/js/styles.css`                                     |
| Tailwind config       | `tailwind.config.js`                                          |
| Vite config           | `vite.config.js`                                              |
| TypeScript config     | `tsconfig.json`                                               |
| i18n English          | `resources/js/i18n/en.json`                                   |
| i18n Arabic           | `resources/js/i18n/ar.json`                                   |
| Dashboard controller  | `app/Modules/Core/Controllers/DashboardController.php`        |
| Error management      | `app/Modules/Core/Controllers/ErrorManagementController.php`  |
| AI controller         | `app/Modules/AI/Controllers/AiController.php`                 |
| Reports controller    | `app/Modules/Reports/Controllers/ReportController.php`        |
| Support ingestion     | `app/Modules/Support/Controllers/IngestionController.php`     |
| Conversation routing  | `app/Modules/Support/Services/ConversationRoutingService.php` |
| Error logging service | `app/Modules/Core/Services/ErrorLoggingService.php`           |
| Main seeder           | `database/seeders/DatabaseSeeder.php`                         |
| Marketing seeder      | `database/seeders/MarketingSeeder.php`                        |
| Composer config       | `composer.json`                                               |
| NPM config            | `package.json`                                                |

---

> **Bottom line:** Nothing above touches your existing CRM, HR, Projects, Finance, Hosting, Support, or CMS modules — it only extends them. Fix the polish list first (it's already in front of real users/data), then layer in Marketing → Knowledge Base → Timesheets → Deployments → AI → Reports, in that order.
