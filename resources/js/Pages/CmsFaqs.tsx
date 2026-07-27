import { toast } from 'sonner';
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";

export default function CmsFaqsPage() {
  const rows = useCollection("faqs");

  return (
    <ResourcePage
      title="FAQs"
      description="Manage frequently asked questions"
      rows={rows}
      newLabel="New FAQ"
      columns={[
        { key: "question", header: "Question", cell: (r: any) => r.question },
        { key: "category", header: "Category", cell: (r: any) => r.category },
        { key: "is_active", header: "Active", cell: (r: any) => r.isActive ? "Yes" : "No" },
      ]}
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
    />
  );
}