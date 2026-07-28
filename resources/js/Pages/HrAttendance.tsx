import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Attendance } from "@/mocks/data";

export default function AttendancePage() {
  const { t } = useTranslation();
  const rows = useCollection("attendance");
  const employees = useCollection("employees");
  return (
    <ResourcePage<Attendance>
      collectionKey="attendance"
      title={t("nav.attendance")}
      description="Daily check-in / check-out records"
      rows={rows}
      newLabel="Log attendance"
      columns={[
        { key: "employee", header: "Employee", cell: (r) => employees.find((e) => e.id === r.employeeId)?.name ?? "—" },
        { key: "date", header: t("common.date"), cell: (r) => r.date },
        { key: "in", header: "Check-in", cell: (r) => r.checkIn },
        { key: "out", header: "Check-out", cell: (r) => r.checkOut },
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
