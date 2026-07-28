import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { useCollection, add, update, remove } from "@/mocks/store";
import { makeId, type Meeting } from "@/mocks/data";
import { shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import type { FilterDef } from "@/components/data-table";
export default function MeetingsPage() {
  const { t } = useTranslation();
  const rows = useCollection("meetings");
  const clients = useCollection("clients");
  const { user } = useAuth();

  const [editingRow, setEditingRow] = useState<Meeting | null>(null);
  const canEdit = ["super_admin", "ceo", "project_manager", "team_leader", "hr"].includes(user?.role || "");

  const formFields: FieldDef[] = [
    { name: "title", label: t("common.fields.title") || "Title", type: "text", required: true },
    { name: "clientId", label: t("common.fields.client") || "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })) },
    { name: "date", label: t("common.fields.dateAndTime") || "Date & Time", type: "date" },
    { name: "duration", label: t("common.fields.duration") || "Duration (min)", type: "number", defaultValue: 30 },
    { name: "location", label: t("common.fields.location") || "Location (Link or Address)", type: "text" },
  ];

  return (
    <ResourcePage<Meeting>
      collectionKey="meetings"
      title={t("nav.meetings")}
      description="Scheduled calls & workshops"
      rows={rows}
      newLabel="New meeting"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      getSearchable={(r) => `${r.title} ${clients.find((c: any) => c.id === (r as any).clientId)?.name || ""} ${(r as any).location || ""}`}
      filters={[
        {
          key: "client",
          label: "Client",
          options: clients.map((c) => ({ value: c.id as string, label: c.name })),
          accessor: (row: any) => row.clientId || row.client_id || "",
        },
      ] as FilterDef[]}
      columns={[
        { key: "title", header: t("common.title"), cell: (r) => <span className="font-medium">{r.title}</span> },
        { key: "client", header: "Client", cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? "—" },
        { key: "date", header: t("common.date"), cell: (r) => shortDate((r as any).startTime) },
        { key: "location", header: "Location / Link", cell: (r) => (r as any).location ? ((r as any).location.startsWith('http') ? <a href={(r as any).location} target="_blank" className="text-blue-500 underline">Join</a> : (r as any).location) : "—" },
        {
          key: "actions",
          header: t("common.actions") || "Actions",
          cell: (r) => (
            <div className="flex gap-2 justify-end">
              {canEdit && (
                <>
                  <button
                    className="text-primary hover:underline text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingRow(r);
                    }}
                  >
                    {t("common.edit")}
                  </button>
                  <ConfirmDeleteButton
                    onConfirm={async () => {
                      try {
                        await remove('meetings', r.id);
                        toast('Meeting deleted successfully.');
                      } catch (err) {
                        toast('Failed to delete meeting.');
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  />
                </>
              )}
            </div>
          )
        },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              const start = v.date ? new Date(v.date) : new Date();
              const end = new Date(start.getTime() + Number(v.duration || 30) * 60000);
              
              await add("meetings", {
                id: makeId("mt"),
                title: v.title,
                clientId: v.clientId,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                location: v.location,
                description: v.description || '',
              });
              close();
            } catch (err: any) {
              toast("Failed to save meeting");
            }
          }}
          fields={formFields}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            title: row.title,
            clientId: (row as any).clientId || (row as any).client_id,
            date: (row as any).startTime ? new Date((row as any).startTime).toISOString().split("T")[0] : "",
            duration: (row as any).startTime && (row as any).endTime 
              ? Math.round((new Date((row as any).endTime).getTime() - new Date((row as any).startTime).getTime()) / 60000) 
              : 30,
            location: (row as any).location || "",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            try {
              const start = v.date ? new Date(v.date) : new Date();
              const end = new Date(start.getTime() + Number(v.duration || 30) * 60000);
              
              await update("meetings", row.id, { 
                ...row, 
                ...v,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
              });
              toast("Meeting updated successfully.");
              close();
            } catch (err: any) {
              toast("Failed to update meeting.");
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
