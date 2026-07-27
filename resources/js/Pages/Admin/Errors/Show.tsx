import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Globe, Shield, User, FileText, Database, Activity, Code, Layers } from "lucide-react";

export default function Show({ errorLog }: any) {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Head title={`Error Details: ${errorLog.id}`} />
      
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/errors/developer">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Error #{errorLog.id}</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Clock className="h-3 w-3" /> {new Date(errorLog.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
            <div className="bg-muted/50 p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-500" /> Exception Info
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-sm text-muted-foreground font-medium block mb-1">Message</span>
                <div className="font-mono text-sm bg-muted/30 p-3 rounded-md text-red-500 [word-break:break-word]">
                  {errorLog.message || 'No message provided'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground font-medium block mb-1">Exception Type</span>
                  <span className="font-mono text-sm">{errorLog.exception_type || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground font-medium block mb-1">Status Code</span>
                  <span className="font-mono text-sm font-bold bg-muted px-2 py-1 rounded">{errorLog.status_code || 'N/A'}</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground font-medium block mb-1">Location</span>
                <span className="font-mono text-sm text-primary break-all">{errorLog.file}:{errorLog.line}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
            <div className="bg-muted/50 p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <Code className="h-4 w-4" /> Stack Trace
              </h3>
            </div>
            <div className="p-0">
              <pre className="font-mono text-xs p-4 overflow-x-auto whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                {errorLog.stack_trace || 'No stack trace available.'}
              </pre>
            </div>
          </div>
          
          {/* Payloads */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
              <div className="bg-muted/50 p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <Database className="h-4 w-4" /> Request Payload
                </h3>
              </div>
              <div className="p-4 bg-muted/10 h-[300px] overflow-auto">
                <pre className="font-mono text-xs">
                  {errorLog.request_payload ? JSON.stringify(errorLog.request_payload, null, 2) : 'No payload.'}
                </pre>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
              <div className="bg-muted/50 p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Headers
                </h3>
              </div>
              <div className="p-4 bg-muted/10 h-[300px] overflow-auto">
                <pre className="font-mono text-xs">
                  {errorLog.headers ? JSON.stringify(errorLog.headers, null, 2) : 'No headers.'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
            <div className="bg-muted/50 p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4" /> Request Info
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">URL</span>
                <span className="text-sm font-mono break-all">{errorLog.url}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Method</span>
                  <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">{errorLog.method}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">IP Address</span>
                  <span className="text-sm font-mono">{errorLog.ip}</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">User Agent</span>
                <span className="text-xs text-muted-foreground break-all">{errorLog.browser}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
            <div className="bg-muted/50 p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" /> System Info
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Correlation ID</span>
                <span className="text-xs font-mono break-all">{errorLog.correlation_id || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Request ID</span>
                <span className="text-xs font-mono break-all">{errorLog.request_id || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Module</span>
                  <span className="text-sm">{errorLog.module || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Response Time</span>
                  <span className="text-sm">{errorLog.response_time ? `${errorLog.response_time.toFixed(2)}ms` : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
            <div className="bg-muted/50 p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" /> Context
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Affected User</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                    {errorLog.user?.name ? errorLog.user.name.charAt(0) : '?'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{errorLog.user?.name || 'Guest / Unauthenticated'}</span>
                    <span className="text-xs text-muted-foreground">{errorLog.user?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Workspace ID</span>
                <span className="text-sm font-mono">{errorLog.workspace_id || 'Global'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
