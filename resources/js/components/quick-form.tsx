import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X } from "lucide-react";

export type FieldDef =
  | { name: string; label: string; type: "text" | "email" | "number" | "date"; required?: boolean; defaultValue?: string | number; hidden?: boolean }
  | { name: string; label: string; type: "textarea"; required?: boolean; defaultValue?: string; hidden?: boolean }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[]; required?: boolean; defaultValue?: string; hidden?: boolean }
  | { name: string; label: string; type: "multiselect"; options: { value: string; label: string }[]; required?: boolean; defaultValue?: string[]; hidden?: boolean }
  | { name: string; label: string; type: "file"; required?: boolean; accept?: string; hidden?: boolean };

export function QuickForm({
  fields,
  onSubmit,
  onCancel,
  submitLabel = "Create",
  children,
  initialValues = {},
}: {
  fields: FieldDef[];
  onSubmit: (values: Record<string, any>) => void;
  onCancel: () => void;
  submitLabel?: string;
  children?: ReactNode;
  initialValues?: Record<string, any>;
}) {
  const initial: Record<string, any> = { ...initialValues };
  fields.forEach((f) => {
    if (initial[f.name] === undefined) {
      if (f.type === "multiselect") {
        initial[f.name] = (f as any).defaultValue || [];
      } else if (f.type === "file") {
        initial[f.name] = null;
      } else {
        initial[f.name] = (f as any).defaultValue !== undefined ? String((f as any).defaultValue) : "";
      }
    }
  });
  const [values, setValues] = useState(initial);
  const set = (k: string, v: any) => setValues((s) => ({ ...s, [k]: v }));

  // For file preview
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});

  const visibleFields = fields.filter((f) => !f.hidden);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {visibleFields.map((f) => (
          <div
            key={f.name}
            className={f.type === "textarea" || f.type === "multiselect" || f.type === "file" ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}
          >
            <Label htmlFor={f.name}>{f.label}</Label>
            {f.type === "textarea" ? (
              <Textarea
                id={f.name}
                required={f.required}
                value={values[f.name] || ""}
                onChange={(e) => set(f.name, e.target.value)}
              />
            ) : f.type === "select" ? (
              <Select
                value={values[f.name] || ""}
                onValueChange={(v) => set(f.name, v)}
              >
                <SelectTrigger id={f.name}>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {f.options.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : f.type === "multiselect" ? (
              <div className="flex flex-col gap-2 border p-3 rounded-md max-h-48 overflow-y-auto">
                {f.options.map(opt => {
                  const checked = (values[f.name] || []).includes(opt.value);
                  return (
                    <label key={opt.value} className="flex items-center gap-2 text-sm">
                      <Checkbox 
                        checked={checked} 
                        onCheckedChange={(c) => {
                          const current = values[f.name] || [];
                          if (c) {
                            set(f.name, [...current, opt.value]);
                          } else {
                            set(f.name, current.filter((x: string) => x !== opt.value));
                          }
                        }} 
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </div>
            ) : f.type === "file" ? (
              <div className="space-y-2">
                {/* File preview */}
                {filePreviews[f.name] && (
                  <div className="relative inline-block">
                    <img
                      src={filePreviews[f.name]}
                      alt="Upload preview"
                      className="h-24 w-24 rounded-lg border border-border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFilePreviews((p) => {
                          const n = { ...p };
                          delete n[f.name];
                          return n;
                        });
                        set(f.name, null);
                      }}
                      className="absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {/* Existing proof URL */}
                {!filePreviews[f.name] && typeof values[f.name] === "string" && values[f.name] && (
                  <div className="relative inline-block">
                    <img
                      src={values[f.name]}
                      alt="Current proof"
                      className="h-24 w-24 rounded-lg border border-border object-cover"
                    />
                  </div>
                )}
                <label
                  htmlFor={f.name}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-border/60 p-4 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Upload className="h-4 w-4" />
                  <span>{values[f.name] ? "Change file" : "Click to upload"}</span>
                  <input
                    id={f.name}
                    type="file"
                    accept={(f as any).accept || "image/*"}
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        set(f.name, file);
                        // Generate preview
                        const reader = new FileReader();
                        reader.onload = () => {
                          setFilePreviews((p) => ({ ...p, [f.name]: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            ) : (
              <Input
                id={f.name}
                type={f.type}
                required={f.required}
                value={values[f.name] || ""}
                onChange={(e) => set(f.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      {children}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </DialogFooter>
    </form>
  );
}
