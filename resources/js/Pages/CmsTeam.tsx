import { useMemo, useState } from "react";
import { useCollection } from "@/mocks/store";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { StaggerList } from "@/components/animations/StaggerList";
import { Input } from "@/components/ui/input";
import { Search, Users, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Map role keys to human-readable category names
const ROLE_CATEGORY: Record<string, string> = {
  super_admin:     "🛡️ Admins",
  ceo:             "🏆 Leadership",
  project_manager: "📋 Project Management",
  team_leader:     "⭐ Team Leaders",
  developer:       "💻 Developers",
  designer:        "🎨 Designers",
  qa:              "🔍 QA & Testing",
  accountant:      "💰 Finance & Accounting",
  hr:              "👥 Human Resources",
  support:         "🎧 Support",
  sales:           "📈 Sales",
  client:          "🤝 Clients",
};

// Priority order for categories
const CATEGORY_ORDER = [
  "🏆 Leadership",
  "🛡️ Admins",
  "📋 Project Management",
  "⭐ Team Leaders",
  "💻 Developers",
  "🎨 Designers",
  "🔍 QA & Testing",
  "💰 Finance & Accounting",
  "👥 Human Resources",
  "🎧 Support",
  "📈 Sales",
  "🤝 Clients",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-pink-500 to-rose-600",
    "from-indigo-500 to-blue-600",
    "from-cyan-500 to-sky-600",
    "from-fuchsia-500 to-violet-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

function EmployeeCard({ employee }: { employee: any }) {
  const initials = getInitials(employee.name || "?");
  const avatarColor = getAvatarColor(employee.name || "");

  return (
    <div className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-5 text-center shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5">
      {/* Avatar */}
      <div className={cn(
        "relative h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-md",
        avatarColor
      )}>
        {employee.id_photo || employee.idPhoto ? (
          <img
            src={employee.id_photo || employee.idPhoto}
            alt={employee.name}
            className="h-full w-full rounded-2xl object-cover"
          />
        ) : (
          <span className="text-xl font-bold text-white">{initials}</span>
        )}
        {/* Online indicator */}
        <span className={cn(
          "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background",
          employee.status === "active" ? "bg-emerald-500" :
          employee.status === "on_leave" ? "bg-amber-500" : "bg-zinc-400"
        )} />
      </div>

      {/* Info */}
      <div className="space-y-1 w-full min-w-0">
        <p className="font-semibold text-sm leading-tight truncate">{employee.name}</p>
        <p className="text-xs text-muted-foreground truncate">{employee.position || employee.role || "—"}</p>
        {employee.department && (
          <p className="text-[10px] text-primary/70 truncate">{employee.department}</p>
        )}
      </div>

      {/* Status */}
      <StatusBadge value={employee.status || "active"} />

      {/* Email on hover */}
      <div className="absolute inset-x-0 bottom-0 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 px-3 pb-2">
        <p className="text-[10px] text-muted-foreground truncate">{employee.email}</p>
      </div>
    </div>
  );
}

function CategorySection({ category, employees }: { category: string; employees: any[] }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="space-y-3">
      {/* Category header */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-border/40 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-3">
          <h2 className="font-display font-bold text-base text-foreground">{category}</h2>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {employees.length} {employees.length === 1 ? "member" : "members"}
          </span>
        </div>
        {collapsed
          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
          : <ChevronUp className="h-4 w-4 text-muted-foreground" />
        }
      </button>

      {/* Cards grid */}
      {!collapsed && (
        <StaggerList
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          staggerDelay={0.04}
        >
          {employees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))}
        </StaggerList>
      )}
    </div>
  );
}

export default function CmsTeamPage() {
  const employees = useCollection("employees");
  const [search, setSearch] = useState("");

  // Filter by search
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return employees as any[];
    return (employees as any[]).filter(
      (e) =>
        e.name?.toLowerCase().includes(q) ||
        e.position?.toLowerCase().includes(q) ||
        e.role?.toLowerCase().includes(q) ||
        e.department?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q)
    );
  }, [employees, search]);

  // Group by role → category
  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const emp of filtered) {
      const roleKey = (emp.role || "").toLowerCase();
      const cat = ROLE_CATEGORY[roleKey] || `🏢 ${emp.department || "Other"}`;
      if (!map[cat]) map[cat] = [];
      map[cat].push(emp);
    }

    // Sort categories by priority
    return Object.entries(map).sort(([a], [b]) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [filtered]);

  const total = (employees as any[]).length;
  const active = (employees as any[]).filter((e) => e.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Members"
        description={`${total} members across ${grouped.length} categories`}
        actions={
          <div className="flex items-center gap-2">
            {/* Stats chips */}
            <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {active} Active
            </span>
            <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              <Users className="h-3 w-3" />
              {total} Total
            </span>
          </div>
        }
      />

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="ps-9"
          placeholder="Search by name, role, department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Empty state */}
      {grouped.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20 text-center text-muted-foreground">
          <Users className="mb-3 h-10 w-10 opacity-30" />
          <p className="font-medium">No team members found</p>
          <p className="text-sm">Try a different search term or add employees first</p>
        </div>
      )}

      {/* Category sections */}
      <div className="space-y-6">
        {grouped.map(([category, members]) => (
          <CategorySection key={category} category={category} employees={members} />
        ))}
      </div>
    </div>
  );
}