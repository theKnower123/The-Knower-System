import { toast } from 'sonner';
import { ResourcePage } from "@/components/resource-page";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add, remove } from "@/mocks/store";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export default function CmsTestimonialsPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "cms.manage") : false;
  

  const rows = useCollection("testimonials");

  return (
    <ResourcePage
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="testimonials"
      title="Testimonials"
      description="Manage customer reviews"
      rows={rows}
      newLabel="New Testimonial"
      columns={[
        { key: "name", header: "Name", cell: (r: any) => r.name },
        { key: "company", header: "Company", cell: (r: any) => r.company },
        { key: "rating", header: "Rating", cell: (r: any) => r.rating },
        ...(canEdit ? [{
          key: "actions",
          header: "",
          cell: (r: any) => (
            <div className="flex justify-end">
              <ConfirmDeleteButton
                onConfirm={async () => {
                  try {
                    await remove('testimonials', r.id);
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
          onSubmit={async (v) => {
            try {
              await add("testimonials", { ...{"isActive":true,"isFeatured":false,"rating":5}, ...v });
              close();
            } catch (err: any) {
              toast(err.response?.data?.message || "Failed to save testimonial.");
            }
          }}
          fields={[
            { name: "name", label: "Client Name", type: "text" , required: true },
            { name: "company", label: "Company", type: "text"  },
            { name: "position", label: "Position", type: "text"  },
            { name: "content", label: "Review Content", type: "textarea" , required: true },
          ]}
        />
      )}
    />
  );
}