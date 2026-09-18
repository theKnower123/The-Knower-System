import React, { useState } from "react";
import { toast } from "sonner";
import { ResourcePage } from "@/components/resource-page";
import { useAuth } from "@/store/auth";
import { roleHas, type Role } from "@/lib/permissions";
import { useCollection, add, update, remove } from "@/mocks/store";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { EditIconButton } from "@/components/edit-icon-button";
import { 
  Plus, Trash2, Globe, Smartphone, Cloud, Server, Code, Search, 
  Megaphone, Palette, Compass, Wrench, Layers, HelpCircle, CheckCircle2,
  FileText, Image as ImageIcon, Cpu, Zap, ArrowUpRight
} from "lucide-react";

// Available Lucide icons list for selection
const ICON_OPTIONS = [
  "Globe", "Smartphone", "Monitor", "Cloud", "Code", "Server", 
  "Search", "Megaphone", "Palette", "Compass", "Wrench", "Zap", "Layers", "Cpu"
];

function getIconComponent(iconName?: string) {
  switch (iconName) {
    case "Smartphone": return Smartphone;
    case "Cloud": return Cloud;
    case "Server": return Server;
    case "Code": return Code;
    case "Search": return Search;
    case "Megaphone": return Megaphone;
    case "Palette": return Palette;
    case "Compass": return Compass;
    case "Wrench": return Wrench;
    case "Zap": return Zap;
    case "Layers": return Layers;
    case "Cpu": return Cpu;
    default: return Globe;
  }
}

export default function CmsServicesPage() {
  const { user } = useAuth();
  const canEdit = user ? roleHas(user.role as Role, "cms.manage") : false;
  const rows = useCollection("servicesCms");

  const [editingRow, setEditingRow] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [activeTab, setActiveTab] = useState<"general" | "media" | "features" | "benefits" | "process" | "tech" | "faqs" | "seo">("general");
  const [formState, setFormState] = useState<any>({});

  const openEditModal = (row: any) => {
    setFormState({
      id: row.id,
      name: row.name || row.title || "",
      slug: row.slug || "",
      tagline: row.tagline || "",
      badge_label: row.badge_label || "",
      cta_label: row.cta_label || "Get Started",
      description: row.description || "",
      full_description: row.full_description || "",
      hero_image: row.hero_image || "",
      icon: row.icon || "Globe",
      is_published: row.is_published ?? row.is_active ?? true,
      is_active: row.is_active ?? true,
      sort_order: row.sort_order ?? 0,
      features: Array.isArray(row.features) ? row.features : [],
      benefits: Array.isArray(row.benefits) ? row.benefits : [],
      process_steps: Array.isArray(row.process_steps) ? row.process_steps : [],
      tech_stack: Array.isArray(row.tech_stack) ? row.tech_stack : [],
      faqs: Array.isArray(row.faqs) ? row.faqs : [],
      seo_title: row.seo_title || "",
      seo_description: row.seo_description || "",
      seo_keywords: row.seo_keywords || "",
    });
    setEditingRow(row);
    setIsCreating(false);
    setActiveTab("general");
  };

  const openCreateModal = () => {
    setFormState({
      name: "",
      slug: "",
      tagline: "",
      badge_label: "",
      cta_label: "Get Started",
      description: "",
      full_description: "",
      hero_image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80",
      icon: "Globe",
      is_published: true,
      is_active: true,
      sort_order: 0,
      features: [
        { title: "Core Feature 1", description: "High performance solution description." },
        { title: "Core Feature 2", description: "Scalable architecture and security." }
      ],
      benefits: [
        { title: "Rapid Delivery", description: "3x faster time to market." },
        { title: "99.99% Uptime", description: "Enterprise cloud reliability." }
      ],
      process_steps: [
        { step: 1, title: "Discovery & Blueprinting", description: "Requirements gathering and architecture." },
        { step: 2, title: "Design & Development", description: "Iterative sprints with continuous feedback." },
        { step: 3, title: "QA & Deployment", description: "Testing and production launch." }
      ],
      tech_stack: [
        { name: "React / Next.js", category: "Frontend" },
        { name: "Laravel", category: "Backend" }
      ],
      faqs: [
        { question: "How long does custom development take?", answer: "Typical engagements range from 4 to 12 weeks depending on scope." }
      ],
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
    });
    setEditingRow({});
    setIsCreating(true);
    setActiveTab("general");
  };

  const closeModal = () => {
    setEditingRow(null);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name) return toast.error("Service title/name is required");
    if (!formState.slug) return toast.error("Slug is required");

    const payload = {
      ...formState,
      title: formState.name,
      is_published: Boolean(formState.is_published),
      is_active: Boolean(formState.is_active),
    };

    try {
      if (isCreating) {
        await add("servicesCms", payload);
        toast.success("Service created successfully!");
      } else {
        await update("servicesCms", formState.id, payload);
        toast.success("Service updated successfully!");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save service");
    }
  };

  // Helper dynamic array operations
  const addFeature = () => setFormState((prev: any) => ({ ...prev, features: [...(prev.features || []), { title: "", description: "" }] }));
  const removeFeature = (idx: number) => setFormState((prev: any) => ({ ...prev, features: prev.features.filter((_: any, i: number) => i !== idx) }));

  const addBenefit = () => setFormState((prev: any) => ({ ...prev, benefits: [...(prev.benefits || []), { title: "", description: "" }] }));
  const removeBenefit = (idx: number) => setFormState((prev: any) => ({ ...prev, benefits: prev.benefits.filter((_: any, i: number) => i !== idx) }));

  const addProcessStep = () => setFormState((prev: any) => ({
    ...prev,
    process_steps: [...(prev.process_steps || []), { step: (prev.process_steps?.length || 0) + 1, title: "", description: "" }]
  }));
  const removeProcessStep = (idx: number) => setFormState((prev: any) => ({
    ...prev,
    process_steps: prev.process_steps.filter((_: any, i: number) => i !== idx)
  }));

  const addTechStack = () => setFormState((prev: any) => ({ ...prev, tech_stack: [...(prev.tech_stack || []), { name: "", category: "Frontend" }] }));
  const removeTechStack = (idx: number) => setFormState((prev: any) => ({ ...prev, tech_stack: prev.tech_stack.filter((_: any, i: number) => i !== idx) }));

  const addFaq = () => setFormState((prev: any) => ({ ...prev, faqs: [...(prev.faqs || []), { question: "", answer: "" }] }));
  const removeFaq = (idx: number) => setFormState((prev: any) => ({ ...prev, faqs: prev.faqs.filter((_: any, i: number) => i !== idx) }));

  return (
    <>
      <ResourcePage
        hideNewButton={true}
        hideTrashButton={!canEdit}
        collectionKey="servicesCms"
        title="Services Management"
        description="Create, edit, and manage dynamic service pages, features, workflows, tech stack, and FAQs."
        rows={rows}
        extraActions={
          canEdit ? (
            <Button onClick={openCreateModal} className="gap-1">
              <Plus className="h-4 w-4" />
              New Service
            </Button>
          ) : null
        }
        columns={[
        {
          key: "name",
          header: "Service",
          cell: (r: any) => {
            const IconComp = getIconComponent(r.icon);
            return (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconComp className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    {r.name || r.title}
                    {r.badge_label && (
                      <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                        {r.badge_label}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">/services/{r.slug}</div>
                </div>
              </div>
            );
          }
        },
        { 
          key: "tagline", 
          header: "Tagline", 
          cell: (r: any) => <span className="text-xs text-muted-foreground line-clamp-1">{r.tagline || r.description || "—"}</span> 
        },
        { 
          key: "is_active", 
          header: "Published", 
          cell: (r: any) => (
            <div className="flex items-center gap-2">
              <Switch 
                checked={r.is_published ?? r.is_active ?? true} 
                onCheckedChange={async (checked) => {
                  try {
                    await update("servicesCms", r.id, { is_published: checked, is_active: checked });
                    toast.success("Service status updated");
                  } catch (e) {
                    toast.error("Failed to update status");
                  }
                }}
              />
              <span className="text-xs text-muted-foreground">
                {(r.is_published ?? r.is_active ?? true) ? "Active" : "Draft"}
              </span>
            </div>
          ) 
        },
        {
          key: "actions",
          header: "Actions",
          cell: (r: any) => (
            <div className="flex gap-2 justify-end items-center">
              <a 
                href={`/services/${r.slug}`}
                target="_blank" 
                rel="noreferrer" 
                className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                title="View Service Details Page"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <EditIconButton
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(r);
                }}
              />
              <ConfirmDeleteButton
                onConfirm={async () => {
                  try {
                    await remove('servicesCms', r.id);
                    toast.success('Deleted successfully.');
                  } catch (err) {
                    toast.error('Failed to delete.');
                  }
                }}
              />
            </div>
          )
        }
      ]}
    />

      {/* Dynamic Rich Service Modal Editor */}
      {(editingRow !== null || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden my-8">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-5 bg-muted/30">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  {isCreating ? "Create New Service" : `Edit Service: ${formState.name || formState.slug}`}
                </h2>
                <p className="text-xs text-muted-foreground">Configure complete content, workflow, features, FAQs, and SEO for this service.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={closeModal} className="h-8 w-8 p-0">✕</Button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border bg-muted/10 overflow-x-auto px-4 gap-1">
              {[
                { id: "general", label: "General & Hero", icon: FileText },
                { id: "media", label: "Media & Badge", icon: ImageIcon },
                { id: "features", label: "Features", icon: Zap },
                { id: "benefits", label: "Benefits", icon: CheckCircle2 },
                { id: "process", label: "Workflow/Process", icon: Layers },
                { id: "tech", label: "Tech Stack", icon: Cpu },
                { id: "faqs", label: "FAQs", icon: HelpCircle },
                { id: "seo", label: "SEO Meta", icon: Search },
              ].map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                      active 
                        ? "border-primary text-primary bg-card" 
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* TAB 1: General */}
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="s-name">Service Title / Name *</Label>
                      <Input 
                        id="s-name" 
                        required
                        value={formState.name || ""} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormState((prev: any) => ({
                            ...prev,
                            name: val,
                            // Auto-slugify if slug is empty
                            slug: prev.slug ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                          }));
                        }}
                        placeholder="e.g. Web Development" 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="s-slug">URL Slug *</Label>
                      <Input 
                        id="s-slug" 
                        required
                        value={formState.slug || ""} 
                        onChange={(e) => setFormState((prev: any) => ({ ...prev, slug: e.target.value }))}
                        placeholder="e.g. web-development" 
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Lucide Icon</Label>
                      <select 
                        value={formState.icon || "Globe"}
                        onChange={(e) => setFormState((prev: any) => ({ ...prev, icon: e.target.value }))}
                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        {ICON_OPTIONS.map((ic) => (
                          <option key={ic} value={ic}>{ic}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="s-tagline">Short Tagline</Label>
                      <Input 
                        id="s-tagline"
                        value={formState.tagline || ""} 
                        onChange={(e) => setFormState((prev: any) => ({ ...prev, tagline: e.target.value }))}
                        placeholder="e.g. High-performance web apps." 
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="s-desc">Short Overview / Card Description</Label>
                    <Textarea 
                      id="s-desc"
                      rows={2}
                      value={formState.description || ""} 
                      onChange={(e) => setFormState((prev: any) => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief overview displayed on service cards..." 
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s-full-desc">Detailed / Professional Full Description</Label>
                    <Textarea 
                      id="s-full-desc"
                      rows={5}
                      value={formState.full_description || ""} 
                      onChange={(e) => setFormState((prev: any) => ({ ...prev, full_description: e.target.value }))}
                      placeholder="Provide comprehensive details about what this service offers, methodologies, and outcomes..." 
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <Switch 
                        id="s-pub"
                        checked={Boolean(formState.is_published)}
                        onCheckedChange={(c) => setFormState((prev: any) => ({ ...prev, is_published: c, is_active: c }))}
                      />
                      <Label htmlFor="s-pub" className="cursor-pointer">Published & Visible on Website</Label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Media & Badge */}
              {activeTab === "media" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="s-badge">Badge Label</Label>
                      <Input 
                        id="s-badge"
                        value={formState.badge_label || ""} 
                        onChange={(e) => setFormState((prev: any) => ({ ...prev, badge_label: e.target.value }))}
                        placeholder="e.g. High-Performance Web Solutions" 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="s-cta">Call To Action Button Label</Label>
                      <Input 
                        id="s-cta"
                        value={formState.cta_label || ""} 
                        onChange={(e) => setFormState((prev: any) => ({ ...prev, cta_label: e.target.value }))}
                        placeholder="e.g. Start Your Project" 
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="s-hero-img">Hero Illustration / Image URL</Label>
                    <Input 
                      id="s-hero-img"
                      value={formState.hero_image || ""} 
                      onChange={(e) => setFormState((prev: any) => ({ ...prev, hero_image: e.target.value }))}
                      placeholder="https://images.unsplash.com/..." 
                      className="mt-1"
                    />
                  </div>

                  {formState.hero_image && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-border h-44 bg-muted/30 relative">
                      <img 
                        src={formState.hero_image} 
                        alt="Hero preview" 
                        className="w-full h-full object-cover"
                        onError={(e: any) => { e.target.style.display = 'none'; }}
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur">
                        Hero Image Preview
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Features */}
              {activeTab === "features" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Key Features</h4>
                      <p className="text-xs text-muted-foreground">Add core highlights and features of this service.</p>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={addFeature} className="gap-1">
                      <Plus className="h-3.5 w-3.5" /> Add Feature
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(formState.features || []).map((feat: any, idx: number) => (
                      <div key={idx} className="flex gap-3 items-start p-3 rounded-xl border border-border bg-muted/20">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary mt-1">
                          {idx + 1}
                        </span>
                        <div className="grid gap-2 flex-1 sm:grid-cols-2">
                          <Input 
                            placeholder="Feature Title"
                            value={feat.title || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormState((prev: any) => {
                                const next = [...prev.features];
                                next[idx] = { ...next[idx], title: val };
                                return { ...prev, features: next };
                              });
                            }}
                          />
                          <Input 
                            placeholder="Feature Description"
                            value={feat.description || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormState((prev: any) => {
                                const next = [...prev.features];
                                next[idx] = { ...next[idx], description: val };
                                return { ...prev, features: next };
                              });
                            }}
                          />
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(idx)} className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(!formState.features || formState.features.length === 0) && (
                      <div className="text-center py-6 text-xs text-muted-foreground border border-dashed rounded-xl">No features added yet. Click Add Feature.</div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: Benefits */}
              {activeTab === "benefits" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Key Benefits & Outcomes</h4>
                      <p className="text-xs text-muted-foreground">List measurable advantages for clients choosing this service.</p>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={addBenefit} className="gap-1">
                      <Plus className="h-3.5 w-3.5" /> Add Benefit
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(formState.benefits || []).map((ben: any, idx: number) => (
                      <div key={idx} className="flex gap-3 items-start p-3 rounded-xl border border-border bg-muted/20">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-2" />
                        <div className="grid gap-2 flex-1 sm:grid-cols-2">
                          <Input 
                            placeholder="Benefit Title (e.g. 3x Faster Launch)"
                            value={ben.title || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormState((prev: any) => {
                                const next = [...prev.benefits];
                                next[idx] = { ...next[idx], title: val };
                                return { ...prev, benefits: next };
                              });
                            }}
                          />
                          <Input 
                            placeholder="Description / Impact"
                            value={ben.description || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormState((prev: any) => {
                                const next = [...prev.benefits];
                                next[idx] = { ...next[idx], description: val };
                                return { ...prev, benefits: next };
                              });
                            }}
                          />
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeBenefit(idx)} className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Workflow / Process */}
              {activeTab === "process" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Development Workflow & Steps</h4>
                      <p className="text-xs text-muted-foreground">Define step-by-step methodology for executing this service.</p>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={addProcessStep} className="gap-1">
                      <Plus className="h-3.5 w-3.5" /> Add Step
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(formState.process_steps || []).map((proc: any, idx: number) => (
                      <div key={idx} className="flex gap-3 items-start p-3 rounded-xl border border-border bg-muted/20">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs mt-1">
                          {idx + 1}
                        </div>
                        <div className="grid gap-2 flex-1 sm:grid-cols-2">
                          <Input 
                            placeholder="Step Title (e.g. Discovery & Architecture)"
                            value={proc.title || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormState((prev: any) => {
                                const next = [...prev.process_steps];
                                next[idx] = { ...next[idx], title: val };
                                return { ...prev, process_steps: next };
                              });
                            }}
                          />
                          <Input 
                            placeholder="Step Description"
                            value={proc.description || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormState((prev: any) => {
                                const next = [...prev.process_steps];
                                next[idx] = { ...next[idx], description: val };
                                return { ...prev, process_steps: next };
                              });
                            }}
                          />
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeProcessStep(idx)} className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: Tech Stack */}
              {activeTab === "tech" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Technologies & Stack</h4>
                      <p className="text-xs text-muted-foreground">List frameworks, tools, and platforms utilized for this service.</p>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={addTechStack} className="gap-1">
                      <Plus className="h-3.5 w-3.5" /> Add Technology
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(formState.tech_stack || []).map((tech: any, idx: number) => (
                      <div key={idx} className="flex gap-3 items-center p-3 rounded-xl border border-border bg-muted/20">
                        <Cpu className="h-4 w-4 text-primary shrink-0" />
                        <div className="grid gap-2 flex-1 sm:grid-cols-2">
                          <Input 
                            placeholder="Tech Name (e.g. React / Next.js)"
                            value={tech.name || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormState((prev: any) => {
                                const next = [...prev.tech_stack];
                                next[idx] = { ...next[idx], name: val };
                                return { ...prev, tech_stack: next };
                              });
                            }}
                          />
                          <Input 
                            placeholder="Category (e.g. Frontend, Backend, Cloud)"
                            value={tech.category || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormState((prev: any) => {
                                const next = [...prev.tech_stack];
                                next[idx] = { ...next[idx], category: val };
                                return { ...prev, tech_stack: next };
                              });
                            }}
                          />
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeTechStack(idx)} className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: FAQs */}
              {activeTab === "faqs" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Frequently Asked Questions (FAQ)</h4>
                      <p className="text-xs text-muted-foreground">Service-specific Q&A displayed on the service details page.</p>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={addFaq} className="gap-1">
                      <Plus className="h-3.5 w-3.5" /> Add FAQ
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(formState.faqs || []).map((faq: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl border border-border bg-muted/20 space-y-2 relative pr-10">
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFaq(idx)} className="absolute top-2 right-2 h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div>
                          <Label className="text-xs">Question {idx + 1}</Label>
                          <Input 
                            placeholder="e.g. How long does development take?"
                            value={faq.question || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormState((prev: any) => {
                                const next = [...prev.faqs];
                                next[idx] = { ...next[idx], question: val };
                                return { ...prev, faqs: next };
                              });
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Answer</Label>
                          <Textarea 
                            rows={2}
                            placeholder="Detailed explanation..."
                            value={faq.answer || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormState((prev: any) => {
                                const next = [...prev.faqs];
                                next[idx] = { ...next[idx], answer: val };
                                return { ...prev, faqs: next };
                              });
                            }}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: SEO */}
              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="s-seo-title">SEO Page Title</Label>
                    <Input 
                      id="s-seo-title"
                      value={formState.seo_title || ""} 
                      onChange={(e) => setFormState((prev: any) => ({ ...prev, seo_title: e.target.value }))}
                      placeholder="e.g. Web Development Services | The Knower" 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="s-seo-desc">SEO Meta Description</Label>
                    <Textarea 
                      id="s-seo-desc"
                      rows={3}
                      value={formState.seo_description || ""} 
                      onChange={(e) => setFormState((prev: any) => ({ ...prev, seo_description: e.target.value }))}
                      placeholder="Brief description optimized for search engine results..." 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="s-seo-key">SEO Keywords</Label>
                    <Input 
                      id="s-seo-key"
                      value={formState.seo_keywords || ""} 
                      onChange={(e) => setFormState((prev: any) => ({ ...prev, seo_keywords: e.target.value }))}
                      placeholder="web development, react, nextjs, software house" 
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between border-t border-border pt-4 mt-6">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {isCreating ? "Create Service" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}