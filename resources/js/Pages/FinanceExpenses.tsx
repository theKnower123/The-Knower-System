import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm, type FieldDef } from "@/components/quick-form";
import { useCollection, add, update, remove } from "@/mocks/store";
import { makeId, type Expense } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import type { FilterDef } from "@/components/data-table";

export default function ExpensesPage() {
  const { t } = useTranslation();
  const rows = useCollection("expenses");
  const { user } = useAuth();

  const [editingRow, setEditingRow] = useState<Expense | null>(null);
  const canEdit = ["super_admin", "ceo", "accountant", "project_manager"].includes(user?.role || "");

  // Build unique categories for filter
  const categoryOptions = useMemo(() => {
    const cats = [...new Set(rows.map((r) => r.category).filter(Boolean))];
    return cats.map((c) => ({ value: c!, label: c! }));
  }, [rows]);

  const filters: FilterDef[] = [
    ...(categoryOptions.length > 0 ? [{
      key: "category",
      label: "Category",
      options: categoryOptions,
    }] : []),
  ];

  const formFields: FieldDef[] = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "category", label: "Category", type: "text" },
    { name: "amount", label: "Amount", type: "number", required: true },
    { name: "method", label: "Method", type: "select", defaultValue: "card", options: [
      { value: "card", label: "Card" },
      { value: "cash", label: "Cash" },
      { value: "bank_transfer", label: "Bank Transfer" },
      { value: "vodafone_cash", label: "Vodafone Cash" },
      { value: "instapay", label: "InstaPay" },
    ]},
  ];

  return (
    <ResourcePage<Expense>
      collectionKey="expenses"
      title={t("nav.expenses")}
      description="Company costs and outflows"
      rows={rows}
      newLabel="New expense"
      editingRow={editingRow}
      onCloseEdit={() => setEditingRow(null)}
      filters={filters}
      getSearchable={(r) => `${r.title} ${r.category || ""} ${r.method || ""} ${r.amount}`}
      columns={[
        { key: "title", header: t("common.title"), cell: (r) => <span className="font-medium">{r.title}</span> },
        { key: "category", header: "Category", cell: (r) => r.category },
        { key: "method", header: "Method", cell: (r) => r.method },
        { key: "amount", header: t("common.amount"), cell: (r) => <span className="font-semibold tabular-nums">{money(r.amount)}</span> },
        { key: "created", header: t("common.created"), cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.createdAt)}</span> },
        {
          key: "actions",
          header: "",
          cell: (r) => (
            <div className="flex gap-2 justify-end">
              {canEdit && (
                <>
                  <button
                    className="text-primary hover:underline text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingRow(r);
                    }}
                  >
                    {t("common.edit")}
                  </button>
                  <ConfirmDeleteButton
                    onConfirm={async () => {
                      try {
                        await remove("expenses", r.id);
                        toast("Expense deleted.");
                      } catch {
                        toast("Failed to delete expense.");
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  />
                </>
              )}
            </div>
          ),
        },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await add("expenses", {
                id: makeId("ex"),
                category: v.category,
                title: v.title,
                amount: Number(v.amount || 0),
                method: v.method,
                createdAt: new Date().toISOString(),
              });
              toast("Expense added.");
              close();
            } catch (err: any) {
              toast("Failed to save expense.");
            }
          }}
          fields={formFields}
        />
      )}
      renderEditForm={(row, close) => (
        <QuickForm
          submitLabel="Save Changes"
          initialValues={{
            title: row.title,
            category: row.category || "",
            amount: row.amount || 0,
            method: row.method || "card",
          }}
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await update("expenses", row.id, {
                ...row,
                ...v,
                amount: Number(v.amount || 0),
              });
              toast("Expense updated.");
              close();
            } catch {
              toast("Failed to update expense.");
            }
          }}
          fields={formFields}
        />
      )}
    />
  );
}
