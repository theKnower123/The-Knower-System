import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export function EditIconButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      title="Edit"
      aria-label="Edit"
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary/10",
        className
      )}
      {...props}
    >
      <Pencil className="h-4 w-4" />
    </button>
  );
}
