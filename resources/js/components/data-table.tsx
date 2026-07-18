import { useMemo, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchable = true,
  getSearchable,
  empty = "Nothing here yet",
}: {
  rows: T[];
  columns: Column<T>[];
  searchable?: boolean;
  getSearchable?: (row: T) => string;
  empty?: string;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) => {
      const hay = getSearchable
        ? getSearchable(r)
        : Object.values(r as Record<string, unknown>).join(" ").toString();
      return hay.toLowerCase().includes(needle);
    });
  }, [rows, q, getSearchable]);

  return (
    <div className="space-y-3">
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="absolute inset-s-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="ps-9"
          />
        </div>
      )}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={
                      "px-4 py-3 text-start text-xs font-medium uppercase tracking-wider text-muted-foreground " +
                      (c.className ?? "")
                    }
                  >
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                    colSpan={columns.length}
                  >
                    {empty}
                  </td>
                </tr>
              )}
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-border/60 transition-colors hover:bg-muted/30"
                >
                  {columns.map((c) => (
                    <td key={c.key} className={"px-4 py-3 " + (c.className ?? "")}>
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
