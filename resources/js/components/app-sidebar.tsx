import { Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Handshake,
  FolderKanban,
  ListTodo,
  Bug,
  Receipt,
  CreditCard,
  Wallet,
  TrendingUp,
  Globe,
  Server,
  ShieldCheck,
  Ticket,
  UserCircle,
  Calendar,
  ClipboardList,
  Banknote,
  BarChart3,
  Sparkles,
  Settings,
  Contact as ContactIcon,
  Video,
  UserSquare2,
  Network,
  HardDrive,
  Trophy,
  Clock,
  Briefcase,
  FileBadge,
  Edit,
  MessageSquare,
  Monitor,
  Bot,
  Share2,
  Megaphone,
  LayoutTemplate,
  CalendarCheck,
  Activity,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/store/auth";
import { roleHas, type Permission } from "@/lib/permissions";

type Item = {
  to: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  perm?: Permission;
};

type Group = { labelKey: string; items: Item[] };

const groups: Group[] = [
  {
    labelKey: "nav.dashboard",
    items: [{ to: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard, perm: "dashboard.view" }],
  },
  {
    labelKey: "User Management",
    items: [
      { to: "/admin/users", labelKey: "User Management", icon: Users, perm: "user.manage" },
      { to: "/admin/activity-logs", labelKey: "Audit & Activity Logs", icon: Activity, perm: "user.manage" },
    ],
  },
  {
    labelKey: "nav.crm",
    items: [
      { to: "/crm/leads",     labelKey: "nav.leads",     icon: UserSquare2, perm: "lead.manage" },
      { to: "/crm/inquiries", labelKey: "nav.inquiries", icon: MessageSquare, perm: "lead.manage" },
      { to: "/crm/clients",   labelKey: "nav.clients",   icon: Users, perm: "client.manage" },
      { to: "/crm/meetings",  labelKey: "nav.meetings",  icon: Video, perm: "crm.view" },
    ],
  },
  {
    labelKey: "nav.projects",
    items: [
      { to: "/projects", labelKey: "nav.projects", icon: FolderKanban, perm: "project.view" },
      { to: "/tasks", labelKey: "nav.tasks", icon: ListTodo, perm: "task.view" },
      { to: "/cms/team", labelKey: "Team Members", icon: Users, perm: "project.view" },
      { to: "/bugs", labelKey: "Maintenance & Bugs", icon: Bug, perm: "bug.manage" },
      { to: "/crm/contracts", labelKey: "nav.contracts", icon: Handshake, perm: "contract.manage" },
      { to: "/calendar", labelKey: "Calendar", icon: Calendar, perm: "project.view" },
    ],
  },
  {
    labelKey: "nav.finance",
    items: [
      { to: "/finance/invoices", labelKey: "nav.invoices", icon: Receipt, perm: "invoice.manage" },
      { to: "/finance/payments", labelKey: "nav.payments", icon: CreditCard, perm: "payment.manage" },
      { to: "/finance/expenses", labelKey: "nav.expenses", icon: Wallet, perm: "expense.manage" },
      { to: "/finance/revenue", labelKey: "nav.revenue", icon: TrendingUp, perm: "finance.view" },
    ],
  },
  {
    labelKey: "nav.hosting",
    items: [
      { to: "/hosting/domains", labelKey: "nav.domains", icon: Globe, perm: "hosting.view" },
      { to: "/hosting/accounts", labelKey: "nav.hostingAccounts", icon: HardDrive, perm: "hosting.view" },
      { to: "/hosting/servers", labelKey: "nav.servers", icon: Server, perm: "hosting.view" },
      { to: "/hosting/ssl", labelKey: "nav.ssl", icon: ShieldCheck, perm: "hosting.view" },
    ],
  },
  {
    labelKey: "nav.hr",
    items: [
      { to: "/hr/employees", labelKey: "nav.employees", icon: UserCircle, perm: "hr.view" },
      { to: "/hr/departments", labelKey: "nav.departments", icon: Network, perm: "hr.view" },
      { to: "/hr/jobs", labelKey: "nav.jobPostings", icon: Briefcase, perm: "hr.view" },
      { to: "/hr/applications", labelKey: "nav.applications", icon: FileBadge, perm: "hr.view" },
      { to: "/hr/attendance", labelKey: "nav.attendance", icon: Calendar, perm: "attendance.manage" },
      { to: "/hr/leaves", labelKey: "nav.leaves", icon: ClipboardList, perm: "leave.manage" },
      { to: "/hr/payroll", labelKey: "nav.payroll", icon: Banknote, perm: "payroll.manage" },
      { to: "/crm/quotations", labelKey: "nav.quotations", icon: FileText, perm: "quotation.manage" },
    ],
  },
  {
    labelKey: "Sales & Marketing",
    items: [
      { to: "/marketing/accounts", labelKey: "Social Accounts", icon: Share2, perm: "marketing.view" },
      { to: "/marketing/posts", labelKey: "Content & Calendar", icon: Calendar, perm: "marketing.view" },
      { to: "/marketing/campaigns", labelKey: "Campaigns & Analytics", icon: Megaphone, perm: "marketing.view" },
      { to: "/cms/landing-builder", labelKey: "Landing Page Builder", icon: LayoutTemplate, perm: "cms.manage" },
      { to: "/crm/leads/followups", labelKey: "Sales Pipeline Scheduler", icon: CalendarCheck, perm: "lead.manage" },
      { to: "/marketing/activity-log", labelKey: "Marketing Audit Log", icon: Activity, perm: "marketing.view" },
    ],
  },
  {
    labelKey: "CMS",
    items: [
      { to: "/cms/pricing", labelKey: "Pricing Plans", icon: Briefcase, perm: "cms.manage" },
      { to: "/cms/testimonials", labelKey: "Testimonials", icon: Trophy, perm: "cms.manage" },
      { to: "/cms/faqs", labelKey: "FAQs", icon: FileText, perm: "cms.manage" },
      { to: "/cms/blog", labelKey: "Blog Posts", icon: Edit, perm: "cms.manage" },
      { to: "/cms/services", labelKey: "Services", icon: Settings, perm: "cms.manage" },
      { to: "/cms/social-links", labelKey: "Social Links", icon: Share2, perm: "cms.manage" },
    ],
  },
  {
    labelKey: "nav.support",
    items: [
      { to: "/support/dashboard", labelKey: "Dashboard", icon: LayoutDashboard, perm: "support.view" },
      { to: "/support/inbox", labelKey: "Inbox", icon: MessageSquare, perm: "support.view" },
      { to: "/support/live-chat", labelKey: "Live Chat", icon: Monitor, perm: "support.view" },
      { to: "/support/conversations", labelKey: "Conversations", icon: Ticket, perm: "support.view" },
      { to: "/support/contacts", labelKey: "Contacts", icon: ContactIcon, perm: "support.view" },
      { to: "/support/queue", labelKey: "Queue Manager", icon: Network, perm: "support.manage" },
      { to: "/support/automation", labelKey: "Automation Rules", icon: Bot, perm: "support.manage" },
      { to: "/support/widget", labelKey: "Widget Settings", icon: Settings, perm: "support.manage" },
    ],
  },
  {
    labelKey: "nav.reports",
    items: [{ to: "/reports", labelKey: "nav.reports", icon: BarChart3, perm: "report.view" }],
  },
  {
    labelKey: "nav.ai",
    items: [{ to: "/ai", labelKey: "nav.ai", icon: Sparkles, perm: "ai.use" }],
  },
  {
    labelKey: "nav.clientPortal",
    items: [
      { to: "/projects", labelKey: "nav.projects", icon: FolderKanban, perm: "client_portal.view" },
      { to: "/finance/invoices", labelKey: "nav.invoices", icon: Receipt, perm: "client_portal.view" },
      { to: "/finance/payments", labelKey: "nav.payments", icon: CreditCard, perm: "client_portal.view" },
      { to: "/crm/contracts", labelKey: "nav.contracts", icon: Handshake, perm: "client_portal.view" },
      { to: "/support/tickets", labelKey: "Support Tickets", icon: Ticket, perm: "client_portal.view" },
    ],
  },
  {
    labelKey: "nav.settings",
    items: [{ to: "/settings", labelKey: "nav.settings", icon: Settings, perm: "settings.manage" }],
  },
];

export function AppSidebar() {
  const { t, i18n } = useTranslation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { url: pathname } = usePage();
  const user = useAuth((s) => s.user);
  const role = user?.role;
  
  const isRtl = i18n.language === "ar";

  return (
    <Sidebar collapsible="offcanvas" side={isRtl ? "right" : "left"}>
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="font-display text-sm font-bold">K</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-display text-sm font-semibold">Knower</span>
              <span className="text-[10px] text-muted-foreground">OS</span>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => {
          // User Management is strictly for Super Admin
          if (g.labelKey === 'User Management' && role !== 'super_admin') {
            return null;
          }

          // Hide Client Portal completely for Super Admin and all non-client internal staff
          if (g.labelKey === 'nav.clientPortal' && role !== 'client') {
            return null;
          }

          // If the user is a client, explicitly hide all groups except Dashboard and Client Portal
          if (role === 'client' && g.labelKey !== 'nav.dashboard' && g.labelKey !== 'nav.clientPortal') {
            return null;
          }

          const visible = g.items.filter((i) => {
            if (!i.perm) return true;
            
            // Check if backend specifically passed '*' (super_admin)
            if (user?.permissions?.includes('*')) return true;
            
            // If backend permissions array exists, it is the absolute truth
            if (user?.permissions && Array.isArray(user.permissions)) {
              return user.permissions.includes(i.perm);
            }
            
            // Fallback to frontend role check ONLY if backend permissions array is missing entirely
            return role && roleHas(role, i.perm);
          });
          
          if (visible.length === 0) return null;
          return (
            <SidebarGroup key={g.labelKey}>
              {!collapsed && <SidebarGroupLabel>{t(g.labelKey)}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {visible.map((item) => {
                    const active = pathname === item.to || pathname.startsWith(item.to + "/");
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton asChild isActive={active}>
                          <Link href={item.to} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span>{t(item.labelKey)}</span>}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
