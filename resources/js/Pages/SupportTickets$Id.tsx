import { Link } from "@inertiajs/react";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, update } from "@/mocks/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { shortDate } from "@/lib/format";
import { makeId } from "@/mocks/data";

export default function TicketDetail() {
  const id = window.location.pathname.split("/").pop();
  const tickets = useCollection("tickets");
  const clients = useCollection("clients");
  const ticket = tickets.find((t) => t.id === id);
  const [reply, setReply] = useState("");

  if (!ticket) {
    return (
      <div>
        <Button variant="ghost" asChild><Link href="/support/tickets"><ArrowLeft className="me-1 h-4 w-4" />Back</Link></Button>
        <p className="mt-4 text-muted-foreground">Ticket not found.</p>
      </div>
    );
  }
  const client = clients.find((c) => c.id === ticket.clientId);

  const send = () => {
    if (!reply.trim()) return;
    update("tickets", ticket.id, {
      messages: [...ticket.messages, { id: makeId("m"), sender: "Support", message: reply, createdAt: new Date().toISOString() }],
    });
    setReply("");
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="w-fit"><Link href="/support/tickets"><ArrowLeft className="me-1 h-4 w-4" />Back to tickets</Link></Button>
      <PageHeader
        title={ticket.subject}
        description={`${ticket.number} · ${client?.name ?? "—"}`}
        actions={<div className="flex items-center gap-2"><StatusBadge value={ticket.priority} /><StatusBadge value={ticket.status} /></div>}
      />
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-4">
          {ticket.messages.map((m: any) => (
            <div key={m.id} className="rounded-lg border border-border/60 bg-background p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{m.sender}</span>
                <span>{shortDate(m.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm">{m.message}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2">
          <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type a reply…" />
          <div className="flex justify-end">
            <Button onClick={send}><Send className="me-1 h-4 w-4" />Send reply</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
