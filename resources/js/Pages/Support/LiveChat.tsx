import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { useSupportStore } from '@/mocks/support';
import { ConversationList } from '@/components/support/ConversationList';
import { ConversationThread } from '@/components/support/ConversationThread';
import { ContextPanel } from '@/components/support/ContextPanel';
import { ActionRail } from '@/components/support/ActionRail';
import { Search, Filter, Monitor } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LiveChat() {
  const { conversations, fetchConversations } = useSupportStore();
  
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  // Only website chats that are waiting or in progress
  const liveChats = conversations.filter(c => 
    c.channel === 'website' && (c.status === 'waiting' || c.status === 'in_progress')
  );

  const [activeId, setActiveId] = useState<string | undefined>();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!activeId && liveChats.length > 0) {
      setActiveId(liveChats[0].id);
    }
  }, [liveChats, activeId]);

  const activeConversation = conversations.find(c => c.id === activeId);
  
  const filteredConversations = liveChats.filter(c => 
    c.customerName?.toLowerCase().includes(search.toLowerCase()) || 
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">
      <Head title="Live Chat" />
      
      {activeConversation && <ActionRail conversation={activeConversation} />}

      <div className="w-80 border-r flex flex-col shrink-0 bg-muted/10 h-full">
        <div className="p-4 border-b space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" /> Live Chat
            </h2>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Filter className="w-4 h-4" /></Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search active chats..." 
              className="pl-8 bg-background" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ConversationList 
            conversations={filteredConversations} 
            activeId={activeId} 
            onSelect={setActiveId} 
          />
        </div>
      </div>

      <div className="flex-1 h-full min-w-0">
        {activeConversation ? (
          <ConversationThread conversation={activeConversation} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/5 p-6 text-center">
            <Monitor className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No active live chats</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        )}
      </div>

      {activeConversation && <ContextPanel conversation={activeConversation} />}
    </div>
  );
}
