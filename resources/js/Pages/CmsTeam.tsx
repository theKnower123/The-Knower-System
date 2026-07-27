import { toast } from 'sonner';
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";

export default function CmsTeamPage() {
  const rows = useCollection("teamMembers");

  return (
    <ResourcePage
      title="Team Members"
      description="Manage team directory"
      rows={rows}
      newLabel="New Member"
      columns={[
        { key: "name", header: "Name", cell: (r: any) => r.name },
        { key: "role", header: "Role", cell: (r: any) => r.role },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await add("teamMembers", { ...{"isActive":true,"order":0}, ...v });
              close();
            } catch (err: any) {
              toast(err.response?.data?.message || "Failed to save member.");
            }
          }}
          fields={[
            { name: "name", label: "Name", type: "text" , required: true },
            { name: "role", label: "Role", type: "text" , required: true },
            { name: "bio", label: "Bio", type: "textarea"  },
          ]}
        />
      )}
    />
  );
}