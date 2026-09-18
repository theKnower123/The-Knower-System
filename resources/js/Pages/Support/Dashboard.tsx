import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useSupportStore } from '@/mocks/support';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, Users, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { AgentStatusDot } from '@/components/support/Badges';

export default function Dashboard() {
  const { conversations, agents, queue } = useSupportStore();

  const activeChats = conversations.filter(c => c.status === 'in_progress').length;
  const waitingQueue = queue.length;
  const onlineAgents = agents.filter(a => a.status === 'online').length;
  const closedToday = conversations.filter(c => c.status === 'closed').length; // Mocked as all closed
  const slaBreached = conversations.filter(c => new Date(c.slaDueAt).getTime() < Date.now() && c.status !== 'closed' && c.status !== 'resolved').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Head title="Support Dashboard" />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of your support operations.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/support/reports">View Reports</Link>
          </Button>
          <Button asChild>
            <Link href="/support/inbox">Open Inbox</Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeChats}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Queue</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{waitingQueue}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Agents</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{onlineAgents}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4m 12s</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedToday}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Breached</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{slaBreached}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Agent Status List */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Agent Roster</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map(agent => (
                <div key={agent.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AgentStatusDot status={agent.status} />
                    <span className="font-medium text-sm">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">Load: {agent.load}/5</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/support/agents/${agent.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Queue Preview */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Live Queue</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/support/queue">Queue Manager</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {queue.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground text-sm">No customers waiting.</div>
            ) : (
              <div className="space-y-3">
                {queue.slice(0, 5).map((q, i) => (
                  <div key={q.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">#{i + 1} - {q.customerName || 'Guest'}</span>
                      <span className="text-xs text-muted-foreground">{q.department} • {q.channel}</span>
                    </div>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">Wait: 2m</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
