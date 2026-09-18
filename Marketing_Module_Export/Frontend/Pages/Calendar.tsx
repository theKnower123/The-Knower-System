import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Upload,
  FileText,
  Filter,
  History,
  CheckCheck,
  AlertCircle,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SocialAccount {
  id: number;
  platform: string;
  handle: string;
}

interface Post {
  id: number;
  content: string;
  media_path: string | null;
  status: "draft" | "pending_approval" | "scheduled" | "published" | "rejected";
  scheduled_at: string | null;
  published_at: string | null;
  rejection_reason?: string;
  creator: { id: number; name: string };
  approver?: { id: number; name: string };
  accounts: SocialAccount[];
  status_history?: Array<{
    status: string;
    user_name: string;
    action: string;
    timestamp: string;
    notes?: string;
    reason?: string;
  }>;
  created_at: string;
}

interface Props {
  posts: {
    data: Post[];
    links: any[];
  };
  filters?: {
    status?: string;
    account_id?: string;
    search?: string;
  };
}

export default function ContentCalendarPage({ posts, filters }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "inbox" | "scheduled">("all");
  const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]);
  const [newPostModal, setNewPostModal] = useState(false);
  const [historyModalPost, setHistoryModalPost] = useState<Post | null>(null);
  const [rejectModalPost, setRejectModalPost] = useState<Post | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [bulkRejectModal, setBulkRejectModal] = useState(false);

  // New Post Form
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [accountIds, setAccountIds] = useState<number[]>([1]);
  const [submitForApprovalImmediately, setSubmitForApprovalImmediately] = useState(false);

  const postsList = posts?.data || [];

  // Approval Inbox Posts
  const pendingPosts = postsList.filter((p) => p.status === "pending_approval");

  const toggleSelectAllPending = () => {
    if (selectedPostIds.length === pendingPosts.length) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(pendingPosts.map((p) => p.id));
    }
  };

  const toggleSelectPost = (id: number) => {
    if (selectedPostIds.includes(id)) {
      setSelectedPostIds(selectedPostIds.filter((pId) => pId !== id));
    } else {
      setSelectedPostIds([...selectedPostIds, id]);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    if (mediaFile) formData.append("media", mediaFile);
    if (scheduledAt) formData.append("scheduled_at", scheduledAt);
    accountIds.forEach((id) => formData.append("account_ids[]", id.toString()));
    formData.append("status", submitForApprovalImmediately ? "pending_approval" : "draft");

    router.post("/marketing/posts", formData, {
      onSuccess: () => {
        setNewPostModal(false);
        setContent("");
        setMediaFile(null);
        setScheduledAt("");
      },
    });
  };

  const handleSubmitForApproval = (id: number) => {
    router.post(`/marketing/posts/${id}/submit`);
  };

  const handleApprove = (id: number) => {
    router.post(`/marketing/posts/${id}/approve`);
  };

  const handleRequestChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalPost) return;
    router.post(`/marketing/posts/${rejectModalPost.id}/request-changes`, {
      reason: rejectReason,
    }, {
      onSuccess: () => {
        setRejectModalPost(null);
        setRejectReason("");
      }
    });
  };

  const handleBulkApprove = () => {
    if (selectedPostIds.length === 0) return;
    router.post("/marketing/posts/bulk-approve", { post_ids: selectedPostIds }, {
      onSuccess: () => setSelectedPostIds([]),
    });
  };

  const handleBulkRequestChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPostIds.length === 0) return;
    router.post("/marketing/posts/bulk-request-changes", {
      post_ids: selectedPostIds,
      reason: rejectReason,
    }, {
      onSuccess: () => {
        setBulkRejectModal(false);
        setSelectedPostIds([]);
        setRejectReason("");
      },
    });
  };

  const getStatusBadge = (status: Post["status"]) => {
    switch (status) {
      case "published":
        return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Published</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500/15 text-blue-600 border-blue-200"><Clock className="w-3 h-3 mr-1" /> Scheduled</Badge>;
      case "pending_approval":
        return <Badge className="bg-amber-500/15 text-amber-600 border-amber-200"><AlertCircle className="w-3 h-3 mr-1" /> Pending Approval</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/15 text-red-600 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Changes Requested</Badge>;
      default:
        return <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" /> Draft</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/40 rounded-xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Content & Campaign Posts</h1>
              <p className="text-sm text-muted-foreground">
                Content calendar, publishing queue, and Marketing Admin approval inbox.
              </p>
            </div>
          </div>
        </div>
        <Button onClick={() => setNewPostModal(true)} className="gap-2">
          <Plus className="w-4 h-4" /> + New Post
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            All Posts ({postsList.length})
          </button>
          <button
            onClick={() => setActiveTab("inbox")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "inbox" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <AlertCircle className="w-4 h-4 text-amber-400" /> Approval Inbox ({pendingPosts.length})
          </button>
        </div>

        {activeTab === "inbox" && pendingPosts.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={selectedPostIds.length === 0}
              onClick={handleBulkApprove}
              className="gap-1 text-emerald-600 border-emerald-300 hover:bg-emerald-50"
            >
              <CheckCheck className="w-4 h-4" /> Bulk Approve ({selectedPostIds.length})
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={selectedPostIds.length === 0}
              onClick={() => setBulkRejectModal(true)}
              className="gap-1 text-red-600 border-red-300 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4" /> Request Changes ({selectedPostIds.length})
            </Button>
          </div>
        )}
      </div>

      {/* Posts List / Table */}
      <div className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
        {activeTab === "inbox" && (
          <div className="p-3 bg-muted/30 border-b border-border flex items-center gap-3 text-xs font-semibold text-muted-foreground">
            <input
              type="checkbox"
              checked={selectedPostIds.length === pendingPosts.length && pendingPosts.length > 0}
              onChange={toggleSelectAllPending}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span>Select All Pending Posts for Bulk Review</span>
          </div>
        )}

        <div className="divide-y divide-border/40">
          {(activeTab === "inbox" ? pendingPosts : postsList).map((post) => (
            <div key={post.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors">
              <div className="flex items-start gap-3 flex-1">
                {activeTab === "inbox" && (
                  <input
                    type="checkbox"
                    checked={selectedPostIds.includes(post.id)}
                    onChange={() => toggleSelectPost(post.id)}
                    className="mt-1 rounded border-input text-primary focus:ring-primary"
                  />
                )}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(post.status)}
                    <span className="text-xs text-muted-foreground">By {post.creator?.name || "Team"}</span>
                    {post.scheduled_at && (
                      <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded font-mono">
                        🗓 {new Date(post.scheduled_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground whitespace-pre-wrap">{post.content}</p>
                  {post.rejection_reason && (
                    <div className="p-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 rounded text-xs text-red-700 dark:text-red-300">
                      <strong>Changes Requested:</strong> {post.rejection_reason}
                    </div>
                  )}
                  {post.accounts && post.accounts.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Platforms:</span>
                      {post.accounts.map((acc) => (
                        <span key={acc.id} className="font-semibold capitalize bg-secondary px-1.5 py-0.5 rounded">
                          {acc.platform} (@{acc.handle})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHistoryModalPost(post)}
                  className="gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <History className="w-3.5 h-3.5" /> History
                </Button>

                {post.status === "draft" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSubmitForApproval(post.id)}
                    className="gap-1 text-xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit for Approval
                  </Button>
                )}

                {post.status === "pending_approval" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(post.id)}
                      className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setRejectModalPost(post)}
                      className="gap-1 text-xs"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Request Changes
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}

          {(activeTab === "inbox" ? pendingPosts : postsList).length === 0 && (
            <div className="p-12 text-center text-muted-foreground space-y-2">
              <CalendarIcon className="w-8 h-8 mx-auto text-muted-foreground/60" />
              <p className="text-sm font-medium">No posts found in this view.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Post Modal */}
      {newPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Create New Social Post
              </h2>
              <button onClick={() => setNewPostModal(false)} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Post Caption & Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write post content, hashtags, and links..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Media Attachment (Image / Video)</label>
                <Input
                  type="file"
                  onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
                  className="cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Schedule Publishing Date & Time</label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={submitForApprovalImmediately}
                    onChange={(e) => setSubmitForApprovalImmediately(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-medium text-foreground">Submit for Approval immediately after saving</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setNewPostModal(false)}>Cancel</Button>
                <Button type="submit">Create Post</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Timeline Modal */}
      {historyModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-primary" /> Post Audit History
              </h2>
              <button onClick={() => setHistoryModalPost(null)} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {historyModalPost.status_history?.map((h, idx) => (
                <div key={idx} className="p-3 bg-secondary/30 rounded-lg text-xs space-y-1 border border-border/40">
                  <div className="flex justify-between items-center font-semibold">
                    <span className="capitalize text-primary">{h.action.replace("_", " ")}</span>
                    <span className="text-muted-foreground font-mono">{h.timestamp}</span>
                  </div>
                  <p className="text-muted-foreground">By: <strong className="text-foreground">{h.user_name}</strong></p>
                  {h.reason && <p className="text-red-500">Reason: {h.reason}</p>}
                </div>
              )) || <p className="text-xs text-muted-foreground">No history logged yet.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Single Request Changes Modal */}
      {rejectModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> Request Changes
              </h2>
              <button onClick={() => setRejectModalPost(null)} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
            </div>

            <form onSubmit={handleRequestChanges} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Feedback & Rejection Notes</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain required changes for the content writer..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setRejectModalPost(null)}>Cancel</Button>
                <Button type="submit" variant="destructive">Send Feedback</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Request Changes Modal */}
      {bulkRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> Bulk Request Changes ({selectedPostIds.length})
              </h2>
              <button onClick={() => setBulkRejectModal(false)} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
            </div>

            <form onSubmit={handleBulkRequestChanges} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Feedback for All Selected Posts</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain reasons for requested changes..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setBulkRejectModal(false)}>Cancel</Button>
                <Button type="submit" variant="destructive">Submit Bulk Feedback</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
