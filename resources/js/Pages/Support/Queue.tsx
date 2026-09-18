import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useSupportStore } from '@/mocks/support';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChannelIcon, PriorityBadge, AgentStatusDot } from '@/components/support/Badges';
import { Play, ArrowRight, UserPlus, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function QueueManager() {
  const { conversations, agents, queue, updateConversationStatus } = useSupportStore();
  
  const [simulation, setSimulation] = useState<{
    running: boolean;
    step: string;
    targetAgent?: string;
  }>({ running: false, step: '' });

  const runSimulation = () => {
    if (queue.length === 0) {
      toast.info('Queue is empty. No chats to route.');
      return;
    }

    const chat = queue[0];
    setSimulation({ running: true, step: 'Identifying department...' });
    
    setTimeout(() => {
      setSimulation({ running: true, step: `Department found: ${chat.department}. Finding online agents...` });
      
      setTimeout(() => {
        const availableAgents = agents.filter(a => a.status === 'online');
        if (availableAgents.length === 0) {
          setSimulation({ running: false, step: 'No agents online in this department. Chat remains in queue.' });
          return;
        }

        // Least load logic
        const target = availableAgents.reduce((prev, current) => (prev.load < current.load) ? prev : current);
        setSimulation({ running: true, step: `Agent ${target.name} has the lowest load (${target.load}). Assigning...`, targetAgent: target.id });

        setTimeout(() => {
          updateConversationStatus(chat.id, 'assigned');
          setSimulation({ running: false, step: `Successfully routed ${chat.id} to ${target.name}!` });
          toast.success(`Chat ${chat.id} assigned to ${target.name}`);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Head title="Queue Manager & Routing" />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Queue Manager</h1>
          <p className="text-muted-foreground mt-1">Monitor the waiting queue and simulate routing rules.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" /> Routing Rules
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* The Queue */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="border-b pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Waiting Queue ({queue.length})</CardTitle>
                <Badge variant="secondary">Global</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {queue.map((q, i) => (
                  <div key={q.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-muted-foreground w-8">#{i+1}</div>
                      <ChannelIcon channel={q.channel} className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{q.customerName || 'Guest'}</div>
                        <div className="text-xs text-muted-foreground">Wait time: {Math.floor(Math.random() * 5) + 1}m • {q.department}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <PriorityBadge priority={q.priority} />
                      <Button size="sm" variant="outline" className="gap-2">
                        <UserPlus className="w-4 h-4" /> Assign
                      </Button>
                    </div>
                  </div>
                ))}
                {queue.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">Queue is empty</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Routing Simulator & Agent Status */}
        <div className="space-y-6">
          <Card className="shadow-sm border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Routing Simulator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Test the least-load routing engine live on the next chat in queue.</p>
              
              <div className="bg-background border rounded-lg p-3 text-sm font-mono min-h-[80px] flex flex-col justify-center">
                {simulation.step || "Ready to simulate..."}
                {simulation.running && (
                  <span className="flex items-center gap-1 mt-2 text-primary">
                    <span className="animate-pulse">●</span> Processing...
                  </span>
                )}
              </div>

              <Button onClick={runSimulation} disabled={simulation.running || queue.length === 0} className="w-full gap-2">
                <Play className="w-4 h-4" /> Run Simulation
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Agent Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map(agent => (
                  <div key={agent.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AgentStatusDot status={agent.status} />
                      <span className="text-sm font-medium">{agent.name}</span>
                    </div>
                    <Badge variant={agent.status === 'online' ? 'default' : 'secondary'} className={simulation.targetAgent === agent.id ? "ring-2 ring-primary ring-offset-2" : ""}>
                      Load: {agent.load}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
