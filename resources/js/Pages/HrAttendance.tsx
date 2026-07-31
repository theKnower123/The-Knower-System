import { useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { QuickForm } from "@/components/quick-form";
import { StatCard } from "@/components/stat-card";
import { StaggerList } from "@/components/animations/StaggerList";
import { useCollection, add, remove } from "@/mocks/store";
import { toast } from 'sonner';
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { makeId, type Attendance } from "@/mocks/data";
import { Clock, CheckCircle2, AlertCircle, Users } from "lucide-react";

export default function AttendancePage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "attendance.manage") : false;

  const { t } = useTranslation();
  const rows = useCollection("attendance");
  const employees = useCollection("employees");

  // Mini Dashboard Calculation
  const stats = useMemo(() => {
    const totalLogs = rows.length;
    const uniqueEmployees = new Set(rows.map((r: any) => String(r.employeeId || r.employee_id))).size;
    
    // Check late check ins (after 09:15)
    const lateCheckIns = rows.filter((r: any) => {
      if (!r.checkIn) return false;
      const timeStr = String(r.checkIn);
      const [h, m] = timeStr.split(":").map(Number);
      return h > 9 || (h === 9 && m > 15);
    }).length;

    const onTimeCheckIns = Math.max(0, totalLogs - lateCheckIns);

    return { totalLogs, uniqueEmployees, onTimeCheckIns, lateCheckIns };
  }, [rows]);

  const dashboardHeader = (
    <StaggerList className="grid grid-cols-2 gap-3 sm:grid-cols-4" staggerDelay={0.05}>
      <StatCard label="Total Attendance Logs" value={stats.totalLogs} icon={Clock} />
      <StatCard label="Active Staff Logged" value={stats.uniqueEmployees} icon={Users} accent="primary" />
      <StatCard label="On-Time Check-ins" value={stats.onTimeCheckIns} icon={CheckCircle2} accent="success" />
      <StatCard label="Late Check-ins" value={stats.lateCheckIns} icon={AlertCircle} accent="warning" />
    </StaggerList>
  );

  return (
    <ResourcePage<Attendance>
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="attendance"
      title={t("nav.attendance")}
      description="Daily check-in / check-out records and time logs"
      rows={rows}
      headerContent={dashboardHeader}
      newLabel="Log attendance"
      columns={[
        { key: "employee", header: "Employee", cell: (r) => employees.find((e) => e.id === r.employeeId)?.name ?? "—" },
        { key: "date", header: t("common.date"), cell: (r) => r.date },
        { key: "in", header: "Check-in", cell: (r) => <span className="font-mono text-xs">{r.checkIn}</span> },
        { key: "out", header: "Check-out", cell: (r) => <span className="font-mono text-xs">{r.checkOut}</span> },
        ...(canEdit ? [{
          key: "actions",
          header: "",
          cell: (r: any) => (
            <div className="flex justify-end">
              <ConfirmDeleteButton
                onConfirm={async () => {
                  try {
                    await remove('attendance', r.id);
                    toast.success('Moved to Trash');
                  } catch (e) {
                    toast.error('Delete failed');
                  }
                }}
              />
            </div>
          )
        }] : [])
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("attendance", {
              id: makeId("at"),
              employeeId: v.employeeId,
              date: v.date || new Date().toISOString().slice(0, 10),
              checkIn: v.checkIn,
              checkOut: v.checkOut,
            });
            close();
          }}
          fields={[
            { name: "employeeId", label: "Employee", type: "select", options: employees.map((e) => ({ value: e.id, label: e.name })), required: true },
            { name: "date", label: "Date", type: "date" },
            { name: "checkIn", label: "Check-in", type: "text", defaultValue: "09:00" },
            { name: "checkOut", label: "Check-out", type: "text", defaultValue: "18:00" },
          ]}
        />
      )}
    />
  );
}
