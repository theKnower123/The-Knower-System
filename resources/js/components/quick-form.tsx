import { useMemo, useState, type ReactNode } from "react";
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
import { Search, X } from "lucide-react";

export type FieldOption = {
  value: string;
  label: string;
  avatar?: string;
  description?: string;
};

export type FieldDef =
  | { name: string; label: string; type: "text" | "email" | "password" | "number" | "date" | "file"; required?: boolean; defaultValue?: string | number; accept?: string }
  | { name: string; label: string; type: "textarea"; required?: boolean; defaultValue?: string }
  | { name: string; label: string; type: "image_assets"; required?: boolean; defaultValue?: string[] }
  | { name: string; label: string; type: "select"; options: FieldOption[]; required?: boolean; defaultValue?: string }
  | { name: string; label: string; type: "multiselect"; options: FieldOption[]; required?: boolean; defaultValue?: string[] };

function SearchableMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Search team members…",
}: {
  options: FieldOption[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const selected = value.map(String);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => {
      const hay = `${o.label} ${o.description || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [options, query]);

  const selectedOptions = options.filter((o) => selected.includes(String(o.value)));

  const toggle = (id: string, checked: boolean) => {
    if (checked) onChange([...selected, id]);
    else onChange(selected.filter((x) => x !== id));
  };

  return (
    <div className="space-y-2 rounded-md border border-border bg-muted/20 p-3">
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedOptions.map((o) => (
            <span
              key={o.value}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5 text-xs"
            >
              {o.avatar ? (
                <img src={o.avatar} alt="" className="h-4 w-4 rounded-full" />
              ) : null}
              <span className="font-medium">{o.label}</span>
              <button
                type="button"
                className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => toggle(String(o.value), false)}
                aria-label={`Remove ${o.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute inset-s-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-8 ps-8 text-sm"
        />
      </div>

      <div className="max-h-40 space-y-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="px-1 py-3 text-center text-xs text-muted-foreground">
            No team members match “{query}”.
          </p>
        )}
        {filtered.map((opt) => {
          const id = String(opt.value);
          const checked = selected.includes(id);
          return (
            <label
              key={id}
              className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 text-sm hover:bg-muted/60"
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(c) => toggle(id, Boolean(c))}
              />
              {opt.avatar ? (
                <img src={opt.avatar} alt="" className="h-7 w-7 rounded-full border border-border" />
              ) : null}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium leading-tight">{opt.label}</span>
                {opt.description ? (
                  <span className="block truncate text-[11px] text-muted-foreground">{opt.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

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
              <SearchableMultiSelect
                options={f.options}
                value={Array.isArray(values[f.name]) ? values[f.name].map(String) : []}
                onChange={(next) => set(f.name, next)}
                placeholder={`Search ${f.label.toLowerCase()}…`}
              />
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
