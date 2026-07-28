import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type SSL } from "@/mocks/data";
import { shortDate } from "@/lib/format";

export default function SSLPage() {
  const { t } = useTranslation();
  const rows = useCollection("ssls");
  const domains = useCollection("domains");
  return (
    <ResourcePage<SSL>
      title={t("nav.ssl")}
      description="TLS certificates and their renewal windows"
      rows={rows}
      newLabel="New certificate"
      columns={[
        { key: "domain", header: "Domain", cell: (r) => <span className="font-mono">{domains.find((d) => d.id === r.domainId)?.domain ?? r.domainId}</span> },
        { key: "provider", header: "Provider", cell: (r) => r.provider },
        { key: "expiry", header: "Expires", cell: (r) => shortDate(r.expiryDate) },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("ssls", {
              id: makeId("sl"),
              domainId: v.domainId,
              provider: v.provider || "Let's Encrypt",
              expiryDate: v.expiryDate ? new Date(v.expiryDate).toISOString() : new Date().toISOString(),
              status: "valid",
            });
            close();
          }}
          fields={[
            { name: "domainId", label: "Domain", type: "select", options: domains.map((d) => ({ value: d.id, label: d.domain })), required: true },
            { 
              name: "provider", 
              label: "Provider", 
              type: "select",
              defaultValue: "Let's Encrypt",
              options: [
                // Free / most popular first
                { value: "Let's Encrypt", label: "Let's Encrypt (Free)" },
                { value: "ZeroSSL", label: "ZeroSSL (Free)" },
                { value: "Cloudflare SSL", label: "Cloudflare SSL (Free)" },
                // Paid providers
                { value: "Sectigo", label: "Sectigo (Comodo)" },
                { value: "DigiCert", label: "DigiCert" },
                { value: "GlobalSign", label: "GlobalSign" },
                { value: "GeoTrust", label: "GeoTrust" },
                { value: "Thawte", label: "Thawte" },
                { value: "RapidSSL", label: "RapidSSL" },
                { value: "GoDaddy SSL", label: "GoDaddy SSL" },
                { value: "Namecheap SSL", label: "Namecheap SSL" },
                { value: "Entrust", label: "Entrust" },
                { value: "SSL.com", label: "SSL.com" },
                { value: "TrustAsia", label: "TrustAsia" },
                { value: "HARICA", label: "HARICA" },
                { value: "Other", label: "Other" },
              ]
            },
            { name: "expiryDate", label: "Expires", type: "date" },
          ]}
        />
      )}
    />
  );
}
