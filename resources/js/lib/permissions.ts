export type Role =
  | "super_admin"
  | "ceo"
  | "sales"
  | "project_manager"
  | "team_leader"
  | "developer"
  | "designer"
  | "qa"
  | "accountant"
  | "hr"
  | "support"
  | "support_manager"
  | "client";

export const ALL_ROLES: Role[] = [
  "super_admin",
  "ceo",
  "sales",
  "project_manager",
  "team_leader",
  "developer",
  "designer",
  "qa",
  "accountant",
  "hr",
  "support",
  "client",
];

export const PERMISSIONS = [
  "dashboard.view",
  "crm.view",
  "lead.manage",
  "client.manage",

  "quotation.manage",
  "contract.manage",
  "project.view",
  "project.manage",
  "task.view",
  "task.manage",
  "task.update_status",
  "bug.manage",
  "file.upload",
  "finance.view",
  "invoice.manage",
  "payment.manage",
  "expense.manage",
  "hosting.view",
  "hosting.manage",
  "domain.manage",
  "server.manage",
  "ssl.manage",
  "hr.view",
  "hr.manage",
  "attendance.manage",
  "leave.manage",
  "payroll.manage",
  "support.view",
  "ticket.manage",
  "ticket.reply",
  "report.view",
  "ai.use",
  "settings.manage",
  "user.manage",
  "client_portal.view",
  "code.review",
  "design.upload",
  "qa.test",
  "cms.manage",
  "support.inbox",
  "support.tickets",
  "support.canned",
  "support.kb_read",
  "support.manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  "dashboard.view": "View the main overview dashboard.",
  "crm.view": "Access the CRM module (Leads, Clients, Meetings).",
  "lead.manage": "Create, edit, and delete leads.",
  "client.manage": "Create, edit, and delete clients.",
  "quotation.manage": "Generate, edit, and send quotations.",
  "contract.manage": "Create, edit, and sign contracts.",
  "project.view": "View project details and progress.",
  "project.manage": "Full access: create, edit, delete projects and assign teams.",
  "task.view": "View assigned tasks within projects.",
  "task.manage": "Create, assign, edit, and delete tasks.",
  "task.update_status": "Change the status of tasks (e.g., In Progress, Done).",
  "bug.manage": "Report, edit, and resolve project bugs.",
  "file.upload": "Upload and manage files inside projects.",
  "finance.view": "View financial summaries and reports.",
  "invoice.manage": "Create, send, and delete invoices.",
  "payment.manage": "Record and manage incoming payments.",
  "expense.manage": "Record and categorize company expenses.",
  "hosting.view": "View hosting servers and domains.",
  "hosting.manage": "Manage hosting packages and accounts.",
  "domain.manage": "Register, renew, and manage domains.",
  "server.manage": "Manage server configurations and access.",
  "ssl.manage": "Install and renew SSL certificates.",
  "hr.view": "View the HR dashboard and employee list.",
  "hr.manage": "Add, edit, and terminate employee profiles.",
  "attendance.manage": "Monitor and manage employee attendance records.",
  "leave.manage": "Approve or reject leave requests.",
  "payroll.manage": "Generate and manage employee payrolls.",
  "support.view": "View support tickets and knowledge base.",
  "ticket.manage": "Create, assign, and delete support tickets.",
  "ticket.reply": "Respond to active support tickets.",
  "report.view": "View system and analytics reports.",
  "ai.use": "Access and use integrated AI assistant tools.",
  "settings.manage": "Manage system settings, integrations, and configurations.",
  "user.manage": "Add, edit, and remove system users and assign roles.",
  "client_portal.view": "Access the limited client portal interface.",
  "code.review": "Review and approve code commits (Developer focused).",
  "design.upload": "Upload UI/UX designs and assets (Designer focused).",
  "qa.test": "Run QA tests and mark them as passed/failed.",
  "cms.manage": "Manage CMS content (Pricing, FAQs, Blogs).",
  "support.inbox": "View the unified support inbox and live chats.",
  "support.tickets": "Access detailed ticket threads.",
  "support.canned": "Manage canned responses for support.",
  "support.kb_read": "Read the knowledge base articles.",
  "support.manage": "Full support access: SLAs, automation, queues, and agents.",
};

const ALL: Permission[] = [...PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: ALL,
  ceo: [
    "dashboard.view",
    "crm.view",
    "client.manage",

    "project.view",
    "finance.view",
    "report.view",
    "hr.view",
    "hosting.view",
    "support.view",
    "ai.use",
  ],
  sales: [
    "dashboard.view",
    "crm.view",
    "lead.manage",
    "client.manage",

    "quotation.manage",
    "contract.manage",
    "ai.use",
  ],
  project_manager: [
    "dashboard.view",
    "crm.view",
    "project.view",
    "project.manage",
    "task.view",
    "task.manage",
    "bug.manage",
    "file.upload",
    "report.view",
    "ai.use",
  ],
  team_leader: [
    "dashboard.view",
    "project.view",
    "task.view",
    "task.manage",
    "code.review",
    "bug.manage",
    "file.upload",
    "ai.use",
  ],
  developer: [
    "dashboard.view",
    "project.view",
    "task.view",
    "task.update_status",
    "bug.manage",
    "file.upload",
    "ai.use",
  ],
  designer: [
    "dashboard.view",
    "project.view",
    "task.view",
    "task.update_status",
    "design.upload",
    "file.upload",
  ],
  qa: [
    "dashboard.view",
    "project.view",
    "task.view",
    "qa.test",
    "bug.manage",
    "file.upload",
  ],
  accountant: [
    "dashboard.view",
    "finance.view",
    "invoice.manage",
    "payment.manage",
    "expense.manage",
    "report.view",
  ],
  hr: [
    "dashboard.view",
    "hr.view",
    "hr.manage",
    "attendance.manage",
    "leave.manage",
    "payroll.manage",
    "report.view",
  ],
  support: [
    "dashboard.view",
    "support.view",
    "ticket.manage",
    "ticket.reply",
    "client.manage",
    "support.inbox",
    "support.tickets",
    "support.canned",
    "support.kb_read",
  ],
  support_manager: [
    "dashboard.view",
    "support.view",
    "ticket.manage",
    "ticket.reply",
    "client.manage",
    "support.inbox",
    "support.tickets",
    "support.canned",
    "support.kb_read",
    "support.manage", // queue, SLA, escalations, automation, agents, reports, widget
  ],
  client: ["client_portal.view"],
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  ceo: "CEO",
  sales: "Sales",
  project_manager: "Project Manager",
  team_leader: "Team Leader",
  developer: "Software Developer",
  designer: "UI/UX Designer",
  qa: "QA Tester",
  accountant: "Accountant",
  hr: "HR",
  support: "Support",
  client: "Client",
};

export function roleHas(role: Role, perm: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(perm) ?? false;
}
