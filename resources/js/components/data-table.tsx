import { useMemo, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  /** Hide this column on mobile card view to reduce clutter */
  hideOnMobile?: boolean;
}

export type FilterDef =
  | {
      type?: "select";
      key: string;
      label: string;
      options: { value: string; label: string }[];
      accessor?: (row: any) => string;
    }
  | {
      type: "date-range";
      key: string;
      label: string;
      accessor?: (row: any) => string | Date | null | undefined;
    };

export function DataTable<T extends { id: string | number }>({
  rows,
  columns,
  searchable = true,
  getSearchable,
  empty = "Nothing here yet",
  filters,
  pageSize = 10,
}: {
  rows: T[];
  columns: Column<T>[];
  searchable?: boolean;
  getSearchable?: (row: T) => string;
  empty?: string;
  filters?: FilterDef[];
  pageSize?: number;
}) {
  const [q, setQ] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const hasActiveFilters = Object.values(appliedFilters).some((v) => v && v !== "__all__");

  const setFilter = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setAppliedFilters(activeFilters);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = rows;

    // Apply dropdown filters based on appliedFilters
    if (filters) {
      for (const filter of filters) {
        if (filter.type === "date-range") {
          const from = appliedFilters[`${filter.key}_from`];
          const to = appliedFilters[`${filter.key}_to`];
          if (from || to) {
            result = result.filter((r) => {
              const val = filter.accessor ? filter.accessor(r) : (r as any)[filter.key];
              if (!val) return false;
              const dateVal = new Date(val).getTime();
              if (from && dateVal < new Date(from).getTime()) return false;
              if (to && dateVal > new Date(to).getTime() + 86399000) return false; // Include the whole 'to' day
              return true;
            });
          }
        } else {
          const val = appliedFilters[filter.key];
          if (val && val !== "__all__") {
            result = result.filter((r) => {
              if (filter.accessor) {
                return filter.accessor(r) === val;
              }
              const rowVal = (r as any)[filter.key];
              return String(rowVal ?? "") === val;
            });
          }
        }
      }
    }

    // Apply text search
    if (q.trim()) {
      const needle = q.toLowerCase();
      result = result.filter((r) => {
        const hay = getSearchable
          ? getSearchable(r)
          : Object.values(r as Record<string, unknown>).join(" ").toString();
        return hay.toLowerCase().includes(needle);
      });
    }

    return result;
  }, [rows, q, activeFilters, getSearchable, filters]);

  // Reset pagination when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [q]);

  const totalPages = Math.ceil(filtered.length / (pageSize || 10));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * (pageSize || 10);
    return filtered.slice(start, start + (pageSize || 10));
  }, [filtered, currentPage, pageSize]);

  // Separate columns for mobile: first column as "title", rest as detail rows
  const mobileColumns = columns.filter((c) => !c.hideOnMobile);

  return (
    <div className="space-y-3">
      {/* Search + Filter Controls */}
      {(searchable || (filters && filters.length > 0)) && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {searchable && (
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute inset-s-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search…"
                  className="ps-9"
                />
              </div>
            )}
            {filters && filters.length > 0 && (
              <Button
                variant={filtersExpanded || hasActiveFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="gap-1.5 shrink-0"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/20 text-[10px] font-bold">
                    {Object.values(activeFilters).filter((v) => v && v !== "__all__").length}
                  </span>
                )}
              </Button>
            )}
          </div>

          {/* Filter Dropdowns */}
          {filters && filters.length > 0 && filtersExpanded && (
            <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
              <div className="flex flex-wrap items-end gap-3">
                {filters.map((f) => (
                  <div
                    key={f.key}
                    className={`space-y-1.5 ${
                      f.type === "date-range"
                        ? "w-full sm:w-auto min-w-[260px] max-w-full"
                        : "w-full sm:w-auto min-w-[150px] flex-1 max-w-[220px]"
                    }`}
                  >
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                      {f.label}
                    </label>
                    {f.type === "date-range" ? (
                      <div className="flex items-center gap-1.5 w-full">
                        <Input
                          type="date"
                          className="h-8 text-xs min-w-0 flex-1 px-2"
                          value={activeFilters[`${f.key}_from`] || ""}
                          onChange={(e) => setFilter(`${f.key}_from`, e.target.value)}
                        />
                        <span className="text-xs text-muted-foreground shrink-0 font-medium px-0.5">
                          to
                        </span>
                        <Input
                          type="date"
                          className="h-8 text-xs min-w-0 flex-1 px-2"
                          value={activeFilters[`${f.key}_to`] || ""}
                          onChange={(e) => setFilter(`${f.key}_to`, e.target.value)}
                        />
                      </div>
                    ) : (
                      <Select
                        value={activeFilters[f.key] || "__all__"}
                        onValueChange={(v) => setFilter(f.key, v)}
                      >
                        <SelectTrigger className="h-8 text-xs w-full">
                          <SelectValue placeholder={`All ${f.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">All {f.label}</SelectItem>
                          {f.options.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                <Button size="sm" onClick={applyFilters}>
                  Apply Filters
                </Button>
                {(Object.keys(activeFilters).length > 0 || hasActiveFilters) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-1 text-xs text-muted-foreground hover:text-destructive h-8"
                  >
                    <X className="h-3 w-3" />
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results count when filtering */}
      {(q.trim() || hasActiveFilters) && (
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {rows.length} results
        </p>
      )}

      {/* ── Desktop table view (hidden on mobile) ── */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-border bg-card">
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
              {paginated.map((row) => (
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

      {/* ── Mobile card view (hidden on desktop) ── */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
            {empty}
          </div>
        )}
        {paginated.map((row) => (
          <div
            key={row.id}
            className="rounded-xl border border-border bg-card p-4 space-y-2"
          >
            {mobileColumns.map((c, i) => (
              <div
                key={c.key}
                className={
                  i === 0
                    ? "text-sm font-medium"
                    : "flex items-center justify-between gap-2 text-sm"
                }
              >
                {i === 0 ? (
                  c.cell(row)
                ) : (
                  <>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {c.header}
                    </span>
                    <span className="text-end">{c.cell(row)}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Pagination Controls ── */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="font-semibold text-foreground">{(currentPage - 1) * (pageSize || 10) + 1}</strong> to <strong className="font-semibold text-foreground">{Math.min(currentPage * (pageSize || 10), filtered.length)}</strong> of <strong className="font-semibold text-foreground">{filtered.length}</strong> items
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 gap-1 text-xs"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {/* Page number buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, idx, arr) => {
                  const prevP = arr[idx - 1];
                  const showEllipsis = prevP && p - prevP > 1;
                  return (
                    <div key={p} className="flex items-center gap-1">
                      {showEllipsis && <span className="px-1 text-xs text-muted-foreground">...</span>}
                      <Button
                        variant={currentPage === p ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0 text-xs font-semibold"
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </Button>
                    </div>
                  );
                })}

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 gap-1 text-xs"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
