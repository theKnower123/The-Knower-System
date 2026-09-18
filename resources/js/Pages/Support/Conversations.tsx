import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useSupportStore } from '@/mocks/support';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Eye } from 'lucide-react';
import { ChannelIcon, PriorityBadge, AgentStatusDot } from '@/components/support/Badges';
import { Badge } from '@/components/ui/badge';

export default function Conversations() {
  const { conversations, agents } = useSupportStore();
  const [search, setSearch] = useState('');

  const filtered = conversations.filter(c => 
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    c.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Head title="All Conversations" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
          <p className="text-muted-foreground mt-1">Full archive of all support interactions.</p>
        </div>

        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-8" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">ID / Channel</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Status / Priority</th>
                <th className="px-6 py-4 font-medium">Agent</th>
                <th className="px-6 py-4 font-medium">Last Activity</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(conv => {
                const agent = agents.find(a => a.id === conv.assignedAgentId);
                return (
                  <tr key={conv.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ChannelIcon channel={conv.channel} className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-xs">{conv.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {conv.customerName || 'Guest'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline">{conv.department}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-y-1">
                      <div>
                        <Badge variant="secondary" className="uppercase text-[10px]">{conv.status}</Badge>
                      </div>
                      <div>
                        <PriorityBadge priority={conv.priority} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {agent ? (
                        <div className="flex items-center gap-2">
                          <AgentStatusDot status={agent.status} />
                          <span>{agent.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {new Date(conv.lastMessageAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button asChild variant="ghost" size="sm" className="gap-2">
                        <Link href={`/support/inbox?id=${conv.id}`}>
                          <Eye className="h-4 w-4" /> View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
