export const money = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

export const shortDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

export const relativeDays = (iso: string) => {
  const diff = Math.round((new Date(iso).getTime() - Date.now()) / 86400000);
  if (diff === 0) return "today";
  if (diff > 0) return `in ${diff}d`;
  return `${Math.abs(diff)}d ago`;
};

/** Ensure links open correctly even if the scheme was omitted. */
export function normalizeExternalUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Short label for a GitHub URL (owner/repo) when possible. */
export function githubRepoLabel(raw: string | null | undefined): string {
  const url = normalizeExternalUrl(raw);
  if (!url) return "";
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) return `${parts[0]}/${parts[1].replace(/\.git$/, "")}`;
    return u.hostname + u.pathname;
  } catch {
    return String(raw);
  }
}
