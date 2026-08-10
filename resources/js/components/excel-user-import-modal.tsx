import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  RefreshCcw,
  User,
  Building2,
  Briefcase,
  Shield,
  FileText,
  Check,
  Info,
  Sparkles,
} from "lucide-react";

interface ExcelUserImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExcelUserImportModal({
  isOpen,
  onClose,
  onSuccess,
}: ExcelUserImportModalProps) {
  // Stepper State: 1 = Choose Type, 2 = Upload, 3 = Review, 4 = Confirm, 5 = Complete
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Configuration & Data States
  const [selectedUserType, setSelectedUserType] = useState<string>("client");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Parsed Rows & Validation States
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Editing Row State
  const [editingRow, setEditingRow] = useState<any | null>(null);

  // Import Final Execution Results State
  const [executionResults, setExecutionResults] = useState<any | null>(null);

  if (!isOpen) return null;

  // Calculate live statistics
  const totalCount = parsedRows.length;
  const validCount = parsedRows.filter((r) => !r.is_skipped && r.status === "valid").length;
  const warningCount = parsedRows.filter((r) => !r.is_skipped && r.status === "warning").length;
  const errorCount = parsedRows.filter((r) => !r.is_skipped && r.status === "error").length;
  const skippedCount = parsedRows.filter((r) => r.is_skipped).length;
  const readyToImportCount = validCount + warningCount;

  // User type labels mapping
  const userTypeLabels: Record<string, string> = {
    client: "Client Portal User",
    employee: "Employee / Staff Member",
    developer: "Software Developer",
    admin: "Administrator",
    super_admin: "Super Admin",
  };

  // Download template endpoint for selected user type
  const handleDownloadTemplate = () => {
    window.location.href = `/api/v1/admin/users/excel-template?user_type=${selectedUserType}`;
  };

  // Step 2: Upload & Parse File
  const handleParseFile = async () => {
    if (!file) {
      toast.error("Please select an Excel or CSV file to upload.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_type", selectedUserType);

      const res = await axios.post("/api/v1/admin/users/parse-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        setParsedRows(res.data.rows || []);
        setCurrentIndex(0);
        setStep(3);
        toast.success(`Successfully parsed ${res.data.total_rows} user records for review.`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to parse Excel file.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle skip on a row
  const handleToggleSkip = (index: number) => {
    const updated = [...parsedRows];
    updated[index].is_skipped = !updated[index].is_skipped;
    setParsedRows(updated);
  };

  // Save row edit & re-validate locally
  const handleSaveRowEdit = () => {
    if (!editingRow) return;

    const updated = [...parsedRows];
    const idx = updated.findIndex((r) => r.id === editingRow.id);
    if (idx !== -1) {
      // Re-validate required fields
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!editingRow.name.trim()) errors.push("Full Name is required.");
      if (!editingRow.email.trim()) {
        errors.push("Email address is required.");
      } else if (!filterEmail(editingRow.email)) {
        errors.push("Invalid email format.");
      }

      if (selectedUserType === "client" && !editingRow.company_name?.trim()) {
        warnings.push("Company Name is empty.");
      }
      if (!editingRow.phone?.trim()) warnings.push("Phone number is missing.");

      const newStatus = errors.length > 0 ? "error" : warnings.length > 0 ? "warning" : "valid";

      updated[idx] = {
        ...editingRow,
        status: newStatus,
        errors,
        warnings,
      };

      setParsedRows(updated);
      setEditingRow(null);
      toast.success("User record updated & revalidated.");
    }
  };

  const filterEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Step 4 -> 5: Confirm and execute import
  const handleConfirmImport = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/v1/admin/users/confirm-import", {
        rows: parsedRows,
      });

      if (res.data?.success) {
        setExecutionResults(res.data);
        setStep(5);
        toast.success(`Import complete! ${res.data.created_count} users created.`);
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Import execution failed.");
    } finally {
      setLoading(false);
    }
  };

  // Download Import Audit Report
  const handleDownloadReport = async () => {
    if (!executionResults?.results) return;

    try {
      const res = await axios.post(
        "/api/v1/admin/users/download-import-report",
        { results: executionResults.results },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `user_import_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Failed to download import report.");
    }
  };

  const currentRow = parsedRows[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 rounded-3xl border-border/80 shadow-2xl flex flex-col">
        {/* ── Top Modal Header & Stepper Progress ── */}
        <div className="p-6 bg-slate-900 text-white border-b border-white/10 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black tracking-tight text-white">
                  Bulk User Import Wizard
                </DialogTitle>
                <p className="text-xs text-slate-300">
                  Targeted, user-type-specific template onboarding & interactive preview.
                </p>
              </div>
            </div>

            <Badge variant="outline" className="bg-white/10 text-indigo-200 border-white/20 px-3 py-1 font-bold text-xs">
              Step {step} of 5
            </Badge>
          </div>

          {/* Stepper Bar */}
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-white/10 text-[11px] font-bold text-slate-400">
            {[
              { s: 1, label: "1. Select Type" },
              { s: 2, label: "2. Upload File" },
              { s: 3, label: "3. Review & Edit" },
              { s: 4, label: "4. Confirmation" },
              { s: 5, label: "5. Complete" },
            ].map((item) => (
              <div
                key={item.s}
                className={`py-1.5 px-2 rounded-xl text-center transition-all ${
                  step === item.s
                    ? "bg-indigo-600 text-white font-black shadow-md scale-105"
                    : step > item.s
                    ? "bg-emerald-500/20 text-emerald-300 font-extrabold"
                    : "bg-white/5 text-slate-400"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Scrollable Modal Body ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
          {/* ──────── STEP 1: CHOOSE USER TYPE ──────── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto space-y-1">
                <h3 className="text-lg font-black text-foreground">Select Target User Type</h3>
                <p className="text-xs text-muted-foreground">
                  Choose the specific role or group you wish to import. The generated Excel template will include only the relevant fields required for this user type.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    type: "client",
                    label: "Clients & Portal Users",
                    icon: Building2,
                    color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
                    desc: "Includes Company Name, Contact Phone, Client Position.",
                  },
                  {
                    type: "employee",
                    label: "Employees & Staff",
                    icon: Briefcase,
                    color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
                    desc: "Includes Department, Job Position, Salary, Hire Date, National ID.",
                  },
                  {
                    type: "developer",
                    label: "Software Developers",
                    icon: User,
                    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
                    desc: "Engineering role presets, department assignment, salary.",
                  },
                  {
                    type: "admin",
                    label: "Administrators",
                    icon: Shield,
                    color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
                    desc: "Includes Admin Role designation, Title, privileges.",
                  },
                  {
                    type: "super_admin",
                    label: "Super Admins",
                    icon: Sparkles,
                    color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
                    desc: "Root level account access with full system permissions.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedUserType === item.type;
                  return (
                    <div
                      key={item.type}
                      onClick={() => setSelectedUserType(item.type)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                        isSelected
                          ? "bg-card border-indigo-600 shadow-lg ring-2 ring-indigo-500/30 scale-102"
                          : "bg-card border-border/60 hover:border-indigo-400 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-xl border ${item.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-foreground">{item.label}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ──────── STEP 2: DOWNLOAD TEMPLATE & UPLOAD ──────── */}
          {step === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Template Download Card */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-600" /> Dedicated {userTypeLabels[selectedUserType]} Template
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Download the pre-formatted CSV template tailored exclusively for {selectedUserType} fields.
                  </p>
                </div>
                <Button
                  onClick={handleDownloadTemplate}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs gap-1.5 shrink-0"
                >
                  <Download className="w-4 h-4" /> Download Template
                </Button>
              </div>

              {/* Upload Drop Zone */}
              <div className="p-8 rounded-3xl border-2 border-dashed border-border/80 bg-card text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-base">Upload Filled Excel or CSV File</h4>
                  <p className="text-xs text-muted-foreground">
                    Select your populated CSV or Excel file to begin row-by-row validation.
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls,.txt"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="h-11 text-xs rounded-xl bg-muted/40 cursor-pointer"
                  />
                </div>

                {file && (
                  <div className="text-xs font-bold text-indigo-600 flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" /> Selected File: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ──────── STEP 3: INTERACTIVE REVIEW & EDIT INTERFACE ──────── */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Top Live Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-card border border-border/70 shadow-sm text-xs">
                <div className="p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-center">
                  <div className="text-muted-foreground font-bold uppercase text-[10px]">Total Records</div>
                  <div className="text-lg font-black text-foreground">{totalCount}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="text-emerald-600 font-bold uppercase text-[10px]">Valid 🟢</div>
                  <div className="text-lg font-black text-emerald-600">{validCount}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <div className="text-amber-600 font-bold uppercase text-[10px]">Warnings 🟡</div>
                  <div className="text-lg font-black text-amber-600">{warningCount}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                  <div className="text-rose-600 font-bold uppercase text-[10px]">Errors 🔴</div>
                  <div className="text-lg font-black text-rose-600">{errorCount}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center col-span-2 sm:col-span-1">
                  <div className="text-purple-600 font-bold uppercase text-[10px]">Skipped ⏭️</div>
                  <div className="text-lg font-black text-purple-600">{skippedCount}</div>
                </div>
              </div>

              {/* Inspector View Switcher Header */}
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-muted-foreground">
                  Review Mode: <span className="text-foreground">{viewMode === "card" ? "One-by-One Inspector" : "Full Table View"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={viewMode === "card" ? "default" : "outline"}
                    onClick={() => setViewMode("card")}
                    className="h-8 text-xs font-bold rounded-xl"
                  >
                    Card Inspector
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "table" ? "default" : "outline"}
                    onClick={() => setViewMode("table")}
                    className="h-8 text-xs font-bold rounded-xl"
                  >
                    Table View
                  </Button>
                </div>
              </div>

              {/* CARD INSPECTOR MODE (One by One Review) */}
              {viewMode === "card" && currentRow && (
                <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-md space-y-6">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 font-black text-xs flex items-center justify-center">
                        #{currentRow.row_number}
                      </span>
                      <div>
                        <h4 className="font-black text-base text-foreground">{currentRow.name || "Unnamed Record"}</h4>
                        <div className="text-xs text-muted-foreground">{currentRow.email || "No Email Specified"}</div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {currentRow.is_skipped ? (
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30 px-3 py-1 font-bold">
                          Skipped from Import
                        </Badge>
                      ) : currentRow.status === "valid" ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 px-3 py-1 font-bold">
                          🟢 Valid Record
                        </Badge>
                      ) : currentRow.status === "warning" ? (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 px-3 py-1 font-bold">
                          🟡 Warning Notice
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/30 px-3 py-1 font-bold">
                          🔴 Error Blocked
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Validation Messages Display */}
                  {currentRow.errors?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" /> Validation Blocking Errors:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 font-medium pl-2">
                        {currentRow.errors.map((err: string, i: number) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentRow.warnings?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" /> Non-blocking Warnings:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 font-medium pl-2">
                        {currentRow.warnings.map((w: string, i: number) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Record Field Breakdown Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                      <div className="text-muted-foreground font-semibold">Full Name</div>
                      <div className="font-bold text-foreground mt-0.5">{currentRow.name || "N/A"}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                      <div className="text-muted-foreground font-semibold">Email Address</div>
                      <div className="font-bold text-foreground mt-0.5">{currentRow.email || "N/A"}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                      <div className="text-muted-foreground font-semibold">Phone Number</div>
                      <div className="font-bold text-foreground mt-0.5">{currentRow.phone || "Not Provided"}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                      <div className="text-muted-foreground font-semibold">Role Code</div>
                      <div className="font-bold text-foreground mt-0.5 capitalize">{currentRow.role}</div>
                    </div>

                    {selectedUserType === "client" ? (
                      <>
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                          <div className="text-muted-foreground font-semibold">Company Name</div>
                          <div className="font-bold text-foreground mt-0.5">{currentRow.company_name || "Defaults to Name"}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                          <div className="text-muted-foreground font-semibold">Client Position</div>
                          <div className="font-bold text-foreground mt-0.5">{currentRow.position || "Representative"}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                          <div className="text-muted-foreground font-semibold">Department</div>
                          <div className="font-bold text-foreground mt-0.5">{currentRow.department || "General"}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                          <div className="text-muted-foreground font-semibold">Job Title / Position</div>
                          <div className="font-bold text-foreground mt-0.5">{currentRow.position || "Staff"}</div>
                        </div>
                        {currentRow.salary && (
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                            <div className="text-muted-foreground font-semibold">Salary</div>
                            <div className="font-bold text-foreground mt-0.5">${currentRow.salary}</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Inspector Action Buttons & Stepper Controls */}
                  <div className="flex items-center justify-between border-t border-border/50 pt-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingRow({ ...currentRow })}
                        className="font-bold rounded-xl text-xs gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5 text-indigo-600" /> Edit Record
                      </Button>

                      <Button
                        size="sm"
                        variant={currentRow.is_skipped ? "secondary" : "ghost"}
                        onClick={() => handleToggleSkip(currentIndex)}
                        className={`font-bold rounded-xl text-xs gap-1.5 ${
                          currentRow.is_skipped ? "bg-purple-500/20 text-purple-600" : "text-slate-500"
                        }`}
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                        {currentRow.is_skipped ? "Restore to Batch" : "Skip User"}
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground font-semibold">
                        User {currentIndex + 1} of {totalCount}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={currentIndex === 0}
                          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                          className="h-8 w-8 p-0 rounded-xl"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={currentIndex === totalCount - 1}
                          onClick={() => setCurrentIndex((prev) => Math.min(totalCount - 1, prev + 1))}
                          className="h-8 w-8 p-0 rounded-xl"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TABLE VIEW MODE */}
              {viewMode === "table" && (
                <div className="border border-border/70 rounded-2xl overflow-x-auto bg-card">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold border-b border-border/50">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Details</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {parsedRows.map((r, i) => (
                        <tr key={r.id} className={r.is_skipped ? "opacity-50 bg-muted/20" : ""}>
                          <td className="p-3 font-mono font-bold">{r.row_number}</td>
                          <td className="p-3">
                            {r.is_skipped ? (
                              <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-600">Skipped</Badge>
                            ) : r.status === "valid" ? (
                              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600">Valid 🟢</Badge>
                            ) : r.status === "warning" ? (
                              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600">Warning 🟡</Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-600">Error 🔴</Badge>
                            )}
                          </td>
                          <td className="p-3 font-bold">{r.name || "N/A"}</td>
                          <td className="p-3 font-mono">{r.email || "N/A"}</td>
                          <td className="p-3">{r.phone || "—"}</td>
                          <td className="p-3 text-muted-foreground">{r.company_name || r.department || r.position || "—"}</td>
                          <td className="p-3 text-right space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingRow({ ...r })}
                              className="h-7 text-[11px] px-2 rounded-lg font-bold"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleSkip(i)}
                              className="h-7 text-[11px] px-2 rounded-lg font-bold text-purple-600"
                            >
                              {r.is_skipped ? "Restore" : "Skip"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ──────── STEP 4: FINAL CONFIRMATION ──────── */}
          {step === 4 && (
            <div className="space-y-6 max-w-xl mx-auto text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black">Confirm Batch User Creation</h3>
                <p className="text-xs text-muted-foreground">
                  You are ready to commit valid user records to the system database.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-card border border-border/80 text-xs space-y-3 text-left">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-semibold">Total Processed Rows:</span>
                  <span className="font-black text-sm">{totalCount}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-emerald-600 font-bold">Ready to be Created (Valid/Warning):</span>
                  <span className="font-black text-sm text-emerald-600">{readyToImportCount} Users</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-purple-600 font-bold">Skipped by Administrator:</span>
                  <span className="font-black text-sm text-purple-600">{skippedCount} Users</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-rose-600 font-bold">Blocked Error Rows (Excluded):</span>
                  <span className="font-black text-sm text-rose-600">{errorCount} Users</span>
                </div>
              </div>
            </div>
          )}

          {/* ──────── STEP 5: COMPLETE & AUDIT REPORT ──────── */}
          {step === 5 && executionResults && (
            <div className="space-y-6 max-w-xl mx-auto text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-emerald-600">Import Batch Execution Complete</h3>
                <p className="text-xs text-muted-foreground">
                  All valid users have been successfully initialized and assigned roles in system.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-card border border-border/80 text-xs">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="text-emerald-600 font-bold uppercase text-[10px]">✅ Created</div>
                  <div className="text-lg font-black text-emerald-600">{executionResults.created_count}</div>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                  <div className="text-purple-600 font-bold uppercase text-[10px]">⏭️ Skipped</div>
                  <div className="text-lg font-black text-purple-600">{executionResults.skipped_count}</div>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                  <div className="text-rose-600 font-bold uppercase text-[10px]">❌ Failed</div>
                  <div className="text-lg font-black text-rose-600">{executionResults.failed_count}</div>
                </div>
              </div>

              <Button
                onClick={handleDownloadReport}
                variant="outline"
                className="font-bold rounded-xl text-xs gap-2 border-indigo-500/30 text-indigo-600 hover:bg-indigo-500/10"
              >
                <Download className="w-4 h-4" /> Download Import Audit Report CSV
              </Button>
            </div>
          )}
        </div>

        {/* ── Bottom Footer Controls ── */}
        <div className="p-4 bg-card border-t border-border/60 flex items-center justify-between shrink-0">
          <div>
            {step > 1 && step < 5 && (
              <Button
                variant="outline"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="font-bold rounded-xl text-xs gap-1"
                disabled={loading}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step === 1 && (
              <Button
                onClick={() => setStep(2)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs gap-1.5"
              >
                Continue to Upload <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            {step === 2 && (
              <Button
                onClick={handleParseFile}
                disabled={!file || loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs gap-1.5"
              >
                {loading ? "Parsing File..." : "Parse & Review Records"} <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            {step === 3 && (
              <Button
                onClick={() => setStep(4)}
                disabled={readyToImportCount === 0}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs gap-1.5"
              >
                Proceed to Final Confirmation ({readyToImportCount} Ready) <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            {step === 4 && (
              <Button
                onClick={handleConfirmImport}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs gap-1.5 shadow-md"
              >
                {loading ? "Creating Users..." : `Create ${readyToImportCount} Valid Users Now`}
              </Button>
            )}

            {step === 5 && (
              <Button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs">
                Done & Close Wizard
              </Button>
            )}
          </div>
        </div>
      </DialogContent>

      {/* ── Sub-Modal: Edit Parsed Row ── */}
      {editingRow && (
        <Dialog open={true} onOpenChange={() => setEditingRow(null)}>
          <DialogContent className="max-w-md rounded-3xl p-6 border-border/80 shadow-2xl space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-black">
                <Edit className="w-5 h-5 text-indigo-600" /> Edit Record #{editingRow.row_number}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Full Name *</label>
                <Input
                  value={editingRow.name}
                  onChange={(e) => setEditingRow({ ...editingRow, name: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Email Address *</label>
                <Input
                  value={editingRow.email}
                  onChange={(e) => setEditingRow({ ...editingRow, email: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Phone Number</label>
                <Input
                  value={editingRow.phone}
                  onChange={(e) => setEditingRow({ ...editingRow, phone: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              {selectedUserType === "client" ? (
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Company Name</label>
                  <Input
                    value={editingRow.company_name}
                    onChange={(e) => setEditingRow({ ...editingRow, company_name: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Department</label>
                  <Input
                    value={editingRow.department}
                    onChange={(e) => setEditingRow({ ...editingRow, department: e.target.value })}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setEditingRow(null)} className="font-bold rounded-xl text-xs">
                Cancel
              </Button>
              <Button onClick={handleSaveRowEdit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs">
                Save & Revalidate
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
