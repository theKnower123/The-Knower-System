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
    labelKey: "nav.crm",
    items: [
      { to: "/crm/leads", labelKey: "nav.leads", icon: UserSquare2, perm: "lead.manage" },
      { to: "/crm/clients", labelKey: "nav.clients", icon: Users, perm: "client.manage" },
      { to: "/crm/meetings", labelKey: "nav.meetings", icon: Video, perm: "crm.view" },
      { to: "/crm/quotations", labelKey: "nav.quotations", icon: FileText, perm: "quotation.manage" },
      { to: "/crm/contracts", labelKey: "nav.contracts", icon: Handshake, perm: "contract.manage" },
    ],
  },
  {
    labelKey: "nav.projects",
    items: [
      { to: "/projects", labelKey: "nav.projects", icon: FolderKanban, perm: "project.view" },
      { to: "/tasks", labelKey: "nav.tasks", icon: ListTodo, perm: "task.view" },
      { to: "/bugs", labelKey: "nav.bugs", icon: Bug, perm: "bug.manage" },
      { to: "/calendar", labelKey: "Calendar", icon: Calendar, perm: "project.view" },
      { to: "/time-logs", labelKey: "Time Tracking", icon: Clock, perm: "project.view" },
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
    ],
  },
  {
    labelKey: "nav.support",
    items: [{ to: "/support/tickets", labelKey: "nav.tickets", icon: Ticket, perm: "support.view" }],
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
    items: [{ to: "/portal", labelKey: "nav.clientPortal", icon: Trophy, perm: "client_portal.view" }],
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
          const visible = g.items.filter((i) => !i.perm || (role && roleHas(role, i.perm)));
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
