import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import { Play, Square } from "lucide-react";

export default function TimeLogsPage() {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);
  const queryClient = useQueryClient();

  const { data: timeLogs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ["time-logs"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/time-logs");
      return res.data.data || res.data;
    }
  });

  const { data: tasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/tasks");
      return res.data.data || res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return axios.post("/api/v1/time-logs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-logs"] });
      toast.success("Time log saved successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to save time log");
    }
  });

  const [activeTask, setActiveTask] = useState<string>("none");
  const [description, setDescription] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const handleToggleTracking = async () => {
    if (!isTracking) {
      if (activeTask === "none" && !description) {
        return toast.error("Please select a task or enter a description");
      }
      setIsTracking(true);
      setStartTime(new Date());
      toast.success("Timer started");
    } else {
      setIsTracking(false);
      const endTime = new Date();
      
      // Calculate hours
      const diffMs = endTime.getTime() - (startTime?.getTime() || endTime.getTime());
      const hours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;

      try {
        saveMutation.mutate({
          task_id: activeTask === "none" ? null : Number(activeTask),
          user_id: user?.id,
          date: startTime?.toISOString().split('T')[0],
          hours: Math.max(0.01, hours), // minimum 0.01 hours
          description: description || "Time tracked",
        });
        setDescription("");
      } catch (e) {
        toast.error("An error occurred");
      }
    }
  };

  const getTaskName = (id: number) => {
    return tasks?.find((t: any) => t.id === id)?.title || "General";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Time Tracking"
        description="Log time spent on projects and tasks."
      />

      {/* Timer Widget */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col md:flex-row items-end gap-4">
        <div className="space-y-2 flex-1 w-full">
          <Label>What are you working on?</Label>
          <Input 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Designing the homepage..."
            disabled={isTracking}
          />
        </div>
        <div className="space-y-2 flex-1 w-full">
          <Label>Project / Task</Label>
          <Select value={activeTask} onValueChange={setActiveTask} disabled={isTracking}>
            <SelectTrigger>
              <SelectValue placeholder="Select a task" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No specific task</SelectItem>
              {tasks?.map((t: any) => (
                <SelectItem key={t.id} value={String(t.id)}>{t.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          size="lg" 
          variant={isTracking ? "destructive" : "default"}
          className="w-full md:w-auto"
          onClick={handleToggleTracking}
        >
          {isTracking ? (
            <><Square className="mr-2 h-4 w-4" /> Stop Timer</>
          ) : (
            <><Play className="mr-2 h-4 w-4" /> Start Timer</>
          )}
        </Button>
      </div>

      {/* Recent Logs Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Recent Time Logs</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeLogs?.map((log: any) => (
              <TableRow key={log.id}>
                <TableCell>{log.date}</TableCell>
                <TableCell>{getTaskName(log.task_id)}</TableCell>
                <TableCell>{log.description}</TableCell>
                <TableCell>{log.user?.name || 'You'}</TableCell>
                <TableCell className="text-right font-medium">{log.hours}h</TableCell>
              </TableRow>
            ))}
            {(!timeLogs || timeLogs.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No time logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
