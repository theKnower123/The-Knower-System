import { toast } from 'sonner';
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add, update, remove } from "@/mocks/store";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export default function CmsBlogPage() {
  const rows = useCollection("blogPosts");
  const [editingRow, setEditingRow] = useState<any>(null);

  return (
    <ResourcePage
      collectionKey="blogPosts"
      title="Blog Posts"
      description="Manage company blog"
      rows={rows}
      newLabel="New Post"
      columns={[
        { key: "title", header: "Title", cell: (r: any) => r.title },
        { key: "author_name", header: "Author", cell: (r: any) => r.authorName },
        { 
          key: "is_published", 
          header: "Published", 
          cell: (r: any) => (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">No</span>
              <Switch 
                checked={r.isPublished} 
                onCheckedChange={async (checked) => {
                  try {
                    await update("blogPosts", r.id, { isPublished: checked });
                    toast.success("Published status updated");
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
                    await remove('blogPosts', r.id);
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
              const payload = { ...v, isPublished: true, authorName: "Admin" };
              // map content to body
              if (payload.content) {
                payload.body = JSON.stringify(payload.content);
                delete payload.content;
              }
              await add("blogPosts", payload);
              close();
            } catch (err: any) {
              toast(err.response?.data?.message || "Failed to save post.");
            }
          }}
          fields={[
            { name: "title", label: "Title", type: "text" , required: true },
            { name: "slug", label: "Slug", type: "text" , required: true },
            { name: "cover_image", label: "Cover Photo", type: "file", accept: "image/*" },
            { name: "excerpt", label: "Excerpt", type: "textarea"  },
            { name: "content", label: "Content", type: "textarea" , required: true },
          ]}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            title: row.title,
            slug: row.slug,
            excerpt: row.excerpt || "",
            content: row.content || (row.body ? (typeof row.body === 'string' ? row.body.replace(/^"|"$/g, '') : JSON.stringify(row.body)) : ""),
          }}
          onCancel={close}
          onSubmit={async (v) => {
            if (!v.title) return toast.error("Title is required");
            if (!v.slug) return toast.error("Slug is required");
            try {
              const payload = { ...v };
              if (payload.content) {
                payload.body = JSON.stringify(payload.content);
                delete payload.content;
              }
              await update("blogPosts", row.id, payload);
              toast.success("Updated successfully.");
              close();
            } catch (err: any) {
              toast.error(err.response?.data?.message || "Failed to update post.");
            }
          }}
          fields={[
            { name: "title", label: "Title", type: "text" , required: true },
            { name: "slug", label: "Slug", type: "text" , required: true },
            { name: "cover_image", label: "Cover Photo", type: "file", accept: "image/*" },
            { name: "excerpt", label: "Excerpt", type: "textarea"  },
            { name: "content", label: "Content", type: "textarea" , required: true },
          ]}
        />
      )}
    />
  );
}