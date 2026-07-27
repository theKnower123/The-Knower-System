import { toast } from 'sonner';
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";

export default function CmsBlogPage() {
  const rows = useCollection("blogPosts");

  return (
    <ResourcePage
      title="Blog Posts"
      description="Manage company blog"
      rows={rows}
      newLabel="New Post"
      columns={[
        { key: "title", header: "Title", cell: (r: any) => r.title },
        { key: "author_name", header: "Author", cell: (r: any) => r.authorName },
        { key: "is_published", header: "Published", cell: (r: any) => r.isPublished ? "Yes" : "No" },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await add("blogPosts", { ...{"isPublished":true,"authorName":"Admin"}, ...v });
              close();
            } catch (err: any) {
              toast(err.response?.data?.message || "Failed to save post.");
            }
          }}
          fields={[
            { name: "title", label: "Title", type: "text" , required: true },
            { name: "slug", label: "Slug", type: "text" , required: true },
            { name: "excerpt", label: "Excerpt", type: "textarea"  },
            { name: "content", label: "Content", type: "textarea" , required: true },
          ]}
        />
      )}
    />
  );
}