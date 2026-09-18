import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, FileText, ListChecks, ClipboardList, Bug as BugIcon, LifeBuoy, BookOpen, Send } from "lucide-react";

const quickActions = [
  { key: "quotation", labelKey: "ai.actions.quotation", icon: FileText, reply: "Here's a draft quotation with itemized scope, timeline, and price." },
  { key: "tasks", labelKey: "ai.actions.tasks", icon: ListChecks, reply: "I broke the project into 24 tasks across 4 milestones." },
  { key: "summary", labelKey: "ai.actions.summary", icon: ClipboardList, reply: "Project is 55% complete, 2 tasks in review, 1 blocker on inventory API." },
  { key: "bug", labelKey: "ai.actions.bug", icon: BugIcon, reply: "This looks like a race condition in the stock adjustment handler." },
  { key: "ticket", labelKey: "ai.actions.ticket", icon: LifeBuoy, reply: "Client reports 500 on March invoices export. Suggested fix: check date range parsing." },
  { key: "docs", labelKey: "ai.actions.docs", icon: BookOpen, reply: "Generated API reference for the inventory endpoints." },
];

type Msg = { role: "user" | "assistant"; text: string };

export default function AIPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Hi! I'm your Knower AI copilot. Try a quick action, or ask me anything about your projects." },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: mockReply(text) }]);
    setInput("");
  };

  const runAction = (r: string) => setMessages((m) => [...m, { role: "assistant", text: r }]);

  return (
    <div className="space-y-6">
      <PageHeader title={t("ai.title")} description={t("ai.subtitle")} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {quickActions.map((a) => (
          <button
            key={a.key}
            onClick={() => runAction(a.reply)}
            className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 text-start transition-colors hover:border-primary/50"
          >
            <div className="rounded-lg bg-primary/10 p-2 text-primary"><a.icon className="h-4 w-4" /></div>
            <span className="text-xs font-medium leading-tight">{t(a.labelKey)}</span>
          </button>
        ))}
      </div>
      <div className="flex h-[520px] flex-col rounded-xl border border-border bg-card">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start gap-3"}>
              {m.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
              <div
                className={
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm " +
                  (m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")
                }
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("ai.chatPlaceholder")}
              className="min-h-[44px] max-h-32"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <Button onClick={() => send(input)}><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function mockReply(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("quote") || s.includes("quotation")) return "Draft quotation ready — 3 phases, 12 weeks, $45,000 total.";
  if (s.includes("task")) return "I split it into 18 tasks across design, backend, and QA.";
  if (s.includes("bug")) return "Likely cause: unhandled null in the reducer. Suggested patch attached.";
  return "Got it. In production this would call Lovable AI Gateway — for now it's a mocked reply.";
}
