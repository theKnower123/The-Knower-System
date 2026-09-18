import { create } from 'zustand';

export type ChannelType = 'website' | 'email' | 'whatsapp' | 'portal' | 'api';
export type ConversationStatus = 'waiting' | 'assigned' | 'in_progress' | 'pending_customer' | 'resolved' | 'closed';

export interface Message {
  id: string;
  conversationId: string;
  sender: 'customer' | 'agent' | 'ai' | 'system' | 'note';
  senderId?: string;
  body: string;
  attachments?: string[];
  createdAt: string;
  internal: boolean;
}

export interface Conversation {
  id: string;
  channel: ChannelType;
  status: ConversationStatus;
  department: string;
  assignedAgentId?: string;
  contactId?: string;
  tags: string[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  slaDueAt: string;
  createdAt: string;
  lastMessageAt: string;
  unread: boolean;
  customerName?: string; // For mock display
  customerEmail?: string;
}

import axios from 'axios';

interface SupportStore {
  conversations: Conversation[];
  messages: Message[];
  departments: { id: string; name: string }[];
  agents: { id: string; name: string; status: string; load: number }[];
  queue: Conversation[];
  isLoading: boolean;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  addMessage: (msg: Omit<Message, 'id' | 'createdAt'>) => void;
  updateConversationStatus: (id: string, status: ConversationStatus) => void;
}

export const useSupportStore = create<SupportStore>((set, get) => ({
  conversations: [],
  messages: [],
  departments: [
    { id: '1', name: 'Support' },
    { id: '2', name: 'Sales' },
    { id: '3', name: 'Technical' }
  ],
  agents: [
    { id: '1', name: 'System Admin', status: 'online', load: 0 },
  ],
  queue: [],
  isLoading: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get('/api/v1/support/conversations');
      const data = res.data.data || [];
      set({ 
        conversations: data,
        queue: data.filter((c: Conversation) => c.status === 'waiting'),
        isLoading: false
      });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  fetchMessages: async (conversationId: string) => {
    try {
      const res = await axios.get(`/api/v1/support/conversations/${conversationId}/messages`);
      const newMessages = res.data.data || [];
      
      set((state) => {
        // Merge without duplicates
        const existing = state.messages.filter(m => m.conversationId !== conversationId);
        return { messages: [...existing, ...newMessages] };
      });
    } catch (e) {
      console.error(e);
    }
  },
  
  addMessage: (msg) => set((state) => {
    const newMsg: Message = {
      ...msg,
      id: `MSG-NEW-${Date.now()}`,
      createdAt: new Date().toISOString()
    } as Message;
    
    // Optimistic UI update
    return {
      messages: [...state.messages, newMsg]
    };
  }),
  
  updateConversationStatus: (id, status) => set((state) => {
    const updatedConvos = state.conversations.map(c => 
      c.id === id ? { ...c, status } : c
    );
    return {
      conversations: updatedConvos,
      queue: updatedConvos.filter(c => c.status === 'waiting')
    };
  })
}));
