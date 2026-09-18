import { Head } from "@inertiajs/react";
import { ServerCrash, AlertTriangle, FileQuestion, Activity, ShieldAlert } from "lucide-react";

export default function ErrorDashboard({ stats, topErrors, latestExceptions }: any) {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Head title="Error Dashboard" />
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Error Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of system health and recent errors.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Today's Errors</h3>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.today}</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">500 Server Errors</h3>
            <ServerCrash className="h-4 w-4 text-red-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-red-500">{stats.error_500}</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">404 Not Found</h3>
            <FileQuestion className="h-4 w-4 text-blue-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-blue-500">{stats.error_404}</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">422 Validation</h3>
            <ShieldAlert className="h-4 w-4 text-amber-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-amber-500">{stats.error_422}</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">429 Rate Limit</h3>
            <Activity className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-yellow-500">{stats.error_429}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-4">Top Errors</h3>
            <div className="flex flex-col">
              {topErrors.map((error: any, i: number) => (
                <div key={i} className="flex items-center justify-between [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-3 [&:not(:first-child)]:pt-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="bg-muted px-2 py-1 rounded text-xs font-mono shrink-0">{error.status_code}</span>
                    <span className="text-sm truncate" title={error.message}>{error.message || 'Unknown Error'}</span>
                  </div>
                  <span className="font-bold text-sm shrink-0">{error.total}</span>
                </div>
              ))}
              {topErrors.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No top errors found.</p>}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-4">Latest Exceptions</h3>
            <div className="flex flex-col">
              {latestExceptions.map((error: any) => (
                <div key={error.id} className="flex flex-col [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-3 [&:not(:first-child)]:pt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold truncate text-red-500" title={error.exception_type}>
                      {error.exception_type ? error.exception_type.split('\\').pop() : 'Error'}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">{new Date(error.created_at).toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-muted-foreground truncate" title={error.message}>{error.message}</span>
                  <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-1 rounded mt-2 truncate w-max max-w-full">
                    {error.url}
                  </span>
                </div>
              ))}
              {latestExceptions.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No recent exceptions.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
