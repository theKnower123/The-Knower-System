import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send, Paperclip, Minimize2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  body: string;
  time: string;
}

export function ChatWidget() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Registration Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Support');
  
  // Chat State
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'agent', body: 'Hi there! 👋 How can we help you today?', time: new Date().toISOString() }
  ]);
  const [reply, setReply] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setHasStarted(true);
    
    // Simulate initial connection
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'system',
        body: `You are now connected with the ${department} team. An agent will be with you shortly.`,
        time: new Date().toISOString()
      }]);
    }, 1500);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'customer',
      body: reply,
      time: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMsg]);
    const currentReply = reply;
    setReply('');

    try {
      // Hit the unified ingestion endpoint we created in chunk 1
      const response = await axios.post('/api/v1/public/support/ingest', {
        channel: 'website',
        body: currentReply,
        contact_email: email,
        contact_name: name,
        conversation_id: conversationId,
        // We'd map 'Support' to an actual department ID in a real app, omit for now to use default
      });

      if (!conversationId && response.data.conversation_id) {
        setConversationId(response.data.conversation_id);
      }

      // Mock agent reply after a delay
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          body: "Thanks for your message! Our mock agent has received it.",
          time: new Date().toISOString()
        }]);
      }, 3000);

    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50 hover:shadow-primary/30 animate-in fade-in slide-in-from-bottom-4"
      >
        <MessageSquare className="w-6 h-6" />
        {/* Mock unread badge */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-background rounded-full"></span>
      </button>
    );
  }

  return (
    <div className={cn(
      "fixed right-6 z-50 flex flex-col bg-background border shadow-2xl overflow-hidden transition-all duration-300 ease-in-out",
      isMinimized ? "bottom-6 w-80 h-14 rounded-full" : "bottom-6 w-96 h-[600px] max-h-[80vh] rounded-2xl"
    )}>
      {/* Header */}
      <div 
        className="bg-primary text-primary-foreground p-4 flex items-center justify-between shrink-0 cursor-pointer"
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center font-bold">
              K
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-primary rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-none">The Knower OS</h3>
            {!isMinimized && <p className="text-xs text-primary-foreground/80 mt-1">Usually replies in under 5 mins</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {!isMinimized && (
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }} className="p-2 hover:bg-black/10 rounded-full transition-colors">
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); }} className="p-2 hover:bg-black/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Main Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-muted/10 space-y-4">
            {!hasStarted ? (
              <div className="bg-background border shadow-sm rounded-xl p-5 mt-4">
                <h4 className="font-semibold mb-2">{t("chat.welcome", "Welcome! 👋")}</h4>
                <p className="text-sm text-muted-foreground mb-4">{t("chat.please_fill", "Please fill out the form below so we can assist you better.")}</p>
                <form onSubmit={handleStartChat} className="space-y-3">
                  <div>
                    <Input placeholder={`${t("common.name", "Name")} *`} required value={name} onChange={e => setName(e.target.value)} className="bg-muted/50" />
                  </div>
                  <div>
                    <Input type="email" placeholder={`${t("common.email", "Email")} *`} required value={email} onChange={e => setEmail(e.target.value)} className="bg-muted/50" />
                  </div>
                  <div>
                    <select 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                    >
                      <option value="Support">{t("chat.support", "General Support")}</option>
                      <option value="Sales">{t("chat.sales", "Sales & Billing")}</option>
                      <option value="Technical">{t("chat.technical", "Technical Help")}</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full">{t("chat.start", "Start Chat")}</Button>
                </form>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => {
                  const isCustomer = msg.sender === 'customer';
                  const isSystem = msg.sender === 'system';
                  
                  if (isSystem) {
                    return (
                      <div key={i} className="text-center">
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                          {msg.body}
                        </span>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={i} className={cn("flex gap-2 max-w-[85%]", isCustomer ? "ml-auto flex-row-reverse" : "mr-auto")}>
                      {!isCustomer && (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary shrink-0 mt-1">
                          A
                        </div>
                      )}
                      <div className={cn(
                        "p-3 rounded-2xl text-sm",
                        isCustomer ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-background border shadow-sm rounded-bl-sm"
                      )}>
                        {msg.body}
                      </div>
                    </div>
                  );
                })}
                
                {isTyping && (
                  <div className="flex gap-2 max-w-[85%] mr-auto items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary shrink-0">
                      A
                    </div>
                    <div className="bg-background border shadow-sm rounded-2xl rounded-bl-sm p-3 px-4 flex gap-1 items-center h-10">
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={endOfMessagesRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className={cn("p-3 bg-background border-t transition-opacity", !hasStarted && "opacity-50 pointer-events-none")}>
            <form onSubmit={handleSend} className="flex gap-2 items-end">
              <div className="flex-1 bg-muted/50 rounded-xl border focus-within:ring-1 focus-within:ring-primary flex items-center overflow-hidden">
                <button type="button" className="p-2 text-muted-foreground hover:text-foreground shrink-0">
                  <Paperclip className="w-4 h-4" />
                </button>
                <input 
                  type="text"
                  className="flex-1 bg-transparent border-0 focus:ring-0 text-sm p-2.5 outline-none min-w-0"
                  placeholder={t("chat.type_message", "Type your message...")}
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  disabled={!hasStarted}
                />
              </div>
              <Button type="submit" size="icon" disabled={!hasStarted || !reply.trim()} className="h-[42px] w-[42px] rounded-xl shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <div className="text-center mt-2 text-[10px] text-muted-foreground flex items-center justify-center gap-1">
              Powered by <strong>The Knower OS</strong>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
