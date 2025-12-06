import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetchData";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, Play, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { axiosPublic } from "@/api/axios";
import { toast } from "sonner";

export default function OperatorHome() {
  const { user } = useAuthContext();
  const operatorId = user?._id ?? null;

  const { data: tasksForCurrentProcess,refetch } = useFetch(`/process/tasks/operator/${operatorId}`);
  const { data: tasksForAllProcess,refetch: refetch2 } = useFetch(`/process/tasks/operator/all/${operatorId}`);

  console.log("All data:", tasksForCurrentProcess, tasksForAllProcess);

  const handleStatusChange = async (processId, taskId, newStatus) => {
    // TODO: Add your API call to update the task status
    console.log(`Updating task ${taskId} in process ${processId} to status: ${newStatus}`);
    try {
      await axiosPublic.put("/process/task/"+operatorId+"/task-status",{operatorId,taskId,status:newStatus})
      toast.success("status changed succefully")
      refetch();
      refetch2();
    } catch (error) {
      toast.error('failed to change status')
      console.log(error)
      
    }
    // Example API call:
    // await fetch(`/api/process/${processId}/task/${taskId}/status`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ status: newStatus })
    // });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'done':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Play className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const currentTasks = tasksForCurrentProcess?.tasks || [];
  const allTasks = tasksForAllProcess?.tasks || [];

  const stats = {
    pending: allTasks.filter(t => t.status === 'pending').length,
    inProgress: allTasks.filter(t => t.status === 'in_progress').length,
    done: allTasks.filter(t => t.status === 'done').length,
    total: allTasks.length
  };

  return (
    <div className="w-full">
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Package className="h-4 w-4 opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs opacity-70 mt-1">Assigned to you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Play className="h-4 w-4 opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs opacity-70 mt-1">Currently working</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs opacity-70 mt-1">Awaiting start</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.done}</div>
              <p className="text-xs opacity-70 mt-1">Finished tasks</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Process Tasks */}
        {currentTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Current Process Tasks</CardTitle>
              <CardDescription>
                Tasks from the active process scheduled for {formatDate(currentTasks[0]?.datePlanned)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTasks.map((task) => (
                  <Card key={task.taskId} className="w-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{task.taskName}</CardTitle>
                          <CardDescription className="mt-1 line-clamp-2">
                            {task.taskDescription || 'No description'}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(task.status)} className="shrink-0">
                          <span className="flex items-center gap-1">
                            {getStatusIcon(task.status)}
                            {task.status.replace('_', ' ')}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Machine Info */}
                      {task.machine && (
                        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                          <Settings className="h-4 w-4 opacity-70" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{task.machine.name}</div>
                            {task.machine.idMachine && (
                              <div className="text-xs opacity-70">{task.machine.idMachine}</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Duration */}
                      {task.duration && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="opacity-70">Duration:</span>
                          <span className="font-medium">{task.duration} min</span>
                        </div>
                      )}

                      {/* Progress */}
                      {task.progress !== undefined && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="opacity-70">Progress:</span>
                          <span className="font-medium">{task.progress}%</span>
                        </div>
                      )}

                      {/* Skills */}
                      {task.skills && task.skills.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs opacity-70">Required Skills:</div>
                          <div className="flex flex-wrap gap-1">
                            {task.skills.map((skill) => (
                              <Badge key={skill._id} variant="outline" className="text-xs">
                                {skill.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Status Selector */}
                      <div className="space-y-2 pt-2 border-t">
                        <label className="text-sm font-medium">Update Status</label>
                        <Select
                          value={task.status}
                          onValueChange={(value) => handleStatusChange(task.processId, task.taskId, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">All My Tasks</CardTitle>
            <CardDescription>Complete overview of all assigned tasks across all processes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTasks.map((task) => (
                <Card key={`${task.processId}-${task.taskId}`} className="w-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{task.taskName}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {task.processName}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusVariant(task.status)} className="shrink-0 text-xs">
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Process Info */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="opacity-70">Process:</span>
                      <Badge variant="outline" className="text-xs">
                        {task.processStatus}
                      </Badge>
                    </div>

                    {/* Date */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="opacity-70">Scheduled:</span>
                      <span className="font-medium">{formatDate(task.datePlanned)}</span>
                    </div>

                    {/* Machine */}
                    {task.machine && (
                      <div className="text-xs">
                        <span className="opacity-70">Machine: </span>
                        <span className="font-medium">{task.machine.name}</span>
                      </div>
                    )}

                    {/* Status Selector */}
                    <div className="space-y-1 pt-2 border-t">
                      <Select
                        value={task.status}
                        onValueChange={(value) => handleStatusChange(task.processId, task.taskId, value)}
                      >
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {allTasks.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 opacity-20 mb-4" />
              <div className="text-lg font-medium mb-1">No Tasks Assigned</div>
              <div className="text-sm opacity-70">You don't have any tasks assigned at the moment</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}