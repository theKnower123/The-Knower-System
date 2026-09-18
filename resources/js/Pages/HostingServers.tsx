import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add, remove } from "@/mocks/store";
import { toast } from "sonner";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { makeId, type Server as ServerT } from "@/mocks/data";

export default function ServersPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "server.manage") : false;
  

  const { t } = useTranslation();
  const rows = useCollection("servers");
  return (
    <ResourcePage<ServerT>
      hideNewButton={!canEdit}
      hideTrashButton={!canEdit}
      collectionKey="servers"
      title={t("nav.servers")}
      description="Provisioned infrastructure"
      rows={rows}
      newLabel="Add server"
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <span className="font-medium">{r.name}</span> },
        { key: "provider", header: "Provider", cell: (r) => r.provider },
        { key: "ip", header: "IP", cell: (r) => <span className="font-mono text-xs">{r.ip}</span> },
        { key: "location", header: "Location", cell: (r) => r.location },
        { key: "os", header: "OS", cell: (r) => r.os },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        ...(canEdit ? [{
          key: "actions",
          header: "",
          cell: (r: any) => (
            <div className="flex justify-end">
              <ConfirmDeleteButton
                onConfirm={async () => {
                  try {
                    await remove('servers', r.id);
                    toast.success('Moved to Trash');
                  } catch (e) {
                    toast.error('Delete failed');
                  }
                }}
              />
            </div>
          )
        }] : [])
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("servers", {
              id: makeId("sv"),
              name: v.name,
              provider: v.provider,
              ip: v.ip,
              location: v.location,
              os: v.os || "Ubuntu 24.04",
              status: "online",
            });
            close();
          }}
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { 
              name: "provider", 
              label: "Provider", 
              type: "select",
              defaultValue: "Hostinger",
              options: [
                // Most used first
                { value: "Hostinger", label: "Hostinger" },
                { value: "GoDaddy", label: "GoDaddy" },
                { value: "DigitalOcean", label: "DigitalOcean" },
                { value: "AWS", label: "Amazon Web Services (AWS)" },
                { value: "Google Cloud", label: "Google Cloud Platform" },
                { value: "Microsoft Azure", label: "Microsoft Azure" },
                { value: "Cloudflare", label: "Cloudflare" },
                { value: "Namecheap", label: "Namecheap" },
                { value: "Bluehost", label: "Bluehost" },
                { value: "SiteGround", label: "SiteGround" },
                { value: "Hetzner", label: "Hetzner" },
                { value: "Vultr", label: "Vultr" },
                { value: "Linode", label: "Linode (Akamai)" },
                { value: "OVH", label: "OVH" },
                { value: "DreamHost", label: "DreamHost" },
                { value: "A2 Hosting", label: "A2 Hosting" },
                { value: "InMotion Hosting", label: "InMotion Hosting" },
                { value: "WP Engine", label: "WP Engine" },
                { value: "Kinsta", label: "Kinsta" },
                { value: "Rackspace", label: "Rackspace" },
                { value: "IBM Cloud", label: "IBM Cloud" },
                { value: "Oracle Cloud", label: "Oracle Cloud" },
                { value: "Contabo", label: "Contabo" },
                { value: "Other", label: "Other" },
              ]
            },
            { name: "ip", label: "IP", type: "text" },
            { name: "location", label: "Location", type: "text" },
            { name: "os", label: "OS", type: "text", defaultValue: "Ubuntu 24.04" },
          ]}
        />
      )}
    />
  );
}
