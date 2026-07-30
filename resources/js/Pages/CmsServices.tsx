import { toast } from 'sonner';
import { ResourcePage } from "@/components/resource-page";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add, update, remove } from "@/mocks/store";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export default function CmsServicesPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "cms.manage") : false;
  

  const rows = useCollection("servicesCms");
  const [editingRow, setEditingRow] = useState<any>(null);

  return (
    <ResourcePage
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="servicesCms"
      title="Services"
      description="Manage services offered"
      rows={rows}
      newLabel="New Service"
      columns={[
        { key: "name", header: "Title", cell: (r: any) => r.name || r.title },
        { key: "slug", header: "Slug", cell: (r: any) => r.slug },
        { 
          key: "is_active", 
          header: "Active", 
          cell: (r: any) => (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">No</span>
              <Switch 
                checked={r.isActive} 
                onCheckedChange={async (checked) => {
                  try {
                    await update("servicesCms", r.id, { isActive: checked });
                    toast.success("Active status updated");
                  } catch (e) {
                    toast.error("Failed to update status");
                  }
                }}
              />
              <span className="text-xs text-muted-foreground">Yes</span>
            </div>
          ) 
        },
        {
          key: "actions",
          header: "Actions",
          cell: (r: any) => (
            <div className="flex gap-2 justify-end">
              <button 
                className="text-primary hover:underline text-sm"
                onClick={(e) => { e.stopPropagation(); setEditingRow(r); }}
              >
                Edit
              </button>
              <ConfirmDeleteButton
                onConfirm={async () => {
                  try {
                    await remove('servicesCms', r.id);
                    toast.success('Deleted successfully.');
                  } catch (err) {
                    toast.error('Failed to delete.');
                  }
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              />
            </div>
          )
        }
      ]}
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              const payload = { ...{"isActive":true,"icon":"Code"}, ...v };
              if (payload.title) {
                payload.name = payload.title;
                delete payload.title;
              }
              await add("servicesCms", payload);
              close();
            } catch (err: any) {
              toast(err.response?.data?.message || "Failed to save service.");
            }
          }}
          fields={[
            { name: "title", label: "Title", type: "text" , required: true },
            { name: "slug", label: "Slug", type: "text" , required: true },
            { name: "description", label: "Description", type: "textarea" , required: true },
          ]}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            title: row.name || row.title,
            slug: row.slug,
            description: row.description || "",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            if (!v.title) return toast.error("Title is required");
            if (!v.slug) return toast.error("Slug is required");
            try {
              const payload = { ...v };
              if (payload.title) {
                payload.name = payload.title;
                delete payload.title;
              }
              await update("servicesCms", row.id, payload);
              toast.success("Updated successfully.");
              close();
            } catch (err: any) {
              toast.error(err.response?.data?.message || "Failed to update service.");
            }
          }}
          fields={[
            { name: "title", label: "Title", type: "text" , required: true },
            { name: "slug", label: "Slug", type: "text" , required: true },
            { name: "description", label: "Description", type: "textarea" , required: true },
          ]}
        />
      )}
    />
  );
}