import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Bot, ArrowRight, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function Automation() {
  const [rules, setRules] = useState([
    { id: 1, keyword: 'billing, invoice, payment', action: 'Route to Billing Dept', active: true },
    { id: 2, keyword: 'password, login, access', action: 'Send Canned Response: Password Reset', active: true },
    { id: 3, keyword: 'urgent, asap, broken', action: 'Set Priority: Urgent', active: true },
  ]);

  const [newKeyword, setNewKeyword] = useState('');

  const addRule = () => {
    if (!newKeyword) return;
    setRules([...rules, { id: Date.now(), keyword: newKeyword, action: 'Route to Support Dept', active: true }]);
    setNewKeyword('');
    toast.success('Automation rule added');
  };

  const removeRule = (id: number) => {
    setRules(rules.filter(r => r.id !== id));
    toast.success('Rule removed');
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <Head title="Automation Rules" />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automation Rules</h1>
          <p className="text-muted-foreground mt-1">Automatically route and tag conversations based on keywords and intent.</p>
        </div>
        <Button className="gap-2"><Save className="w-4 h-4"/> Save Changes</Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot className="w-5 h-5 text-primary" /> Active Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-muted-foreground border-b pb-2 px-2">
            <div className="col-span-5">If message contains...</div>
            <div className="col-span-6">Then...</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          
          {rules.map(rule => (
            <div key={rule.id} className="grid grid-cols-12 gap-4 items-center bg-muted/30 p-3 rounded-lg border">
              <div className="col-span-5 font-mono text-sm text-primary [word-break:break-word]">
                {rule.keyword}
              </div>
              <div className="col-span-6 flex items-center gap-2 text-sm">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="bg-background px-3 py-1.5 rounded border shadow-sm">{rule.action}</span>
              </div>
              <div className="col-span-1 text-right">
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeRule(rule.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-12 gap-4 items-center pt-4 border-t mt-4">
            <div className="col-span-5">
              <Input 
                placeholder="e.g. refund, money back" 
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
              />
            </div>
            <div className="col-span-6">
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <option>Route to Billing Dept</option>
                <option>Route to Sales Dept</option>
                <option>Set Priority: High</option>
              </select>
            </div>
            <div className="col-span-1 text-right">
              <Button onClick={addRule} size="icon" variant="secondary"><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
