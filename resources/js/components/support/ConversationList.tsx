import React from 'react';
import { Conversation } from '@/mocks/support';
import { ChannelIcon, PriorityBadge, SlaBadge } from './Badges';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Props {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversations, activeId, onSelect }: Props) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center">
        <ChannelIcon channel="website" className="w-12 h-12 mb-4 opacity-20" />
        <p>No conversations found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto divide-y divide-border">
      {conversations.map(conv => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={cn(
            "text-left p-4 hover:bg-muted/50 transition-colors relative flex gap-3",
            activeId === conv.id && "bg-muted/80"
          )}
        >
          {conv.unread && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
          )}
          
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{conv.customerName?.charAt(0) || 'C'}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
              <ChannelIcon channel={conv.channel} className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <span className="font-medium text-sm truncate">{conv.customerName || 'Guest'}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="text-xs text-muted-foreground truncate w-full">
              {conv.id} • {conv.department}
            </div>
            
            <div className="flex gap-2 items-center mt-1">
              <PriorityBadge priority={conv.priority} />
              {conv.status !== 'closed' && conv.status !== 'resolved' && (
                <SlaBadge dueAt={conv.slaDueAt} />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
