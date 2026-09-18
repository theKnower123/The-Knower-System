import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import {
  CalendarCheck,
  PhoneCall,
  Mail,
  MessageSquare,
  Handshake,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  BarChart3,
  TrendingUp,
  Target,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: string;
  source: string | null;
  utm_campaign: string | null;
  utm_source: string | null;
  follow_up_date: string | null;
  assignedAgent?: { name: string };
  followups?: Array<{
    id: number;
    channel: string;
    notes: string;
    outcome: string;
    created_at: string;
    creator?: { name: string };
  }>;
}

interface Props {
  leadsDueSoon: Lead[];
  allLeads: { data: Lead[]; links: any[] };
  recentFollowups: Array<{
    id: number;
    channel: string;
    notes: string;
    outcome: string;
    follow_up_date: string;
    lead?: { id: number; name: string };
    creator?: { name: string };
    created_at: string;
  }>;
}

export default function SalesPipelineSchedulerPage({
  leadsDueSoon,
  allLeads,
  recentFollowups,
}: Props) {
  const [activeTab, setActiveTab] = useState<"scheduler" | "all" | "reports">("scheduler");
  const [logModalLead, setLogModalLead] = useState<Lead | null>(null);

  // Followup Form States
  const [channel, setChannel] = useState("call");
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("interested");
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().split("T")[0]);
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");

  // Reports Data
  const [reportsData, setReportsData] = useState<any>(null);

  const fetchReports = async () => {
    try {
      const res = await fetch("/crm/leads/sales-reports");
      const json = await res.json();
      if (json.success) setReportsData(json);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTab === "reports") {
      fetchReports();
    }
  }, [activeTab]);

  const handleLogFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logModalLead) return;

    router.post(
      `/crm/leads/${logModalLead.id}/log-followup`,
      {
        channel,
        notes,
        outcome,
        follow_up_date: followUpDate,
        next_follow_up_date: nextFollowUpDate || null,
      },
      {
        onSuccess: () => {
          setLogModalLead(null);
          setNotes("");
          setNextFollowUpDate("");
        },
      }
    );
  };

  const getChannelIcon = (chn: string) => {
    switch (chn) {
      case "phone":
      case "call":
        return <PhoneCall className="w-4 h-4 text-emerald-500" />;
      case "email":
        return <Mail className="w-4 h-4 text-blue-500" />;
      case "whatsapp":
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      default:
        return <Handshake className="w-4 h-4 text-purple-500" />;
    }
  };

  const isOverdue = (dateStr: string | null) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date(new Date().toDateString());
  };

  const isToday = (dateStr: string | null) => {
    if (!dateStr) return false;
    return dateStr === new Date().toISOString().split("T")[0];
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/40 rounded-xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Sales Pipeline & Follow-up Scheduler</h1>
              <p className="text-sm text-muted-foreground">
                Surface leads due soon, log call outcomes, set next steps, and track conversion reports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("scheduler")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "scheduler" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Clock className="w-4 h-4" /> Due Soon & Actionable Leads ({leadsDueSoon.length})
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Target className="w-4 h-4" /> All Leads Pipeline
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "reports" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Sales Conversion Reports
        </button>
      </div>

      {/* TAB 1: SCHEDULER */}
      {activeTab === "scheduler" && (
        <div className="space-y-6">
          {/* Leads Due Soon Cards */}
          <div className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-muted/40 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Actionable Leads Queue
              </h3>
              <span className="text-xs text-muted-foreground">Prioritized by Follow-up Date</span>
            </div>

            <div className="divide-y divide-border/40">
              {leadsDueSoon.map((lead) => (
                <div key={lead.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-foreground">{lead.name}</h4>
                      {lead.company && <span className="text-xs text-muted-foreground">({lead.company})</span>}
                      <Badge variant="outline" className="capitalize text-[10px]">
                        Status: {lead.status}
                      </Badge>
                      {isOverdue(lead.follow_up_date) && (
                        <Badge className="bg-red-500/15 text-red-600 border-red-300">Overdue</Badge>
                      )}
                      {isToday(lead.follow_up_date) && (
                        <Badge className="bg-amber-500/15 text-amber-600 border-amber-300">Due Today</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span>📧 {lead.email}</span>
                      {lead.phone && <span>📞 {lead.phone}</span>}
                      <span>Source: <strong className="text-foreground">{lead.source || "Direct"}</strong></span>
                      {lead.utm_campaign && (
                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                          UTM: {lead.utm_campaign}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setLogModalLead(lead);
                      setFollowUpDate(new Date().toISOString().split("T")[0]);
                    }}
                    className="gap-2 shrink-0"
                  >
                    <CalendarCheck className="w-4 h-4" /> Log Follow-up
                  </Button>
                </div>
              ))}

              {leadsDueSoon.length === 0 && (
                <div className="p-12 text-center text-muted-foreground space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-sm font-medium">All follow-ups completed! No pending leads due soon.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Follow-ups Timeline */}
          <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Recent Follow-up Logs & Outcomes
            </h3>

            <div className="space-y-3">
              {recentFollowups.map((fu) => (
                <div key={fu.id} className="p-3.5 bg-secondary/30 rounded-lg border border-border/40 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      {getChannelIcon(fu.channel)}
                      <span>{fu.lead?.name || "Lead"}</span>
                      <Badge variant="outline" className="capitalize text-[10px] bg-background">
                        Outcome: {fu.outcome.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{fu.notes}</p>
                  </div>
                  <span className="text-muted-foreground font-mono text-[11px] shrink-0">
                    {fu.created_at ? new Date(fu.created_at).toLocaleDateString() : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL LEADS PIPELINE */}
      {activeTab === "all" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-card border border-border/40 rounded-xl p-4 shadow-sm">
            <div>
              <h3 className="font-bold text-sm">Full Sales Pipeline</h3>
              <p className="text-xs text-muted-foreground">Kanban board representation of all leads in the system.</p>
            </div>
            <div className="flex gap-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <Input placeholder="Search leads..." className="pl-9 h-9 text-xs w-64" />
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[500px]">
            {["new", "contacted", "qualified", "proposal", "converted", "not_interested", "lost"].map((pipelineStatus) => {
              const columnLeads = allLeads?.data?.filter(
                (l) => (l.status || "new").toLowerCase().replace(" ", "_") === pipelineStatus
              ) || [];

              // Skip empty columns except for core ones
              if (columnLeads.length === 0 && !["new", "contacted", "qualified", "proposal"].includes(pipelineStatus)) {
                return null;
              }

              return (
                <div key={pipelineStatus} className="min-w-[280px] w-[280px] flex-shrink-0 bg-secondary/30 rounded-xl border border-border/40 flex flex-col max-h-[800px]">
                  <div className="p-3 border-b border-border/50 flex justify-between items-center sticky top-0 bg-secondary/80 backdrop-blur-sm z-10 rounded-t-xl">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${
                        pipelineStatus === "new" ? "bg-blue-500" :
                        pipelineStatus === "contacted" ? "bg-amber-500" :
                        pipelineStatus === "qualified" ? "bg-purple-500" :
                        pipelineStatus === "proposal" ? "bg-sky-500" :
                        pipelineStatus === "converted" || pipelineStatus === "won" ? "bg-emerald-500" : "bg-red-500"
                      }`} />
                      {pipelineStatus.replace("_", " ")}
                    </h4>
                    <Badge variant="secondary" className="text-[10px] font-mono">{columnLeads.length}</Badge>
                  </div>

                  <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                    {columnLeads.map((lead) => (
                      <div key={lead.id} className="bg-card border border-border/40 rounded-lg p-3 shadow-xs hover:shadow-sm transition-all space-y-2 cursor-pointer group">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-sm text-foreground line-clamp-1">{lead.name}</h5>
                          {isOverdue(lead.follow_up_date) && <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">{lead.company || lead.email}</p>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                          <span className="text-[10px] text-muted-foreground font-mono bg-secondary px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lead.follow_up_date ? new Date(lead.follow_up_date).toLocaleDateString() : 'No date'}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setLogModalLead(lead);
                              setFollowUpDate(new Date().toISOString().split("T")[0]);
                            }}
                            className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Log Activity
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {columnLeads.length === 0 && (
                      <div className="p-4 text-center border border-dashed border-border/60 rounded-lg text-muted-foreground text-xs">
                        No leads in this stage.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SALES REPORTS */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border/40 rounded-xl p-5 space-y-1">
              <span className="text-xs text-muted-foreground">Total Ingested Leads</span>
              <p className="text-3xl font-bold text-foreground">{reportsData?.total_leads || 0}</p>
            </div>
            <div className="bg-card border border-border/40 rounded-xl p-5 space-y-1">
              <span className="text-xs text-muted-foreground">Converted Clients (Won)</span>
              <p className="text-3xl font-bold text-emerald-600">{reportsData?.converted_leads || 0}</p>
            </div>
            <div className="bg-card border border-border/40 rounded-xl p-5 space-y-1">
              <span className="text-xs text-muted-foreground">Lead-to-Client Conversion Rate</span>
              <p className="text-3xl font-bold text-primary">{reportsData?.conversion_rate || "0"}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leads by Source */}
            <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Inbound Leads by Source (UTM Tagged)
              </h3>

              <div className="space-y-2">
                {reportsData?.leads_by_source?.map((src: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg text-xs">
                    <span className="font-semibold">{src.source_name}</span>
                    <Badge variant="secondary" className="font-mono font-bold">
                      {src.total_leads} leads
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* CPL per Platform */}
            <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" /> Platform Cost-Per-Lead (CPL)
              </h3>

              <div className="space-y-2">
                {reportsData?.cpl_per_platform?.map((p: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg text-xs">
                    <span className="font-semibold capitalize">{p.platform}</span>
                    <span className="font-mono text-emerald-600 font-bold">${p.cpl} / lead</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Follow-up Modal */}
      {logModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-primary" /> Log Follow-up for {logModalLead.name}
              </h2>
              <button onClick={() => setLogModalLead(null)} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
            </div>

            <form onSubmit={handleLogFollowup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Communication Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="call">Phone Call 📞</option>
                  <option value="email">Email ✉️</option>
                  <option value="whatsapp">WhatsApp Message 💬</option>
                  <option value="meeting">In-Person / Video Meeting 🤝</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Call / Meeting Outcome</label>
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="interested">Interested (Keep Nurturing)</option>
                  <option value="callback_requested">Callback Requested</option>
                  <option value="proposal_sent">Quotation / Proposal Sent</option>
                  <option value="converted">Converted to Client (Won 🎉)</option>
                  <option value="not_interested">Not Interested (Lost)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Follow-up Notes & Discussion Summary</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Record client responses, budget discussions, or requested features..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Next Follow-up Date (Auto Notification Reminder)</label>
                <Input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setLogModalLead(null)}>Cancel</Button>
                <Button type="submit">Save Follow-up</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
