import { toast } from 'sonner';
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add, update, remove } from "@/mocks/store";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export default function CmsPricingPage() {
  const rows = useCollection("marketingPlans");
  const [editingRow, setEditingRow] = useState<any>(null);

  return (
    <ResourcePage
      collectionKey="marketingPlans"
      title="Pricing Plans"
      description="Manage pricing plans and features"
      rows={rows}
      newLabel="New Plan"
      columns={[
        { key: "name", header: "Name", cell: (r: any) => r.name },
        { key: "plan_type", header: "Type", cell: (r: any) => r.plan_type },
        { key: "price_monthly", header: "Monthly", cell: (r: any) => r.price_monthly },
        { key: "price_yearly", header: "Yearly", cell: (r: any) => r.price_yearly },
        { 
          key: "highlight", 
          header: "Featured", 
          cell: (r: any) => (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">No</span>
              <Switch 
                checked={r.highlight} 
                onCheckedChange={async (checked) => {
                  try {
                    await update("marketingPlans", r.id, { highlight: checked });
                    toast.success("Featured status updated");
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
                    await remove('marketingPlans', r.id);
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
            if (!v.plan_type) return toast.error("Plan Type is required");
            if (!v.name) return toast.error("Plan Name is required");
            try {
              await add("marketingPlans", {
                features: [],
                ...v,
                highlight: v.highlight === "true",
                price_monthly: v.price_monthly ? Number(v.price_monthly) : 0,
                price_yearly: v.price_yearly ? Number(v.price_yearly) : 0,
              });
              close();
            } catch (err: any) {
              toast.error(err.response?.data?.message || "Failed to save plan.");
            }
          }}
          fields={[
            { name: "name", label: "Plan Name", type: "text", required: true },
            {
              name: "plan_type",
              label: "Plan Type",
              type: "select",
              required: true,
              // These 3 values are exactly what the public site filters on:
              // /pricing reads "software", /hosting reads "hosting",
              // /maintenance reads "maintenance". Picking the right one
              // here is what makes a plan show up on the right page.
              options: [
                { value: "software", label: "Software (Pricing page)" },
                { value: "hosting", label: "Hosting (Hosting page)" },
                { value: "maintenance", label: "Maintenance (Maintenance page)" },
              ],
            },
            { name: "blurb", label: "Short description", type: "text" },
            { name: "price_monthly", label: "Monthly Price", type: "text" },
            { name: "price_yearly", label: "Yearly Price", type: "text" },
            { name: "cta_text", label: "Button text (optional, e.g. 'Contact sales')", type: "text" },
            {
              name: "highlight",
              label: "Feature as \"Most popular\"",
              type: "select",
              options: [
                { value: "false", label: "No" },
                { value: "true", label: "Yes" },
              ],
              defaultValue: "false",
            },
          ]}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            name: row.name,
            plan_type: row.planType || row.plan_type,
            blurb: row.blurb || "",
            price_monthly: row.priceMonthly || row.price_monthly || 0,
            price_yearly: row.priceYearly || row.price_yearly || 0,
            cta_text: row.ctaText || row.cta_text || "",
            highlight: row.highlight ? "true" : "false",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            if (!v.plan_type) return toast.error("Plan Type is required");
            if (!v.name) return toast.error("Plan Name is required");
            try {
              await update("marketingPlans", row.id, {
                ...v,
                highlight: v.highlight === "true",
                price_monthly: v.price_monthly ? Number(v.price_monthly) : 0,
                price_yearly: v.price_yearly ? Number(v.price_yearly) : 0,
              });
              toast.success("Updated successfully.");
              close();
            } catch (err: any) {
              toast.error(err.response?.data?.message || "Failed to update plan.");
            }
          }}
          fields={[
            { name: "name", label: "Plan Name", type: "text", required: true },
            {
              name: "plan_type",
              label: "Plan Type",
              type: "select",
              required: true,
              options: [
                { value: "software", label: "Software (Pricing page)" },
                { value: "hosting", label: "Hosting (Hosting page)" },
                { value: "maintenance", label: "Maintenance (Maintenance page)" },
              ],
            },
            { name: "blurb", label: "Short description", type: "text" },
            { name: "price_monthly", label: "Monthly Price", type: "text" },
            { name: "price_yearly", label: "Yearly Price", type: "text" },
            { name: "cta_text", label: "Button text (optional, e.g. 'Contact sales')", type: "text" },
            {
              name: "highlight",
              label: "Feature as \"Most popular\"",
              type: "select",
              options: [
                { value: "false", label: "No" },
                { value: "true", label: "Yes" },
              ],
            },
          ]}
        />
      )}
    />
  );
}
