import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit,
  Trash2,
  RotateCcw,
  ShieldCheck,
  Building2,
  Briefcase,
  FolderKanban,
  FileText,
  CreditCard,
  LifeBuoy,
  ChevronRight,
  Eye,
  Check,
  AlertCircle,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Lock,
  UserCheck,
  UserX,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { StaggerList } from "@/components/animations/StaggerList";
import { ALL_ROLES, ROLE_LABELS, type Role } from "@/lib/permissions";
import { ConfirmDialog, type ConfirmDialogState } from "@/components/confirm-dialog";
import { UserInspectModal } from "@/components/user-inspect-modal";
import { ExcelUserImportModal } from "@/components/excel-user-import-modal";

// ─── Interfaces ───
interface UserRecord {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  user_type_label: string;
  avatar?: string;
  avatar_url?: string;
  is_frozen: boolean;
  deleted_at?: string;
  created_at?: string;
  last_login_at?: string;
  client?: {
    id: number;
    name: string;
    position?: string;
    phone?: string;
  };
  employee?: {
    id: number;
    department: string;
    position: string;
    salary?: number;
    hire_date?: string;
    id_number?: string;
  };
}

interface UserCounts {
  total: number;
  active: number;
  frozen: number;
  super_admins: number;
  admins: number;
  employees: number;
  clients: number;
}

interface ExcelImportRow {
  row_number: number;
  name: string;
  email: string;
  role: string;
  password?: string;
  phone?: string;
  company_name?: string;
  department?: string;
  position?: string;
  salary?: string;
  status: "valid" | "invalid";
  errors: string[];
}

export default function UserManagementPage() {
  const { t } = useTranslation();

  // State Management
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [counts, setCounts] = useState<UserCounts>({
    total: 0,
    active: 0,
    frozen: 0,
    super_admins: 0,
    admins: 0,
    employees: 0,
    clients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Drawer / Modals
  const [inspectUser, setInspectUser] = useState<UserRecord | null>(null);
  const [inspectExtra, setInspectExtra] = useState<any>(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer" as string,
    phone: "",
    company_name: "",
    department: "",
    position: "",
    salary: "",
    hire_date: "",
    id_number: "",
  });

  // Excel Modal State
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelDefaultRole, setExcelDefaultRole] = useState("client");
  const [excelParsedRows, setExcelParsedRows] = useState<ExcelImportRow[]>([]);
  const [excelSummary, setExcelSummary] = useState<{ total: number; valid: number; invalid: number } | null>(null);
  const [excelValidating, setExcelValidating] = useState(false);
  const [excelImporting, setExcelImporting] = useState(false);

  // Confirm Dialog UI state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Fetch Users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/admin/users", {
        params: {
          search,
          role: roleFilter,
          status: statusFilter,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data.data || res.data.data);
        if (res.data.counts) {
          setCounts(res.data.counts);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter]);

  // Handle single view details
  const handleViewUser = async (u: UserRecord) => {
    setInspectUser(u);
    setInspectLoading(true);
    try {
      const res = await axios.get(`/api/v1/admin/users/${u.id}`);
      if (res.data.success) {
        setInspectUser(res.data.data);
        setInspectExtra(res.data.extra);
      }
    } catch (err: any) {
      toast.error("Failed to load user details");
    } finally {
      setInspectLoading(false);
    }
  };

  // Select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(users.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Bulk Actions with custom Confirm Dialog & User Avatars
  const handleBulkAction = (action: "trash" | "restore" | "delete") => {
    if (selectedIds.length === 0) return;

    const configs = {
      trash: {
        title: "Bulk Freeze Accounts",
        description: `Are you sure you want to freeze ${selectedIds.length} selected accounts and move them to Trash? They will be blocked from logging into the system.`,
        confirmText: "Freeze Selected",
        variant: "warning" as const,
        icon: "userX" as const,
      },
      restore: {
        title: "Bulk Restore Accounts",
        description: `Are you sure you want to restore ${selectedIds.length} selected accounts from Trash? They will regain active access.`,
        confirmText: "Restore Selected",
        variant: "success" as const,
        icon: "restore" as const,
      },
      delete: {
        title: "Bulk Permanent Delete",
        description: `CAUTION: Are you sure you want to PERMANENTLY delete ${selectedIds.length} selected users? This action is irreversible.`,
        confirmText: "Delete Permanently",
        variant: "destructive" as const,
        icon: "trash" as const,
      },
    };

    const cfg = configs[action];

    const selectedUserObjects = users
      .filter((u) => selectedIds.includes(u.id))
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        role: u.user_type_label || u.role,
      }));

    setConfirmDialog({
      isOpen: true,
      title: cfg.title,
      description: cfg.description,
      confirmText: cfg.confirmText,
      variant: cfg.variant,
      icon: cfg.icon,
      usersList: selectedUserObjects,
      onConfirm: async () => {
        try {
          const res = await axios.post("/api/v1/admin/users/bulk-action", {
            action,
            ids: selectedIds,
          });
          if (res.data.success) {
            toast.success(res.data.message);
            setSelectedIds([]);
            fetchUsers();
          }
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Bulk action failed");
        }
      },
    });
  };

  // Handle Single Delete / Freeze with custom Confirm Dialog
  const handleToggleFreeze = (u: UserRecord) => {
    const singleUserList = [{
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      role: u.user_type_label || u.role,
    }];

    if (u.is_frozen) {
      // Restore confirmation
      setConfirmDialog({
        isOpen: true,
        title: `Restore Account: ${u.name}`,
        description: `Are you sure you want to restore '${u.name}'? This user account will be reactivated and permitted to log in.`,
        confirmText: "Restore Account",
        variant: "success",
        icon: "restore",
        usersList: singleUserList,
        onConfirm: async () => {
          try {
            const res = await axios.post(`/api/v1/admin/users/${u.id}/restore`);
            if (res.data.success) {
              toast.success(res.data.message);
              fetchUsers();
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to restore user");
          }
        },
      });
    } else {
      // Move to Trash (Freeze) confirmation
      setConfirmDialog({
        isOpen: true,
        title: `Freeze Account: ${u.name}`,
        description: `Are you sure you want to freeze '${u.name}'? The account will be moved to Trash and blocked from logging in.`,
        confirmText: "Freeze Account",
        variant: "warning",
        icon: "userX",
        usersList: singleUserList,
        onConfirm: async () => {
          try {
            const res = await axios.delete(`/api/v1/admin/users/${u.id}`);
            if (res.data.success) {
              toast.success(res.data.message);
              fetchUsers();
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to freeze account");
          }
        },
      });
    }
  };

  // Permanent Delete with custom Confirm Dialog
  const handleForceDelete = (u: UserRecord) => {
    setConfirmDialog({
      isOpen: true,
      title: `Permanently Delete User: ${u.name}`,
      description: `CAUTION: Are you sure you want to PERMANENTLY delete '${u.name}'? This action cannot be undone and will purge all profile data.`,
      confirmText: "Permanently Delete",
      variant: "destructive",
      icon: "trash",
      usersList: [{
        id: u.id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        role: u.user_type_label || u.role,
      }],
      onConfirm: async () => {
        try {
          const res = await axios.delete(`/api/v1/admin/users/${u.id}/force`);
          if (res.data.success) {
            toast.success(res.data.message);
            fetchUsers();
          }
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Failed to permanently delete user");
        }
      },
    });
  };

  // Open Edit Modal
  const handleOpenEdit = (u: UserRecord) => {
    setEditUser(u);
    setFormData({
      name: u.name || "",
      email: u.email || "",
      password: "",
      role: u.role || "developer",
      phone: u.phone || "",
      company_name: u.client?.name || "",
      department: u.employee?.department || "",
      position: u.client?.position || u.employee?.position || "",
      salary: u.employee?.salary ? String(u.employee.salary) : "",
      hire_date: u.employee?.hire_date || "",
      id_number: u.employee?.id_number || "",
    });
  };

  // Submit Save/Edit User
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editUser) {
        // Update
        const res = await axios.put(`/api/v1/admin/users/${editUser.id}`, formData);
        if (res.data.success) {
          toast.success("User profile updated successfully!");
          setEditUser(null);
          fetchUsers();
        }
      } else {
        // Create
        const res = await axios.post("/api/v1/admin/users", formData);
        if (res.data.success) {
          toast.success("New user created successfully!");
          setIsAddModalOpen(false);
          fetchUsers();
        }
      }
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const msg = Object.values(errors).flat().join(" ");
        toast.error(msg);
      } else {
        toast.error(err.response?.data?.message || "Failed to save user");
      }
    }
  };

  // ── Excel Handlers ──
  const handleDownloadTemplate = () => {
    window.location.href = "/api/v1/admin/users/excel-template";
  };

  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setExcelFile(file);
      validateExcelFile(file, excelDefaultRole);
    }
  };

  const validateExcelFile = async (file: File, defaultRole: string) => {
    setExcelValidating(true);
    const body = new FormData();
    body.append("file", file);
    body.append("default_role", defaultRole);
    body.append("execute", "false");

    try {
      const res = await axios.post("/api/v1/admin/users/import-excel", body);
      if (res.data.success) {
        setExcelParsedRows(res.data.rows);
        setExcelSummary({
          total: res.data.total_rows,
          valid: res.data.valid_count,
          invalid: res.data.error_count,
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to validate Excel file");
    } finally {
      setExcelValidating(false);
    }
  };

  const handleExecuteExcelImport = async () => {
    if (!excelFile && excelParsedRows.length === 0) return;
    setExcelImporting(true);

    try {
      let res;
      if (excelFile) {
        const body = new FormData();
        body.append("file", excelFile);
        body.append("default_role", excelDefaultRole);
        body.append("execute", "true");
        res = await axios.post("/api/v1/admin/users/import-excel", body);
      } else {
        res = await axios.post("/api/v1/admin/users/import-excel", {
          rows: excelParsedRows,
          default_role: excelDefaultRole,
          execute: true,
        });
      }

      if (res.data.success) {
        toast.success(res.data.message);
        setIsExcelModalOpen(false);
        setExcelFile(null);
        setExcelParsedRows([]);
        setExcelSummary(null);
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Excel import failed");
    } finally {
      setExcelImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Centralized User Management"
        description="Super Admin Command Center — Control all system users, roles, client accounts, employee profiles, and bulk Excel operations."
      />

      {/* Summary Stat Cards */}
      <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5" staggerDelay={0.04}>
        <StatCard label="Total Users" value={counts.total} icon={Users} accent="primary" />
        <StatCard label="Super Admins & Admins" value={counts.super_admins + counts.admins} icon={ShieldCheck} accent="success" />
        <StatCard label="Employees & Staff" value={counts.employees} icon={Briefcase} />
        <StatCard label="Client Accounts" value={counts.clients} icon={Building2} />
        <StatCard label="Frozen (Trashed)" value={counts.frozen} icon={UserX} accent="destructive" />
      </StaggerList>

      {/* Control & Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* Instant Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Instant search by name, email, phone, role, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-background/60 border-border/80 focus-visible:ring-primary"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[170px] h-10 rounded-xl bg-background/60">
              <SelectValue placeholder="All User Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All User Types</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="administrator">Administrator</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="developer">Software Developer</SelectItem>
              <SelectItem value="designer">UI/UX Designer</SelectItem>
              <SelectItem value="qa">QA Tester</SelectItem>
              <SelectItem value="project_manager">Project Manager</SelectItem>
              <SelectItem value="hr">HR Manager</SelectItem>
              <SelectItem value="support">Support Agent</SelectItem>
              <SelectItem value="sales">Sales Representative</SelectItem>
              <SelectItem value="accountant">Accountant</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-10 rounded-xl bg-background/60">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="frozen">Frozen / Trashed</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Users from Excel Button */}
          <Button
            onClick={() => setIsExcelModalOpen(true)}
            className="h-10 px-4 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Add Users from Excel
          </Button>

          {/* Create User Button */}
          <Button
            onClick={() => {
              setEditUser(null);
              setFormData({
                name: "",
                email: "",
                password: "",
                role: "developer",
                phone: "",
                company_name: "",
                department: "",
                position: "",
                salary: "",
                hire_date: "",
                id_number: "",
              });
              setIsAddModalOpen(true);
            }}
            variant="outline"
            className="h-10 px-4 rounded-xl font-semibold border-border hover:bg-accent flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4 text-primary" />
            Add Single User
          </Button>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between rounded-2xl border border-primary/40 bg-primary/10 p-4 shadow-lg backdrop-blur-md"
          >
            <div className="flex items-center gap-3 font-semibold text-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                {selectedIds.length}
              </span>
              <span>Users Selected</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("trash")}
                className="h-8 rounded-lg text-amber-600 border-amber-500/40 hover:bg-amber-500/10 font-semibold"
              >
                <UserX className="h-3.5 w-3.5 mr-1.5" />
                Bulk Freeze / Move to Trash
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("restore")}
                className="h-8 rounded-lg text-emerald-600 border-emerald-500/40 hover:bg-emerald-500/10 font-semibold"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Bulk Restore
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction("delete")}
                className="h-8 rounded-lg font-semibold"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Bulk Delete
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Users Table */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/60 bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4 w-10">
                  <Checkbox
                    checked={users.length > 0 && selectedIds.length === users.length}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  />
                </th>
                <th className="p-4">User Info</th>
                <th className="p-4">User Type / Role</th>
                <th className="p-4">Type-Specific Context</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelected = selectedIds.includes(u.id);
                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors hover:bg-muted/30 ${
                        u.is_frozen ? "bg-red-500/5 hover:bg-red-500/10" : ""
                      } ${isSelected ? "bg-primary/5" : ""}`}
                    >
                      {/* Checkbox */}
                      <td className="p-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectOne(u.id, !!checked)}
                        />
                      </td>

                      {/* User Info (Avatar, Name, Email, Phone) */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {u.avatar_url ? (
                              <img src={u.avatar_url} alt={u.name} className="h-full w-full rounded-full object-cover" />
                            ) : (
                              u.name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-foreground flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {u.role === "super_admin" && (
                                <span title="Super Admin">
                                  <ShieldCheck className="h-4 w-4 text-amber-500" />
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <span>{u.email}</span>
                              {u.phone && <span className="font-mono">{u.phone}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* User Type / Role Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            u.role === "super_admin"
                              ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                              : u.role === "administrator" || u.role === "admin"
                              ? "bg-purple-500/15 text-purple-600 border border-purple-500/30"
                              : u.role === "client"
                              ? "bg-blue-500/15 text-blue-600 border border-blue-500/30"
                              : "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                          }`}
                        >
                          {u.user_type_label}
                        </span>
                      </td>

                      {/* Type-Specific Context */}
                      <td className="p-4 text-xs text-muted-foreground">
                        {u.role === "client" && u.client ? (
                          <div>
                            <span className="font-semibold text-foreground">{u.client.name}</span>
                            <span className="block text-[11px]">{u.client.position || "Client"}</span>
                          </div>
                        ) : u.employee ? (
                          <div>
                            <span className="font-semibold text-foreground">{u.employee.department}</span>
                            <span className="block text-[11px]">{u.employee.position}</span>
                          </div>
                        ) : (
                          <span className="italic">System Administrative</span>
                        )}
                      </td>

                      {/* Account Status Badge */}
                      <td className="p-4">
                        {u.is_frozen ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-destructive/15 text-destructive border border-destructive/30">
                            <UserX className="h-3 w-3" /> Frozen (Trashed)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                            <UserCheck className="h-3 w-3" /> Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewUser(u)}
                            className="h-8 px-2 text-primary hover:bg-primary/10"
                            title="View Detailed Info"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenEdit(u)}
                            className="h-8 px-2 text-foreground hover:bg-muted"
                            title="Edit User Profile"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleFreeze(u)}
                            className={`h-8 px-2 ${
                              u.is_frozen
                                ? "text-emerald-600 hover:bg-emerald-500/10"
                                : "text-amber-600 hover:bg-amber-500/10"
                            }`}
                            title={u.is_frozen ? "Restore Account" : "Freeze Account (Trash)"}
                          >
                            {u.is_frozen ? <RotateCcw className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleForceDelete(u)}
                            className="h-8 px-2 text-destructive hover:bg-destructive/10"
                            title="Permanently Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CREATE / EDIT USER MODAL ── */}
      <Dialog open={isAddModalOpen || !!editUser} onOpenChange={() => { setIsAddModalOpen(false); setEditUser(null); }}>
        <DialogContent className="max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editUser ? `Edit User: ${editUser.name}` : "Add New System User"}</DialogTitle>
            <DialogDescription>
              Specify user credentials, role, and type-specific context fields.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveUser} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Connor"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">User Type / Role *</Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                  <SelectTrigger id="role" className="rounded-xl">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {ROLE_LABELS[r] || r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{editUser ? "New Password (Optional)" : "Password *"}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required={!editUser}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-0199"
              />
            </div>

            {/* Type Specific Fields */}
            {formData.role === "client" ? (
              <div className="space-y-2 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Client Account Details</div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <Label htmlFor="company_name" className="text-xs">Company Name</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="position" className="text-xs">Position / Title</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="CEO / Representative"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Employee Profile Details</div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <Label htmlFor="department" className="text-xs">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="Engineering / Sales / HR"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position" className="text-xs">Job Title</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Senior Fullstack Dev"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary" className="text-xs">Monthly Salary ($)</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="7500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="id_number" className="text-xs">National ID / Passport</Label>
                    <Input
                      id="id_number"
                      value={formData.id_number}
                      onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                      placeholder="ID-99201"
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => { setIsAddModalOpen(false); setEditUser(null); }}>
                Cancel
              </Button>
              <Button type="submit" className="font-bold">
                {editUser ? "Save Changes" : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── ADVANCED USER-TYPE SPECIFIC EXCEL IMPORT WIZARD ── */}
      <ExcelUserImportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onSuccess={() => {
          fetchUsers();
        }}
      />

      {/* ── COMPREHENSIVE USER DETAILS MODAL ── */}
      <UserInspectModal
        isOpen={!!inspectUser}
        onClose={() => setInspectUser(null)}
        user={inspectUser}
        extraData={inspectExtra}
        loading={inspectLoading}
        onEdit={(u) => {
          setInspectUser(null);
          handleOpenEdit(u);
        }}
        onToggleFreeze={(u) => {
          setInspectUser(null);
          handleToggleFreeze(u);
        }}
        onForceDelete={(u) => {
          setInspectUser(null);
          handleForceDelete(u);
        }}
      />

      {/* ── RICH CONFIRMATION ALERT DIALOG ── */}
      <ConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
