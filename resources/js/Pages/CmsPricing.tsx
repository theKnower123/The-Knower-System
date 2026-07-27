import { toast } from 'sonner';
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";

export default function CmsPricingPage() {
  const rows = useCollection("marketingPlans");

  return (
    <ResourcePage
      title="Pricing Plans"
      description="Manage pricing plans and features"
      rows={rows}
      newLabel="New Plan"
      columns={[
        { key: "name", header: "Name", cell: (r: any) => r.name },
        { key: "plan_type", header: "Type", cell: (r: any) => r.plan_type },
        { key: "price_monthly", header: "Monthly", cell: (r: any) => r.price_monthly },
        { key: "price_yearly", header: "Yearly", cell: (r: any) => r.price_yearly },
        { key: "highlight", header: "Featured", cell: (r: any) => r.highlight ? "Yes" : "No" },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await add("marketingPlans", {
                highlight: false,
                features: [],
                ...v,
                highlight: v.highlight === "true",
                price_monthly: v.price_monthly ? Number(v.price_monthly) : 0,
                price_yearly: v.price_yearly ? Number(v.price_yearly) : 0,
              });
              close();
            } catch (err: any) {
              toast(err.response?.data?.message || "Failed to save plan.");
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
    />
  );
}
