import { toast } from 'sonner';
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";

export default function CmsTestimonialsPage() {
  const rows = useCollection("testimonials");

  return (
    <ResourcePage
      title="Testimonials"
      description="Manage customer reviews"
      rows={rows}
      newLabel="New Testimonial"
      columns={[
        { key: "name", header: "Name", cell: (r: any) => r.name },
        { key: "company", header: "Company", cell: (r: any) => r.company },
        { key: "rating", header: "Rating", cell: (r: any) => r.rating },
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