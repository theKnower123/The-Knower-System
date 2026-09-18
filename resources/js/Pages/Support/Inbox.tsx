import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { useSupportStore } from '@/mocks/support';
import { ConversationList } from '@/components/support/ConversationList';
import { ConversationThread } from '@/components/support/ConversationThread';
import { ContextPanel } from '@/components/support/ContextPanel';
import { ActionRail } from '@/components/support/ActionRail';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Inbox() {
  const { conversations, fetchConversations, isLoading } = useSupportStore();
  
  useEffect(() => {
    fetchConversations();
    // In a real app we would poll or use WebSockets here
  }, [fetchConversations]);
  
  const [activeId, setActiveId] = useState<string | undefined>();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  const activeConversation = conversations.find(c => c.id === activeId);
  const inboxConversations = conversations.filter(c => c.status !== 'closed' && c.status !== 'resolved');
  
  const filteredConversations = inboxConversations.filter(c => 
    c.customerName?.toLowerCase().includes(search.toLowerCase()) || 
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">
      <Head title="Omnichannel Inbox" />
      
      {/* Action Rail (Left) */}
      {activeConversation && <ActionRail conversation={activeConversation} />}

      {/* Conversation List */}
      <div className="w-80 border-r flex flex-col shrink-0 bg-muted/10 h-full">
        <div className="p-4 border-b space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Inbox</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Filter className="w-4 h-4" /></Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search chats..." 
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

      {/* Main Thread */}
      <div className="flex-1 h-full min-w-0">
        {activeConversation ? (
          <ConversationThread conversation={activeConversation} />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground bg-muted/5">
            Select a conversation to view the thread
          </div>
        )}
      </div>

      {/* Context Panel (Right) */}
      {activeConversation && <ContextPanel conversation={activeConversation} />}
    </div>
  );
}
