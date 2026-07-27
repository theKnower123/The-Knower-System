import { toast } from 'sonner';
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";

export default function CmsServicesPage() {
  const rows = useCollection("servicesCms");

  return (
    <ResourcePage
      title="Services"
      description="Manage services offered"
      rows={rows}
      newLabel="New Service"
      columns={[
        { key: "title", header: "Title", cell: (r: any) => r.title },
        { key: "slug", header: "Slug", cell: (r: any) => r.slug },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await add("servicesCms", { ...{"isActive":true,"icon":"Code"}, ...v });
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
    />
  );
}