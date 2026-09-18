import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import {
  Megaphone,
  Plus,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Calendar,
  Filter,
  Layers,
  Sparkles,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface CampaignMetric {
  id: number;
  date: string;
  reach: number;
  clicks: number;
  cost: number;
  leads_generated: number;
}

interface Campaign {
  id: number;
  name: string;
  platform: string;
  objective: "traffic" | "leads" | "awareness" | "conversions";
  budget: number;
  start_date: string;
  end_date: string | null;
  total_cost?: number;
  total_leads?: number;
  total_clicks?: number;
  total_reach?: number;
  metrics?: CampaignMetric[];
  created_at: string;
}

interface Props {
  campaigns: {
    data: Campaign[];
    links: any[];
  };
}

export default function CampaignsPage({ campaigns }: Props) {
  const [activeTab, setActiveTab] = useState<"list" | "analytics">("list");
  const [newCampaignModal, setNewCampaignModal] = useState(false);

  // New Campaign Form
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("facebook");
  const [objective, setObjective] = useState<Campaign["objective"]>("leads");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Analytics Filters & Data
  const [dateRange, setDateRange] = useState("30d");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const campaignList = campaigns?.data || [];

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`/marketing/campaigns/analytics?range=${dateRange}&platform=${platformFilter}`);
      const json = await res.json();
      if (json.success) {
        setAnalyticsData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (activeTab === "analytics") {
      fetchAnalytics();
    }
  }, [activeTab, dateRange, platformFilter]);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(
      "/marketing/campaigns",
      {
        name,
        platform,
        objective,
        budget: parseFloat(budget),
        start_date: startDate,
        end_date: endDate || null,
      },
      {
        onSuccess: () => {
          setNewCampaignModal(false);
          setName("");
          setBudget("");
          setStartDate("");
          setEndDate("");
        },
      }
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/40 rounded-xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Paid Campaigns & Performance Ads</h1>
              <p className="text-sm text-muted-foreground">
                Manage advertising campaigns across Facebook, TikTok, Google, LinkedIn & WhatsApp Business.
              </p>
            </div>
          </div>
        </div>
        <Button onClick={() => setNewCampaignModal(true)} className="gap-2">
          <Plus className="w-4 h-4" /> + New Campaign
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Layers className="w-4 h-4" /> Campaigns List ({campaignList.length})
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "analytics" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Analytics & ROI Charts
        </button>
      </div>

      {activeTab === "list" ? (
        /* Campaigns List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaignList.map((c) => {
            const cost = c.total_cost || 0;
            const leads = c.total_leads || 0;
            const cpl = leads > 0 ? (cost / leads).toFixed(2) : "0.00";

            return (
              <div
                key={c.id}
                className="bg-card border border-border/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="outline" className="capitalize text-[10px] mb-1 bg-secondary">
                        {c.platform}
                      </Badge>
                      <h3 className="font-bold text-base text-foreground leading-snug">{c.name}</h3>
                    </div>
                    <Badge className="bg-primary/15 text-primary border-primary/20 capitalize">
                      {c.objective}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
                    <div className="p-2.5 bg-muted/40 rounded-lg">
                      <span className="text-muted-foreground block text-[11px]">Budget Cap</span>
                      <span className="font-semibold text-foreground text-sm">${c.budget?.toLocaleString()}</span>
                    </div>
                    <div className="p-2.5 bg-muted/40 rounded-lg">
                      <span className="text-muted-foreground block text-[11px]">Cost-Per-Lead (CPL)</span>
                      <span className="font-semibold text-emerald-600 text-sm">${cpl}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                    <div className="flex justify-between">
                      <span>Total Reach:</span>
                      <span className="font-medium text-foreground">{(c.total_reach || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Clicks:</span>
                      <span className="font-medium text-foreground">{(c.total_clicks || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Leads Generated:</span>
                      <span className="font-bold text-primary">{leads} leads</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span>📅 {c.start_date} {c.end_date ? `to ${c.end_date}` : "(Ongoing)"}</span>
                </div>
              </div>
            );
          })}

          {campaignList.length === 0 && (
            <div className="col-span-full bg-card border border-dashed border-border rounded-xl p-12 text-center space-y-3">
              <Megaphone className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">No Paid Campaigns Created</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Set up advertising campaigns to bring in targeted leads and measure ROI.
              </p>
              <Button onClick={() => setNewCampaignModal(true)} className="gap-2 mt-2">
                <Plus className="w-4 h-4" /> Create Campaign
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Analytics Dashboard & Charts */
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-card border border-border/40 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Filter className="w-4 h-4" /> Date Range:
              </div>
              <div className="flex items-center gap-1">
                {["7d", "30d", "90d", "all"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setDateRange(r)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      dateRange === r ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Platform Filter:</span>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none"
              >
                <option value="all">All Platforms</option>
                <option value="facebook">Facebook Ads</option>
                <option value="instagram">Instagram Ads</option>
                <option value="tiktok">TikTok Ads</option>
                <option value="linkedin">LinkedIn Ads</option>
                <option value="google">Google Search/Display</option>
              </select>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-card border border-border/40 rounded-xl p-4 space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-500" /> Total Reach
              </span>
              <p className="text-2xl font-bold text-foreground">
                {(analyticsData?.totals?.total_reach || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-xl p-4 space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-purple-500" /> Total Clicks
              </span>
              <p className="text-2xl font-bold text-foreground">
                {(analyticsData?.totals?.total_clicks || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-xl p-4 space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" /> Total Spend
              </span>
              <p className="text-2xl font-bold text-foreground">
                ${(analyticsData?.totals?.total_cost || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-xl p-4 space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Total Leads
              </span>
              <p className="text-2xl font-bold text-emerald-600">
                {(analyticsData?.totals?.total_leads || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-xl p-4 space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-sky-500" /> Avg. CPL
              </span>
              <p className="text-2xl font-bold text-foreground">
                ${analyticsData?.totals?.avg_cpl || "0.00"}
              </p>
            </div>
          </div>

          {/* Platform Performance Breakdown Table */}
          <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" /> Platform ROI & Breakdown
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-3">Platform</th>
                    <th className="p-3 text-right">Reach</th>
                    <th className="p-3 text-right">Clicks</th>
                    <th className="p-3 text-right">Total Cost ($)</th>
                    <th className="p-3 text-right">Leads</th>
                    <th className="p-3 text-right">CPL ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {analyticsData?.platform_breakdown?.map((pb: any, idx: number) => {
                    const cpl = pb.leads > 0 ? (pb.cost / pb.leads).toFixed(2) : "0.00";
                    return (
                      <tr key={idx} className="hover:bg-secondary/20">
                        <td className="p-3 font-semibold capitalize flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary" /> {pb.platform}
                        </td>
                        <td className="p-3 text-right font-mono">{Number(pb.reach).toLocaleString()}</td>
                        <td className="p-3 text-right font-mono">{Number(pb.clicks).toLocaleString()}</td>
                        <td className="p-3 text-right font-mono">${Number(pb.cost).toLocaleString()}</td>
                        <td className="p-3 text-right font-bold text-emerald-600">{pb.leads}</td>
                        <td className="p-3 text-right font-semibold">${cpl}</td>
                      </tr>
                    );
                  })}

                  {(!analyticsData?.platform_breakdown || analyticsData.platform_breakdown.length === 0) && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-muted-foreground text-xs">
                        No analytics metrics logged for the selected period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {newCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" /> Launch New Paid Campaign
              </h2>
              <button onClick={() => setNewCampaignModal(false)} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Campaign Name</label>
                <Input
                  required
                  placeholder="e.g. Q3 Enterprise ERP Lead Gen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Ad Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="facebook">Facebook Ads</option>
                  <option value="instagram">Instagram Ads</option>
                  <option value="tiktok">TikTok Ads</option>
                  <option value="linkedin">LinkedIn Ads</option>
                  <option value="google">Google Ads</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Objective</label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="leads">Lead Generation</option>
                  <option value="traffic">Website Traffic</option>
                  <option value="awareness">Brand Awareness</option>
                  <option value="conversions">Direct Conversions</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Budget Cap ($)</label>
                <Input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 1500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Start Date</label>
                  <Input
                    required
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setNewCampaignModal(false)}>Cancel</Button>
                <Button type="submit">Launch Campaign</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
