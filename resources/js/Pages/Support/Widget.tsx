import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Settings2, Palette, Clock, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function WidgetSettings() {
  const [theme, setTheme] = useState('#2563eb');
  
  const handleSave = () => {
    toast.success('Widget settings saved successfully');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto flex gap-6">
      <Head title="Widget Settings" />
      
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Widget Settings</h1>
            <p className="text-muted-foreground mt-1">Configure your public-facing chat widget.</p>
          </div>
          <Button className="gap-2" onClick={handleSave}><Save className="w-4 h-4"/> Save Settings</Button>
        </div>

        <div className="grid gap-6">
          {/* Appearance */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5 text-primary" /> Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input type="color" value={theme} onChange={e => setTheme(e.target.value)} className="w-16 h-10 p-1" />
                  <Input value={theme} onChange={e => setTheme(e.target.value)} className="font-mono uppercase" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Widget Position</Label>
                <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <option>Bottom Right</option>
                  <option>Bottom Left</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Messaging */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5 text-green-500" /> Messaging</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Greeting Message (Online)</Label>
                <Input defaultValue="Hi there! 👋 How can we help you today?" />
              </div>
              <div className="grid gap-2">
                <Label>Greeting Message (Offline)</Label>
                <Input defaultValue="We're currently away. Leave a message and we'll email you back." />
              </div>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" /> Business Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 grid gap-2">
                  <Label>Timezone</Label>
                  <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>UTC (GMT+0)</option>
                    <option>EST (GMT-5)</option>
                    <option>AST (GMT+3)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t pt-4">
                <div className="col-span-1 font-medium">Monday - Friday</div>
                <div className="col-span-1"><Input type="time" defaultValue="09:00" /></div>
                <div className="col-span-1"><Input type="time" defaultValue="17:00" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-muted-foreground">Saturday - Sunday</div>
                <div className="col-span-2 text-sm text-muted-foreground flex items-center">Offline (Form Only)</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Widget Preview */}
      <div className="w-96 shrink-0 space-y-4">
        <div className="sticky top-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Settings2 className="w-4 h-4" /> Live Preview</h3>
          
          <div className="border rounded-2xl overflow-hidden shadow-xl bg-background flex flex-col h-[500px]">
            <div className="p-4 text-white flex flex-col gap-1" style={{ backgroundColor: theme }}>
              <div className="font-bold text-lg tracking-tight">The Knower OS</div>
              <div className="text-sm opacity-90">Usually replies in a few minutes</div>
            </div>
            
            <div className="flex-1 p-4 bg-muted/20 overflow-y-auto space-y-4">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0" style={{ backgroundColor: theme }}>
                  A
                </div>
                <div className="bg-background border rounded-2xl rounded-tl-sm p-3 text-sm shadow-sm">
                  Hi there! 👋 How can we help you today?
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-background border-t">
              <div className="bg-muted rounded-full px-4 py-2 text-sm text-muted-foreground flex justify-between items-center">
                Send us a message...
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: theme }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
