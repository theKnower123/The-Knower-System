import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
  isPermanent?: boolean;
}

export function ConfirmDeleteButton({
  onConfirm,
  className,
  children,
  asChild,
  isPermanent = false,
}: ConfirmDeleteButtonProps) {
  const { t } = useTranslation();

  const defaultTrigger = isPermanent ? (
    <button
      type="button"
      className={cn(
        "text-sm font-medium text-red-600 hover:text-red-700 hover:underline",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      Permanently Delete
    </button>
  ) : (
    <button
      type="button"
      title={t("common.delete") || "Delete"}
      aria-label={t("common.delete") || "Delete"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-500/10 hover:text-red-700",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {asChild ? children : defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isPermanent ? "Permanently Delete Item?" : "Move to Trash?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isPermanent
              ? "This action cannot be undone. This record will be permanently deleted from the database."
              : "This record will be moved to the Trash. You can restore it or permanently delete it later from the Trash view."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            {isPermanent ? "Permanently Delete" : "Move to Trash"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
