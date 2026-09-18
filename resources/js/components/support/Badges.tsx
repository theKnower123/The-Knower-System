import React from 'react';
import { Globe, Mail, MessageSquare, Monitor, Webhook, Clock, AlertTriangle } from 'lucide-react';
import { ChannelType } from '@/mocks/support';
import { Badge } from '@/components/ui/badge';

export const ChannelIcon = ({ channel, className }: { channel: ChannelType; className?: string }) => {
  switch (channel) {
    case 'website': return <Monitor className={className} />;
    case 'email': return <Mail className={className} />;
    case 'whatsapp': return <MessageSquare className={className} />;
    case 'portal': return <Globe className={className} />;
    case 'api': return <Webhook className={className} />;
    default: return <Monitor className={className} />;
  }
};

export const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors: Record<string, string> = {
    low: 'bg-muted text-muted-foreground',
    normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };
  
  return (
    <Badge className={`uppercase text-[10px] font-bold ${colors[priority] || colors.normal} hover:${colors[priority]}`}>
      {priority}
    </Badge>
  );
};

export const SlaBadge = ({ dueAt }: { dueAt: string }) => {
  const due = new Date(dueAt);
  const now = new Date();
  const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 3600);
  
  let color = 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
  let icon = <Clock className="w-3 h-3 mr-1" />;
  
  if (hoursLeft < 0) {
    color = 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
    icon = <AlertTriangle className="w-3 h-3 mr-1" />;
  } else if (hoursLeft < 2) {
    color = 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
  }

  return (
    <Badge variant="outline" className={`text-xs ${color} border-none`}>
      {icon}
      {hoursLeft < 0 ? 'SLA Breached' : `${Math.max(1, Math.round(hoursLeft))}h left`}
    </Badge>
  );
};

export const AgentStatusDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    online: 'bg-green-500',
    away: 'bg-amber-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-400'
  };
  
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status] || colors.offline}`} />
  );
};
