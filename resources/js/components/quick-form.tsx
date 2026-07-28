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
import { Upload, X, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type FieldDef =
  | { name: string; label: string; type: "text" | "email" | "number" | "date"; required?: boolean; defaultValue?: string | number; hidden?: boolean }
  | { name: string; label: string; type: "textarea"; required?: boolean; defaultValue?: string; hidden?: boolean }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[]; required?: boolean; defaultValue?: string; hidden?: boolean }
  | { name: string; label: string; type: "multiselect"; options: { value: string; label: string; avatar?: string; description?: string }[]; required?: boolean; defaultValue?: string[]; hidden?: boolean }
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
              <div className="flex flex-col gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between h-auto min-h-[2.5rem] py-2 px-3 font-normal",
                        !(values[f.name] && values[f.name].length > 0) && "text-muted-foreground"
                      )}
                    >
                      <div className="flex flex-wrap gap-1 items-center">
                        {values[f.name] && values[f.name].length > 0 ? (
                          values[f.name].map((val: string) => {
                            const opt = f.options.find(o => o.value === val);
                            return (
                              <Badge variant="secondary" key={val} className="mr-1 mb-1 font-normal flex items-center gap-1">
                                {opt?.avatar && <Avatar className="w-4 h-4"><AvatarImage src={opt.avatar} /><AvatarFallback>{opt?.label?.charAt(0)}</AvatarFallback></Avatar>}
                                {opt ? opt.label : val}
                                <div
                                  role="button"
                                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      const current = values[f.name] || [];
                                      set(f.name, current.filter((x: string) => x !== val));
                                    }
                                  }}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const current = values[f.name] || [];
                                    set(f.name, current.filter((x: string) => x !== val));
                                  }}
                                >
                                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </div>
                              </Badge>
                            );
                          })
                        ) : (
                          "Select " + f.label.toLowerCase() + "..."
                        )}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] max-w-[90vw] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={`Search ${f.label.toLowerCase()}...`} />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {f.options.map((opt) => {
                            const isSelected = (values[f.name] || []).includes(opt.value);
                            return (
                              <CommandItem
                                key={opt.value}
                                value={`${opt.label} ${opt.description || ""}`}
                                onSelect={() => {
                                  const current = values[f.name] || [];
                                  if (isSelected) {
                                    set(f.name, current.filter((x: string) => x !== opt.value));
                                  } else {
                                    set(f.name, [...current, opt.value]);
                                  }
                                }}
                                className="flex items-center gap-3 py-2 cursor-pointer"
                              >
                                {opt.avatar && (
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={opt.avatar} />
                                    <AvatarFallback>{opt.label.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                )}
                                <div className="flex flex-col">
                                  <span className="font-medium">{opt.label}</span>
                                  {opt.description && <span className="text-xs text-muted-foreground">{opt.description}</span>}
                                </div>
                                <div className={cn(
                                  "ml-auto flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible"
                                )}>
                                  <Check className={cn("h-3 w-3")} />
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
