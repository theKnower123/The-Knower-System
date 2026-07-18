import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DataTable, type Column } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ResourcePage<T extends { id: string }>({
  title,
  description,
  rows,
  columns,
  getSearchable,
  newLabel = "New",
  renderForm,
  onSubmit,
  extraActions,
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
}) {
  const [open, setOpen] = useState(false);
  const canCreate = !!renderForm || !!onSubmit;

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          <div className="flex items-center gap-2">
            {extraActions}
            {canCreate && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="me-1 h-4 w-4" />
                    {newLabel}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
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
      <DataTable rows={rows} columns={columns} getSearchable={getSearchable} />
    </div>
  );
}
