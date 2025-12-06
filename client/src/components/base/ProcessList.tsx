import useFetch from '@/hooks/useFetchData';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { axiosPublic } from '@/api/axios';
import { toast } from 'sonner';

function ProcessList() {
  const { data: processes } = useFetch("/process");
  console.log("Processes:", processes);

  const handleStatusChange = async (processId: string, newStatus: string) => {
    try {
      await axiosPublic.put(`/process/${processId}`, { status: newStatus });
      toast.success("Process status updated successfully");
    } catch (error) {
      console.error("Error updating process status:", error);
      toast.error("Failed to update process status");
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'planned':
        return 'secondary';
      case 'in_progress':
        return 'default';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!processes?.processes) {
    return <div className="w-full p-6">Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 w-full">
        {processes.processes.map((process: any) => (
          <Card key={process._id} className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {formatDate(process.datePlanned)}
                </CardTitle>
                <Badge variant={getStatusVariant(process.status)}>
                  {process.status.replace('_', ' ')}
                </Badge>
              </div>
              <CardDescription>
                {process.tasks.length} task{process.tasks.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  defaultValue={process.status}
                  onValueChange={(value) => handleStatusChange(process._id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Tasks Overview</div>
                <div className="space-y-1">
                  {process.tasks.slice(0, 3).map((taskItem: any, idx: number) => (
                    <div key={idx} className="text-sm flex items-center justify-between">
                      <span className="truncate flex-1">
                        {taskItem.task?.taskName || 'Untitled Task'}
                      </span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {taskItem.status}
                      </Badge>
                    </div>
                  ))}
                  {process.tasks.length > 3 && (
                    <div className="text-sm opacity-70">
                      +{process.tasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>

              {process.machine && (
                <div className="text-sm">
                  <span className="font-medium">Machine: </span>
                  <span className="opacity-70">{process.machine}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ProcessList;