// In-memory mock domain data for The Knower OS
import type { Role } from "@/lib/permissions";

export type ID = string;

const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;

export interface User {
  id: ID;
  name: string;
  email: string;
  role: Role;
  online: boolean;
}

export interface Company {
  id: ID;
  name: string;
  industry: string;
  website: string;
  country: string;
  createdAt: string;
}

export interface Client {
  id: ID;
  companyId: ID;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Lead {
  id: ID;
  name: string;
  email: string;
  phone: string;
  source: string;
  budget: number;
  status: "new" | "contacted" | "qualified" | "lost" | "won";
  assignedTo: string;
  createdAt: string;
}

export interface Quotation {
  id: ID;
  number: string;
  clientId: ID;
  price: number;
  currency: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  validUntil: string;
  createdAt: string;
}

export interface Contract {
  id: ID;
  number: string;
  clientId: ID;
  startDate: string;
  endDate: string;
  amount: number;
  status: "draft" | "active" | "ended";
  createdAt: string;
}

export interface Project {
  id: ID;
  name: string;
  clientId: ID;
  description: string;
  type: string;
  status: "planning" | "in_progress" | "on_hold" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  startDate: string;
  deadline: string;
  budget: number;
  progress: number;
  createdAt: string;
}

export interface Milestone {
  id: ID;
  projectId: ID;
  title: string;
  deadline: string;
  progress: number;
  status: "pending" | "in_progress" | "done";
}

export interface Task {
  id: ID;
  projectId: ID;
  milestoneId?: ID;
  title: string;
  description: string;
  assignee: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  createdAt: string;
}

export interface Bug {
  id: ID;
  projectId: ID;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  reportedBy: string;
  assignedTo: string;
  createdAt: string;
}

export interface FileItem {
  id: ID;
  projectId: ID;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
}

export interface Invoice {
  id: ID;
  number: string;
  clientId: ID;
  projectId?: ID;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  createdAt: string;
}

export interface Payment {
  id: ID;
  invoiceId: ID;
  method: "card" | "bank" | "cash" | "wallet";
  amount: number;
  paidAt: string;
  reference: string;
}

export interface Expense {
  id: ID;
  category: string;
  title: string;
  amount: number;
  method: string;
  createdAt: string;
}

export interface Domain {
  id: ID;
  clientId: ID;
  domain: string;
  registrar: string;
  expiryDate: string;
  autoRenew: boolean;
  status: "active" | "expiring" | "expired";
}

export interface HostingAccount {
  id: ID;
  clientId: ID;
  provider: string;
  plan: string;
  username: string;
  expiryDate: string;
  status: "active" | "expiring" | "suspended";
}

export interface Server {
  id: ID;
  name: string;
  provider: string;
  ip: string;
  location: string;
  os: string;
  status: "online" | "offline" | "maintenance";
}

export interface SSL {
  id: ID;
  domainId: ID;
  provider: string;
  expiryDate: string;
  status: "valid" | "expiring" | "expired";
}

export interface Ticket {
  id: ID;
  number: string;
  clientId: ID;
  subject: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo: string;
  createdAt: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: ID;
  sender: string;
  message: string;
  createdAt: string;
}

export interface Employee {
  id: ID;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: "active" | "on_leave" | "terminated";
}

export interface Department {
  id: ID;
  name: string;
  head: string;
  employeeCount: number;
}

export interface Attendance {
  id: ID;
  employeeId: ID;
  date: string;
  checkIn: string;
  checkOut: string;
}

export interface Leave {
  id: ID;
  employeeId: ID;
  type: "annual" | "sick" | "unpaid";
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
}

export interface Notification {
  id: ID;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface Meeting {
  id: ID;
  title: string;
  clientId?: ID;
  date: string;
  duration: number;
  attendees: string;
}

export interface Contact {
  id: ID;
  name: string;
  email: string;
  phone: string;
  companyId: ID;
}

// --- Seeds ---

const iso = (daysFromNow = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
};

export const companies: Company[] = [
  { id: "co_1", name: "Nile Pharma", industry: "Pharmaceuticals", website: "nilepharma.com", country: "Egypt", createdAt: iso(-120) },
  { id: "co_2", name: "Cedar Retail", industry: "Retail", website: "cedar.io", country: "Lebanon", createdAt: iso(-80) },
  { id: "co_3", name: "Atlas Logistics", industry: "Logistics", website: "atlaslog.co", country: "Morocco", createdAt: iso(-45) },
  { id: "co_4", name: "Kairo Bank", industry: "Finance", website: "kairobank.eg", country: "Egypt", createdAt: iso(-200) },
];

export const clients: Client[] = [
  { id: "cl_1", companyId: "co_1", name: "Salma Fahmy", email: "salma@nilepharma.com", phone: "+20 100 111 2222", position: "IT Director", status: "active", createdAt: iso(-100) },
  { id: "cl_2", companyId: "co_2", name: "Karim Haddad", email: "karim@cedar.io", phone: "+961 3 555 111", position: "COO", status: "active", createdAt: iso(-70) },
  { id: "cl_3", companyId: "co_3", name: "Youssef Amrani", email: "youssef@atlaslog.co", phone: "+212 6 12 34 56", position: "CTO", status: "active", createdAt: iso(-30) },
  { id: "cl_4", companyId: "co_4", name: "Nour El Din", email: "nour@kairobank.eg", phone: "+20 122 000 9999", position: "Head of Digital", status: "inactive", createdAt: iso(-180) },
];

export const contacts: Contact[] = [
  { id: "cn_1", name: "Ali Mostafa", email: "ali@nilepharma.com", phone: "+20 100 999 8888", companyId: "co_1" },
  { id: "cn_2", name: "Reem Saad", email: "reem@cedar.io", phone: "+961 3 200 100", companyId: "co_2" },
];

export const leads: Lead[] = [
  { id: "ld_1", name: "Omar Hakim", email: "omar@fastcart.io", phone: "+20 111 000 111", source: "Website", budget: 25000, status: "qualified", assignedTo: "Sales", createdAt: iso(-10) },
  { id: "ld_2", name: "Lina Aziz", email: "lina@medix.co", phone: "+961 70 111 222", source: "Referral", budget: 60000, status: "contacted", assignedTo: "Sales", createdAt: iso(-4) },
  { id: "ld_3", name: "Hassan Trad", email: "hassan@builder.tn", phone: "+216 22 333 444", source: "LinkedIn", budget: 12000, status: "new", assignedTo: "Sales", createdAt: iso(-1) },
];

export const meetings: Meeting[] = [
  { id: "mt_1", title: "Kickoff — Nile Pharma", clientId: "cl_1", date: iso(2), duration: 60, attendees: "PM, Client, Sales" },
  { id: "mt_2", title: "Design review — Cedar", clientId: "cl_2", date: iso(4), duration: 45, attendees: "Designer, Client" },
];

export const quotations: Quotation[] = [
  { id: "qt_1", number: "QT-2026-001", clientId: "cl_1", price: 45000, currency: "USD", status: "accepted", validUntil: iso(20), createdAt: iso(-15) },
  { id: "qt_2", number: "QT-2026-002", clientId: "cl_2", price: 18000, currency: "USD", status: "sent", validUntil: iso(10), createdAt: iso(-5) },
];

export const contracts: Contract[] = [
  { id: "ct_1", number: "CTR-2026-001", clientId: "cl_1", startDate: iso(-10), endDate: iso(180), amount: 45000, status: "active", createdAt: iso(-10) },
];

export const projects: Project[] = [
  { id: "pr_1", name: "Pharma ERP", clientId: "cl_1", description: "End-to-end ERP for pharma distribution", type: "Web App", status: "in_progress", priority: "high", startDate: iso(-40), deadline: iso(60), budget: 45000, progress: 55, createdAt: iso(-40) },
  { id: "pr_2", name: "Cedar Storefront", clientId: "cl_2", description: "Next-gen headless commerce", type: "Web + Mobile", status: "planning", priority: "medium", startDate: iso(5), deadline: iso(120), budget: 32000, progress: 8, createdAt: iso(-5) },
  { id: "pr_3", name: "Atlas Fleet Tracker", clientId: "cl_3", description: "Realtime fleet dashboard", type: "Web App", status: "overdue", priority: "high", startDate: iso(-90), deadline: iso(-5), budget: 22000, progress: 82, createdAt: iso(-90) },
  { id: "pr_4", name: "Kairo Onboarding", clientId: "cl_4", description: "Digital KYC and onboarding", type: "Mobile App", status: "completed", priority: "medium", startDate: iso(-180), deadline: iso(-20), budget: 60000, progress: 100, createdAt: iso(-180) },
];

export const milestones: Milestone[] = [
  { id: "ms_1", projectId: "pr_1", title: "Discovery & Architecture", deadline: iso(-20), progress: 100, status: "done" },
  { id: "ms_2", projectId: "pr_1", title: "Core modules", deadline: iso(30), progress: 60, status: "in_progress" },
  { id: "ms_3", projectId: "pr_1", title: "UAT & launch", deadline: iso(60), progress: 0, status: "pending" },
];

export const tasks: Task[] = [
  { id: "tk_1", projectId: "pr_1", milestoneId: "ms_2", title: "Build inventory API", description: "CRUD + stock levels", assignee: "Ahmed", status: "in_progress", priority: "high", dueDate: iso(3), estimatedHours: 20, actualHours: 12, createdAt: iso(-5) },
  { id: "tk_2", projectId: "pr_1", milestoneId: "ms_2", title: "Design dashboard", description: "Wireframes + visual design", assignee: "Mona", status: "review", priority: "medium", dueDate: iso(1), estimatedHours: 12, actualHours: 14, createdAt: iso(-6) },
  { id: "tk_3", projectId: "pr_2", title: "Setup Next.js repo", description: "Base scaffolding", assignee: "Ziad", status: "todo", priority: "low", dueDate: iso(7), estimatedHours: 4, actualHours: 0, createdAt: iso(-1) },
  { id: "tk_4", projectId: "pr_3", title: "Fix map jitter", description: "Regression from mapbox upgrade", assignee: "Nadia", status: "done", priority: "high", dueDate: iso(-2), estimatedHours: 6, actualHours: 8, createdAt: iso(-8) },
];

export const bugs: Bug[] = [
  { id: "bg_1", projectId: "pr_1", title: "Stock count off by 1 on edit", severity: "high", status: "in_progress", reportedBy: "QA", assignedTo: "Ahmed", createdAt: iso(-2) },
  { id: "bg_2", projectId: "pr_3", title: "Login stuck on iOS 17", severity: "critical", status: "open", reportedBy: "Client", assignedTo: "Nadia", createdAt: iso(-1) },
];

export const files: FileItem[] = [
  { id: "fl_1", projectId: "pr_1", name: "Architecture.pdf", type: "pdf", size: 1240000, uploadedBy: "PM", createdAt: iso(-30) },
  { id: "fl_2", projectId: "pr_1", name: "Dashboard-v3.fig", type: "figma", size: 3400000, uploadedBy: "Designer", createdAt: iso(-10) },
];

export const invoices: Invoice[] = [
  { id: "in_1", number: "INV-2026-001", clientId: "cl_1", projectId: "pr_1", amount: 15000, status: "paid", dueDate: iso(-20), createdAt: iso(-40) },
  { id: "in_2", number: "INV-2026-002", clientId: "cl_1", projectId: "pr_1", amount: 15000, status: "sent", dueDate: iso(15), createdAt: iso(-5) },
  { id: "in_3", number: "INV-2026-003", clientId: "cl_3", projectId: "pr_3", amount: 8000, status: "overdue", dueDate: iso(-10), createdAt: iso(-30) },
  { id: "in_4", number: "INV-2026-004", clientId: "cl_2", projectId: "pr_2", amount: 5000, status: "draft", dueDate: iso(30), createdAt: iso(-2) },
];

export const payments: Payment[] = [
  { id: "py_1", invoiceId: "in_1", method: "bank", amount: 15000, paidAt: iso(-18), reference: "SWIFT-8891" },
];

export const expenses: Expense[] = [
  { id: "ex_1", category: "SaaS", title: "GitHub Enterprise", amount: 420, method: "card", createdAt: iso(-15) },
  { id: "ex_2", category: "Infra", title: "AWS — March", amount: 1830, method: "card", createdAt: iso(-10) },
  { id: "ex_3", category: "Office", title: "Coworking desks", amount: 900, method: "bank", createdAt: iso(-5) },
];

export const domains: Domain[] = [
  { id: "dm_1", clientId: "cl_1", domain: "nilepharma.com", registrar: "Namecheap", expiryDate: iso(20), autoRenew: true, status: "expiring" },
  { id: "dm_2", clientId: "cl_2", domain: "cedar.io", registrar: "Cloudflare", expiryDate: iso(300), autoRenew: true, status: "active" },
  { id: "dm_3", clientId: "cl_3", domain: "atlaslog.co", registrar: "GoDaddy", expiryDate: iso(-3), autoRenew: false, status: "expired" },
];

export const hostingAccounts: HostingAccount[] = [
  { id: "ho_1", clientId: "cl_1", provider: "Hetzner", plan: "CX41", username: "nile-app", expiryDate: iso(15), status: "expiring" },
  { id: "ho_2", clientId: "cl_2", provider: "DigitalOcean", plan: "Droplet 4GB", username: "cedar", expiryDate: iso(180), status: "active" },
];

export const servers: Server[] = [
  { id: "sv_1", name: "app-prod-01", provider: "Hetzner", ip: "78.46.10.10", location: "Falkenstein", os: "Ubuntu 24.04", status: "online" },
  { id: "sv_2", name: "db-prod-01", provider: "AWS", ip: "10.0.0.14", location: "eu-central-1", os: "Ubuntu 22.04", status: "online" },
];

export const ssls: SSL[] = [
  { id: "sl_1", domainId: "dm_1", provider: "Let's Encrypt", expiryDate: iso(10), status: "expiring" },
  { id: "sl_2", domainId: "dm_2", provider: "Cloudflare", expiryDate: iso(180), status: "valid" },
];

export const tickets: Ticket[] = [
  {
    id: "tc_1",
    number: "TCK-1001",
    clientId: "cl_1",
    subject: "Cannot generate March invoices report",
    priority: "high",
    status: "in_progress",
    assignedTo: "Support",
    createdAt: iso(-1),
    messages: [
      { id: "m1", sender: "Salma Fahmy", message: "Getting a 500 error when I click Export.", createdAt: iso(-1) },
      { id: "m2", sender: "Support", message: "Investigating. Can you share the request ID?", createdAt: iso(-1) },
    ],
  },
  {
    id: "tc_2",
    number: "TCK-1002",
    clientId: "cl_3",
    subject: "Map tiles missing on mobile",
    priority: "urgent",
    status: "open",
    assignedTo: "Support",
    createdAt: iso(0),
    messages: [{ id: "m3", sender: "Youssef Amrani", message: "Users report blank map since morning.", createdAt: iso(0) }],
  },
];

export const employees: Employee[] = [
  { id: "em_1", name: "Ahmed Nasr", email: "ahmed@theknower.io", department: "Engineering", position: "Senior Developer", salary: 4500, hireDate: iso(-800), status: "active" },
  { id: "em_2", name: "Mona Adel", email: "mona@theknower.io", department: "Design", position: "UI/UX Designer", salary: 3200, hireDate: iso(-500), status: "active" },
  { id: "em_3", name: "Ziad Farouk", email: "ziad@theknower.io", department: "Engineering", position: "Full-stack Developer", salary: 3800, hireDate: iso(-300), status: "active" },
  { id: "em_4", name: "Nadia Hakim", email: "nadia@theknower.io", department: "Engineering", position: "Mobile Developer", salary: 3600, hireDate: iso(-200), status: "on_leave" },
  { id: "em_5", name: "Layla Samir", email: "layla@theknower.io", department: "Operations", position: "HR Manager", salary: 3000, hireDate: iso(-1000), status: "active" },
];

export const departments: Department[] = [
  { id: "dp_1", name: "Engineering", head: "Ahmed Nasr", employeeCount: 3 },
  { id: "dp_2", name: "Design", head: "Mona Adel", employeeCount: 1 },
  { id: "dp_3", name: "Operations", head: "Layla Samir", employeeCount: 1 },
];

export const attendance: Attendance[] = [
  { id: "at_1", employeeId: "em_1", date: iso(0).slice(0, 10), checkIn: "09:02", checkOut: "18:10" },
  { id: "at_2", employeeId: "em_2", date: iso(0).slice(0, 10), checkIn: "09:15", checkOut: "17:45" },
];

export const leaves: Leave[] = [
  { id: "lv_1", employeeId: "em_4", type: "annual", startDate: iso(-3), endDate: iso(4), status: "approved" },
  { id: "lv_2", employeeId: "em_3", type: "sick", startDate: iso(1), endDate: iso(2), status: "pending" },
];

export const notifications: Notification[] = [
  { id: "nt_1", title: "Invoice paid", message: "INV-2026-001 marked paid ($15,000)", type: "success", read: false, createdAt: iso(0) },
  { id: "nt_2", title: "Domain expiring", message: "nilepharma.com expires in 20 days", type: "warning", read: false, createdAt: iso(0) },
  { id: "nt_3", title: "New ticket", message: "TCK-1002 opened by Youssef Amrani", type: "info", read: true, createdAt: iso(-1) },
  { id: "nt_4", title: "Project overdue", message: "Atlas Fleet Tracker is 5 days overdue", type: "error", read: false, createdAt: iso(-1) },
];

// --- Utilities ---

export function makeId(prefix: string) {
  return uid(prefix);
}

// Revenue by month for charts (last 8 months, dollars)
export const revenueSeries = [
  { month: "May", revenue: 14200, expense: 8100 },
  { month: "Jun", revenue: 18800, expense: 9200 },
  { month: "Jul", revenue: 21500, expense: 10100 },
  { month: "Aug", revenue: 19200, expense: 9800 },
  { month: "Sep", revenue: 26400, expense: 11200 },
  { month: "Oct", revenue: 31200, expense: 12800 },
  { month: "Nov", revenue: 28900, expense: 12100 },
  { month: "Dec", revenue: 34100, expense: 13500 },
];
