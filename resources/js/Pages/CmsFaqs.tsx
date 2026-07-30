import { toast } from 'sonner';
import { ResourcePage } from "@/components/resource-page";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add, update, remove } from "@/mocks/store";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export default function CmsFaqsPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "cms.manage") : false;
  

  const rows = useCollection("faqs");
  const [editingRow, setEditingRow] = useState<any>(null);

  return (
    <ResourcePage
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="faqs"
      title="FAQs"
      description="Manage frequently asked questions"
      rows={rows}
      newLabel="New FAQ"
      columns={[
        { key: "question", header: "Question", cell: (r: any) => r.question },
        { key: "category", header: "Category", cell: (r: any) => r.category },
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
                    await update("faqs", r.id, { isActive: checked });
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
                    await remove('faqs', r.id);
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
              await add("faqs", { ...{"isActive":true,"order":0}, ...v });
              close();
            } catch (err: any) {
              toast(err.response?.data?.message || "Failed to save faq.");
            }
          }}
          fields={[
            { name: "question", label: "Question", type: "text" , required: true },
            { name: "answer", label: "Answer", type: "textarea" , required: true },
            { name: "category", label: "Category", type: "text"  },
          ]}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            question: row.question,
            answer: row.answer,
            category: row.category || "",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            if (!v.question) return toast.error("Question is required");
            if (!v.answer) return toast.error("Answer is required");
            try {
              await update("faqs", row.id, v);
              toast.success("Updated successfully.");
              close();
            } catch (err: any) {
              toast.error(err.response?.data?.message || "Failed to update faq.");
            }
          }}
          fields={[
            { name: "question", label: "Question", type: "text" , required: true },
            { name: "answer", label: "Answer", type: "textarea" , required: true },
            { name: "category", label: "Category", type: "text"  },
          ]}
        />
      )}
    />
  );
}