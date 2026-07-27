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
}

export function ConfirmDeleteButton({ onConfirm, className, children, asChild }: ConfirmDeleteButtonProps) {
  const { t } = useTranslation();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {asChild ? (
          children
        ) : (
          <button className={className} onClick={(e) => e.stopPropagation()}>
            {children || t("common.delete")}
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("common.confirmDeleteTitle") || "Are you absolutely sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("common.confirmDeleteDesc") || "This action cannot be undone. This will permanently delete the record."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
