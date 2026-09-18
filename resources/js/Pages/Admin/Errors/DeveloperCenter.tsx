import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { useState } from "react";

export default function DeveloperCenter({ logs, filters }: any) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/errors/developer', { search }, { preserveState: true });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Head title="Developer Error Center" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer Error Center</h1>
          <p className="text-muted-foreground mt-2">Detailed log of all system exceptions and errors.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search exceptions..." 
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Path</th>
                <th className="px-6 py-4 font-medium">Exception / Message</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.data.map((log: any) => (
                <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-mono font-medium ${
                      log.status_code >= 500 ? 'bg-red-500/10 text-red-500' :
                      log.status_code >= 400 ? 'bg-amber-500/10 text-amber-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {log.status_code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs text-muted-foreground">{log.method}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs max-w-[200px] truncate block" title={log.url}>
                      {log.url?.replace(/^.*\/\/[^\/]+/, '') || '/'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground truncate max-w-md" title={log.exception_type}>
                        {log.exception_type ? log.exception_type.split('\\').pop() : 'Error'}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-md" title={log.message}>
                        {log.message}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button asChild variant="ghost" size="sm" className="gap-2">
                      <Link href={`/admin/errors/${log.id}`}>
                        <Eye className="h-4 w-4" />
                        Details
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {logs.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No errors found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder - assuming Inertia returns standard Laravel pagination */}
        <div className="p-4 border-t flex justify-between items-center text-sm text-muted-foreground bg-muted/20">
          <div>Showing {logs.from || 0} to {logs.to || 0} of {logs.total} results</div>
          <div className="flex gap-1">
            {logs.links && logs.links.map((link: any, i: number) => (
              <Link 
                key={i} 
                href={link.url || '#'} 
                className={`px-3 py-1 rounded border ${link.active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
