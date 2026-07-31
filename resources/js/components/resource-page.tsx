import { useState, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DataTable, type Column, type FilterDef } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { restore, forceDelete } from "@/mocks/store";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ResourcePage<T extends { id: string | number }>({
  title,
  description,
  rows,
  columns,
  getSearchable,
  newLabel = "New",
  renderForm,
  onSubmit,
  extraActions,
  renderEditForm,
  editingRow,
  onCloseEdit,
  filters,
  headerContent,
  collectionKey,
  hideNewButton,
  hideTrashButton,
}: {
  title: string;
  description?: string;
  rows: T[];
  columns: Column<T>[];
  getSearchable?: (row: T) => string;
  newLabel?: string;
  renderForm?: (close: () => void) => ReactNode;
  onSubmit?: () => void;
  extraActions?: ReactNode;
  renderEditForm?: (row: T, close: () => void) => ReactNode;
  editingRow?: T | null;
  onCloseEdit?: () => void;
  /** Filter definitions for the data table */
  filters?: FilterDef[];
  /** Optional content rendered between the header and the table (e.g. stat cards) */
  headerContent?: ReactNode;
  /** Pass the endpoint key to enable Trash mode automatically */
  collectionKey?: string;
  hideNewButton?: boolean;
  hideTrashButton?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const canCreate = (!!renderForm || !!onSubmit) && !hideNewButton;
  
  const isTrashMode = !hideTrashButton && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get("trash") === "1";

  const toggleTrash = () => {
    if (hideTrashButton) return;
    const params = new URLSearchParams(window.location.search);
    if (isTrashMode) params.delete("trash");
    else params.set("trash", "1");
    window.location.href = `${window.location.pathname}?${params.toString()}`;
  };

  let actualColumns = columns;
  if (isTrashMode && collectionKey) {
    actualColumns = columns.map(c => {
      if (c.key === 'actions') {
        return {
          ...c,
          cell: (r: any) => (
            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await restore(collectionKey as any, r.id);
                    toast.success("Restored successfully.");
                  } catch (err) {
                    toast.error("Failed to restore.");
                  }
                }}
              >
                Restore
              </button>
              <ConfirmDeleteButton
                isPermanent={true}
                onConfirm={async () => {
                  try {
                    await forceDelete(collectionKey as any, r.id);
                    toast.success("Permanently deleted successfully.");
                  } catch (err) {
                    toast.error("Failed to permanently delete.");
                  }
                }}
              />
            </div>
          )
        };
      }
      return c;
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isTrashMode ? `${title} (Trash)` : title}
        description={description}
        actions={
          <div className="flex items-center gap-2">
            {extraActions}
            {collectionKey && !hideTrashButton && (
              <Button variant={isTrashMode ? "secondary" : "outline"} onClick={toggleTrash}>
                <Trash2 className="me-1 h-4 w-4" />
                {isTrashMode ? "Exit Trash" : "Trash"}
              </Button>
            )}
            {canCreate && !isTrashMode && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="me-1 h-4 w-4" />
                    {newLabel}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl max-h-[85vh]">
                  <DialogHeader>
                    <DialogTitle>{newLabel}</DialogTitle>
                    <DialogDescription>
                      Fill the details below.
                    </DialogDescription>
                  </DialogHeader>
                  {renderForm ? (
                    renderForm(() => setOpen(false))
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        No form defined yet.
                      </p>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                          Close
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

      {headerContent}

      <DataTable
        rows={rows}
        columns={actualColumns}
        getSearchable={getSearchable}
        filters={filters}
        rowClassName={
          isTrashMode
            ? "bg-red-50/90 hover:bg-red-100/90 dark:bg-red-950/40 dark:hover:bg-red-950/55 border-red-200/70 dark:border-red-900/50"
            : undefined
        }
      />

      {/* Edit Dialog */}
      {renderEditForm && editingRow && (
        <Dialog open={!!editingRow} onOpenChange={(v) => !v && onCloseEdit?.()}>
          <DialogContent className="sm:max-w-xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle>Edit Details</DialogTitle>
            </DialogHeader>
            {renderEditForm(editingRow, () => onCloseEdit?.())}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
