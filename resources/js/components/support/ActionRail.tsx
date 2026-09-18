import React from 'react';
import { Conversation, useSupportStore } from '@/mocks/support';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  UserPlus, 
  ArrowRightLeft, 
  Calendar, 
  CheckCircle2, 
  Ban, 
  Combine,
  FileEdit,
  DollarSign,
  Tag
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ActionRail({ conversation }: { conversation: Conversation }) {
  const { updateConversationStatus } = useSupportStore();

  const handleAction = (name: string) => {
    toast.success(`Mock action: ${name} triggered for ${conversation.id}`);
  };

  const handleResolve = () => {
    updateConversationStatus(conversation.id, 'resolved');
    toast.success('Conversation marked as resolved.');
  };

  const actions = [
    { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Resolve', onClick: handleResolve, color: 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950' },
    { icon: <ArrowRightLeft className="w-5 h-5" />, label: 'Transfer', onClick: () => handleAction('Transfer'), color: 'hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950' },
    { icon: <Tag className="w-5 h-5" />, label: 'Assign Tags', onClick: () => handleAction('Assign Tags'), color: 'hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Schedule Meeting', onClick: () => handleAction('Schedule Meeting'), color: 'hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950' },
    { icon: <FileEdit className="w-5 h-5" />, label: 'Create Ticket', onClick: () => handleAction('Create Ticket'), color: 'hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950' },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Create Quote', onClick: () => handleAction('Create Quote'), color: 'hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950' },
    { icon: <UserPlus className="w-5 h-5" />, label: 'Create Client', onClick: () => handleAction('Create Client'), color: 'hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950' },
    { icon: <Combine className="w-5 h-5" />, label: 'Merge', onClick: () => handleAction('Merge'), color: 'hover:bg-muted' },
    { icon: <Ban className="w-5 h-5" />, label: 'Block', onClick: () => handleAction('Block Spam'), color: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950' },
  ];

  return (
    <div className="w-16 border-r flex flex-col items-center py-4 bg-background z-10 shrink-0 gap-4 overflow-y-auto">
      <TooltipProvider delayDuration={0}>
        {actions.map((action, i) => (
          <Tooltip key={i} placement="right">
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`w-10 h-10 rounded-xl transition-all ${action.color}`}
                onClick={action.onClick}
              >
                {action.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {action.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
