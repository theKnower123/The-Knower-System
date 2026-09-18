import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useSupportStore } from '@/mocks/support';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ExternalLink, User, Mail, Phone, Building2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Contacts() {
  const { conversations } = useSupportStore();
  const [search, setSearch] = useState('');

  // Extract unique contacts from conversations for mock
  const uniqueContactsMap = new Map();
  conversations.forEach(c => {
    if (c.customerEmail && !uniqueContactsMap.has(c.customerEmail)) {
      uniqueContactsMap.set(c.customerEmail, {
        name: c.customerName,
        email: c.customerEmail,
        isGuest: c.contactId === undefined,
        company: c.contactId ? 'Acme Corp' : null,
        tickets: conversations.filter(conv => conv.customerEmail === c.customerEmail).length,
        lastActive: c.lastMessageAt
      });
    }
  });
  
  const contacts = Array.from(uniqueContactsMap.values());

  const filtered = contacts.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Head title="Support Contacts" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Contacts</h1>
          <p className="text-muted-foreground mt-1">Manage guest users and linked CRM contacts.</p>
        </div>

        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search contacts..." 
              className="pl-8" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((contact, i) => (
          <Card key={i} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={contact.isGuest ? "bg-muted" : "bg-primary/10 text-primary"}>
                      {contact.name?.charAt(0) || 'G'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{contact.name || 'Guest'}</CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      {contact.isGuest ? (
                        <Badge variant="secondary" className="text-[10px]">Guest</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30 bg-primary/5">CRM Linked</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="w-4 h-4" />
                <span>{contact.company || <span className="italic">No company</span>}</span>
              </div>
              
              <div className="pt-4 mt-4 border-t flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{contact.tickets}</strong> Support tickets
                </span>
                <Button variant="ghost" size="sm" className="h-6 px-2 gap-1 text-muted-foreground hover:text-foreground">
                  History <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
