import React from 'react';
import { Conversation } from '@/mocks/support';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, User, FileText, CreditCard, ExternalLink, Calendar, Server } from 'lucide-react';
import { Link } from '@inertiajs/react';

export function ContextPanel({ conversation }: { conversation: Conversation }) {
  // In a real app, this would fetch from the CRM based on contactId
  return (
    <div className="w-80 border-l bg-muted/10 h-full flex flex-col shrink-0 overflow-y-auto">
      <div className="p-6 border-b">
        <h3 className="font-semibold text-lg mb-1">Customer Context</h3>
        <p className="text-sm text-muted-foreground">Linked CRM records</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Contact Info */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Contact</h4>
            <Button variant="ghost" size="sm" className="h-6 text-xs px-2">Edit</Button>
          </div>
          <Card className="p-4 bg-background shadow-sm border-border/50">
            <div className="font-medium text-sm">{conversation.customerName || 'Guest User'}</div>
            <div className="text-xs text-muted-foreground mt-1">{conversation.customerEmail}</div>
            <div className="text-xs text-muted-foreground mt-1">+1 (555) 123-4567</div>
            <div className="flex gap-2 mt-3">
              <Badge variant="secondary" className="text-[10px]">VIP</Badge>
              <Badge variant="secondary" className="text-[10px]">Enterprise</Badge>
            </div>
          </Card>
        </section>

        {conversation.contactId ? (
          <>
            {/* Company Info */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-500" /> Company</h4>
              </div>
              <Card className="p-4 bg-background shadow-sm border-border/50 group hover:border-blue-500/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sm">Knower Client Org</div>
                    <div className="text-xs text-muted-foreground mt-1">Client since 2026</div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100" asChild>
                    <Link href="/crm/clients"><ExternalLink className="w-3 h-3" /></Link>
                  </Button>
                </div>
              </Card>
            </section>
          </>
        ) : (
          <div className="text-sm text-center text-muted-foreground mt-8 p-4 border border-dashed rounded-lg">
            No CRM records linked to this guest user.
          </div>
        )}

      </div>
    </div>
  );
}
