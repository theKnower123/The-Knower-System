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

export type FieldDef =
  | { name: string; label: string; type: "text" | "email" | "password" | "number" | "date" | "file"; required?: boolean; defaultValue?: string | number; accept?: string }
  | { name: string; label: string; type: "textarea"; required?: boolean; defaultValue?: string }
  | { name: string; label: string; type: "image_assets"; required?: boolean; defaultValue?: string[] }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[]; required?: boolean; defaultValue?: string }
  | { name: string; label: string; type: "multiselect"; options: { value: string; label: string }[]; required?: boolean; defaultValue?: string[] };

export function QuickForm({
  fields,
  onSubmit,
  onCancel,
  submitLabel = "Save",
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
      if (f.type === "multiselect" || f.type === "image_assets") {
        initial[f.name] = f.defaultValue || [];
      } else {
        initial[f.name] = f.defaultValue !== undefined ? String(f.defaultValue) : "";
      }
    }
  });
  const [values, setValues] = useState(initial);
  const set = (k: string, v: any) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="flex flex-col flex-1 min-h-0 space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2 max-h-[58vh] overflow-y-auto px-1 py-1">
        {fields.map((f) => (
          <div
            key={f.name}
            className={f.type === "textarea" || f.type === "multiselect" || f.type === "image_assets" ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}
          >
            <Label htmlFor={f.name}>{f.label}</Label>
            {f.type === "image_assets" ? (
              <div className="space-y-2 rounded-lg border p-3 bg-muted/20">
                <div className="flex flex-wrap gap-2 items-center">
                  {((Array.isArray(values[f.name]) ? values[f.name] : []) as string[]).map((imgUrl: string, idx: number) => (
                    <div key={idx} className="relative group w-16 h-16 rounded-md overflow-hidden border bg-background shadow-xs">
                      <img src={imgUrl} alt={`Asset ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const curr = (Array.isArray(values[f.name]) ? values[f.name] : []) as string[];
                          set(f.name, curr.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5 text-xs opacity-80 hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {((Array.isArray(values[f.name]) ? values[f.name] : []).length < 5) && (
                    <label className="flex flex-col items-center justify-center w-16 h-16 rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-primary cursor-pointer text-xs text-muted-foreground transition-colors bg-background">
                      <span>+ Add</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                const curr = (Array.isArray(values[f.name]) ? values[f.name] : []) as string[];
                                set(f.name, [...curr, event.target.result as string].slice(0, 5));
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Upload up to 5 project screenshot/preview images. Small thumbnails will appear here.
                </p>
              </div>
            ) : f.type === "textarea" ? (
              <Textarea
                id={f.name}
                required={f.required}
                rows={3}
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
              <div className="flex flex-col gap-2 border p-3 rounded-md max-h-36 overflow-y-auto bg-muted/20">
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
              <Input
                id={f.name}
                type="file"
                accept={f.accept}
                required={f.required}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) set(f.name, file);
                }}
              />
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
