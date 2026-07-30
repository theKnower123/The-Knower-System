import { toast } from 'sonner';
import { ResourcePage } from "@/components/resource-page";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add, update, remove } from "@/mocks/store";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export default function CmsBlogPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "cms.manage") : false;
  

  const rows = useCollection("blogPosts");
  const [editingRow, setEditingRow] = useState<any>(null);

  return (
    <ResourcePage
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="blogPosts"
      title="Blog Posts"
      description="Manage company blog"
      rows={rows}
      newLabel="New Post"
      columns={[
        { 
          key: "cover", 
          header: "Image", 
          cell: (r: any) => (
            r.coverImage || r.cover_image ? (
              <img 
                src={r.coverImage || r.cover_image} 
                alt={r.title} 
                className="h-10 w-14 rounded-md border border-border object-cover"
              />
            ) : (
              <div className="h-10 w-14 rounded-md border border-border bg-muted flex items-center justify-center">
                <span className="text-[9px] text-muted-foreground">No img</span>
              </div>
            )
          )
        },
        { key: "title", header: "Title", cell: (r: any) => r.title },
        { key: "author_name", header: "Author", cell: (r: any) => r.authorName || r.author_name || "—" },
        { 
          key: "is_published", 
          header: "Published", 
          cell: (r: any) => (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">No</span>
              <Switch 
                checked={r.isPublished || r.is_published} 
                onCheckedChange={async (checked) => {
                  try {
                    await update("blogPosts", r.id, { is_published: checked });
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
              const payload: any = {
                title: v.title,
                slug: v.slug,
                excerpt: v.excerpt,
                body: v.content,
                is_published: true,
                author_name: "Admin",
              };
              // Attach file if provided
              if (v.cover_image instanceof File) {
                payload.cover_image = v.cover_image;
              }
              await add("blogPosts", payload);
              close();
            } catch (err: any) {
              toast(err.response?.data?.message || "Failed to save post.");
            }
          }}
          fields={[
            { name: "title", label: "Title", type: "text", required: true },
            { name: "slug", label: "Slug", type: "text", required: true },
            { name: "cover_image", label: "Featured Image", type: "file", accept: "image/jpeg,image/png,image/webp,image/jpg" },
            { name: "excerpt", label: "Excerpt", type: "textarea" },
            { name: "content", label: "Content", type: "textarea", required: true },
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
            cover_image: row.coverImage || row.cover_image || "",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            if (!v.title) return toast.error("Title is required");
            if (!v.slug) return toast.error("Slug is required");
            try {
              const payload: any = {
                title: v.title,
                slug: v.slug,
                excerpt: v.excerpt,
              };
              if (v.content) {
                payload.body = v.content;
              }
              // Attach file if it's a new file upload
              if (v.cover_image instanceof File) {
                payload.cover_image = v.cover_image;
              }
              await update("blogPosts", row.id, payload);
              toast.success("Updated successfully.");
              close();
            } catch (err: any) {
              toast.error(err.response?.data?.message || "Failed to update post.");
            }
          }}
          fields={[
            { name: "title", label: "Title", type: "text", required: true },
            { name: "slug", label: "Slug", type: "text", required: true },
            { name: "cover_image", label: "Featured Image", type: "file", accept: "image/jpeg,image/png,image/webp,image/jpg" },
            { name: "excerpt", label: "Excerpt", type: "textarea" },
            { name: "content", label: "Content", type: "textarea", required: true },
          ]}
        />
      )}
    />
  );
}