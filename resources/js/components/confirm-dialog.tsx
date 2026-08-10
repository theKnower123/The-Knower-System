import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2, UserX, RotateCcw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ConfirmUserItem {
  id: string | number;
  name: string;
  email: string;
  avatar?: string | null;
  role?: string;
}

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "warning" | "primary" | "success";
  icon?: "trash" | "warning" | "userX" | "restore" | "shield";
  usersList?: ConfirmUserItem[];
  onConfirm: () => Promise<void> | void;
}

interface ConfirmDialogProps {
  dialog: ConfirmDialogState;
  onClose: () => void;
  loading?: boolean;
}

export function ConfirmDialog({ dialog, onClose, loading }: ConfirmDialogProps) {
  const {
    isOpen,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary",
    icon = "warning",
    usersList,
    onConfirm,
  } = dialog;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const renderIcon = () => {
    switch (icon) {
      case "trash":
        return (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/15 text-destructive border border-destructive/20 shadow-sm">
            <Trash2 className="h-6 w-6" />
          </div>
        );
      case "userX":
        return (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 border border-amber-500/20 shadow-sm">
            <UserX className="h-6 w-6" />
          </div>
        );
      case "restore":
        return (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 shadow-sm">
            <RotateCcw className="h-6 w-6" />
          </div>
        );
      case "shield":
        return (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600 border border-purple-500/20 shadow-sm">
            <ShieldAlert className="h-6 w-6" />
          </div>
        );
      case "warning":
      default:
        return (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 border border-amber-500/20 shadow-sm">
            <AlertTriangle className="h-6 w-6" />
          </div>
        );
    }
  };

  const getActionButtonStyle = () => {
    switch (variant) {
      case "destructive":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold shadow-md";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md";
      case "success":
        return "bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md";
      case "primary":
      default:
        return "bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-md";
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-lg rounded-3xl p-6 border-border/80 shadow-2xl backdrop-blur-xl">
        <AlertDialogHeader className="sm:text-left">
          <div className="flex items-start gap-4">
            {renderIcon()}
            <div className="space-y-1 flex-1 min-w-0">
              <AlertDialogTitle className="text-xl font-extrabold text-foreground tracking-tight">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed mt-1">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {/* Selected Users Avatar & Profile List */}
        {usersList && usersList.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
              <span>Selected User Accounts</span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[11px] font-extrabold">
                {usersList.length} Selected
              </span>
            </div>
            <div className="max-h-52 overflow-y-auto space-y-2 rounded-2xl bg-muted/40 border border-border/60 p-2.5 shadow-inner">
              {usersList.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border/50 shadow-xs hover:border-border transition-all"
                >
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-border/60 shadow-xs"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-extrabold text-xs flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
                      {getInitials(u.name)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold text-foreground truncate">{u.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{u.email}</div>
                  </div>
                  {u.role && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground border border-border/40 capitalize shrink-0 shadow-xs">
                      {u.role.replace("_", " ")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <AlertDialogFooter className="mt-6 flex flex-row items-center justify-end gap-3 pt-4 border-t border-border/40">
          <AlertDialogCancel
            onClick={onClose}
            disabled={loading}
            className="rounded-xl font-semibold border-border/80 hover:bg-accent"
          >
            {cancelText}
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={`rounded-xl px-5 ${getActionButtonStyle()}`}
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
