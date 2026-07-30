import { useState } from "react";
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

interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
  isPermanent?: boolean;
}

export function ConfirmDeleteButton({ onConfirm, className, children, asChild, isPermanent = false }: ConfirmDeleteButtonProps) {
  const { t } = useTranslation();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {asChild ? (
          children
        ) : (
          <button className={className} onClick={(e) => e.stopPropagation()}>
            {children || (isPermanent ? "Permanent Delete" : t("common.delete"))}
          </button>
        )}
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
