import React, { useState, useEffect } from 'react';
import { Conversation, Message } from '@/mocks/support';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send, FileText, Bot, User, HelpCircle, FileLock2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSupportStore } from '@/mocks/support';

export function ConversationThread({ conversation }: { conversation: Conversation }) {
  const { messages, addMessage, fetchMessages } = useSupportStore();
  
  useEffect(() => {
    fetchMessages(conversation.id);
  }, [conversation.id, fetchMessages]);
  const threadMessages = messages.filter(m => m.conversationId === conversation.id);
  const [reply, setReply] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    
    addMessage({
      conversationId: conversation.id,
      sender: 'agent',
      body: reply,
      internal: isInternal
    });
    setReply('');
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="h-16 border-b flex items-center px-6 justify-between shrink-0 bg-background/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{conversation.customerName?.charAt(0) || 'C'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{conversation.customerName || 'Guest'}</h3>
            <p className="text-xs text-muted-foreground">{conversation.customerEmail}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {threadMessages.map((msg, i) => {
          const isCustomer = msg.sender === 'customer';
          const isNote = msg.internal;
          
          return (
            <div key={msg.id} className={cn("flex gap-3 max-w-[85%]", isCustomer ? "mr-auto" : "ml-auto flex-row-reverse")}>
              <Avatar className="h-8 w-8 shrink-0 mt-1">
                <AvatarFallback className={isCustomer ? "bg-primary/10 text-primary" : isNote ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}>
                  {isCustomer ? <User className="w-4 h-4" /> : msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : 'A'}
                </AvatarFallback>
              </Avatar>
              
              <div className={cn(
                "flex flex-col gap-1",
                isCustomer ? "items-start" : "items-end"
              )}>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {msg.sender === 'agent' ? 'You' : msg.sender === 'ai' ? 'AI Assistant' : conversation.customerName}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className={cn(
                  "p-3 rounded-2xl text-sm",
                  isNote ? "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 rounded-tr-sm border border-amber-200" :
                  isCustomer ? "bg-muted rounded-tl-sm text-foreground" : 
                  "bg-primary text-primary-foreground rounded-tr-sm"
                )}>
                  {isNote && <div className="text-[10px] uppercase font-bold text-amber-700 mb-1 flex items-center gap-1"><FileLock2 className="w-3 h-3"/> Internal Note</div>}
                  <div className="whitespace-pre-wrap">{msg.body}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Area */}
      <div className="p-4 border-t bg-muted/30">
        <form onSubmit={handleSend} className="flex flex-col gap-3">
          {/* AI Pre-chat suggestion simulation could go here */}
          
          <div className="flex items-center gap-2 px-2 pb-1 border-b border-border/50">
            <button 
              type="button" 
              onClick={() => setIsInternal(!isInternal)}
              className={cn("text-xs font-medium px-3 py-1 rounded-full transition-colors", isInternal ? "bg-amber-100 text-amber-700" : "text-muted-foreground hover:bg-muted")}
            >
              <FileLock2 className="w-3 h-3 inline mr-1" /> Internal Note
            </button>
            <button type="button" className="text-xs font-medium text-muted-foreground px-3 py-1 rounded-full hover:bg-muted">
              <FileText className="w-3 h-3 inline mr-1" /> Canned Response
            </button>
            <button type="button" className="text-xs font-medium text-muted-foreground px-3 py-1 rounded-full hover:bg-muted">
              <HelpCircle className="w-3 h-3 inline mr-1" /> Knowledge Base
            </button>
          </div>
          
          <div className="flex gap-2 items-end">
            <div className="flex-1 bg-background rounded-xl border focus-within:ring-1 focus-within:ring-primary p-2 flex items-center">
              <button type="button" className="p-2 text-muted-foreground hover:text-foreground">
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea 
                rows={2}
                className="flex-1 bg-transparent border-0 focus:ring-0 resize-none text-sm p-2 outline-none"
                placeholder={isInternal ? "Write an internal note... (hidden from customer)" : "Type your reply..."}
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e as any);
                  }
                }}
              />
            </div>
            <Button type="submit" size="icon" className={cn("h-12 w-12 rounded-xl shrink-0", isInternal && "bg-amber-600 hover:bg-amber-700 text-white")}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
