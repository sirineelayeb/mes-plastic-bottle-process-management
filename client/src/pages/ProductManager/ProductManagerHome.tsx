import useFetch from "@/hooks/useFetchData";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, ListChecks, TrendingUp, Calendar, PlayCircle, PauseCircle, CheckCircle2 } from 'lucide-react';

export default function ProductManagerHome() {
  const { data: currentProcess } = useFetch("/process/current");
  const { data: totalProcesses } = useFetch("/process");
  const { data: operators } = useFetch("/auth/operators");
  
  console.log("all data:", currentProcess, totalProcesses, operators);

  // Calculate statistics
  const getProcessStats = () => {
    if (!totalProcesses?.processes) return { planned: 0, inProgress: 0, completed: 0 };
    
    const stats = totalProcesses.processes.reduce((acc, process) => {
      if (process.status === 'planned') acc.planned++;
      if (process.status === 'in_progress') acc.inProgress++;
      if (process.status === 'completed') acc.completed++;
      return acc;
    }, { planned: 0, inProgress: 0, completed: 0 });
    
    return stats;
  };

  const getTaskStats = () => {
    if (!currentProcess?.process?.tasks) return { pending: 0, inProgress: 0, done: 0 };
    
    return currentProcess.process.tasks.reduce((acc, taskItem) => {
      if (taskItem.status === 'pending') acc.pending++;
      if (taskItem.status === 'in_progress') acc.inProgress++;
      if (taskItem.status === 'done') acc.done++;
      return acc;
    }, { pending: 0, inProgress: 0, done: 0 });
  };

  const calculateProgress = () => {
    if (!currentProcess?.process?.tasks) return 0;
    const tasks = currentProcess.process.tasks;
    const completed = tasks.filter(t => t.status === 'done').length;
    return Math.round((completed / tasks.length) * 100);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'border-green-500/50';
      case 'in_progress':
        return 'border-blue-500/50';
      default:
        return 'border-orange-500/50';
    }
  };

  const stats = getProcessStats();
  const taskStats = getTaskStats();
  const progress = calculateProgress();

  // Loading state
  if (!currentProcess && !totalProcesses && !operators) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-2">
            <div className="text-lg font-medium">Loading dashboard...</div>
            <div className="text-sm opacity-70">Please wait</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-6 space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Processes</CardTitle>
              <ListChecks className="h-4 w-4 opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProcesses?.count || 0}</div>
              <p className="text-xs opacity-70 mt-1">
                {stats.inProgress} in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Operators</CardTitle>
              <Users className="h-4 w-4 opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operators?.count || 0}</div>
              <p className="text-xs opacity-70 mt-1">
                Available for tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planned</CardTitle>
              <Calendar className="h-4 w-4 opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.planned}</div>
              <p className="text-xs opacity-70 mt-1">
                Upcoming processes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs opacity-70 mt-1">
                Finished successfully
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Process Section */}
        {currentProcess?.process && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Current Process Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Current Process</CardTitle>
                    <CardDescription className="mt-1">
                      Scheduled for {formatDate(currentProcess.process.datePlanned)}
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="text-sm">
                    {currentProcess.process.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Overall Progress</span>
                    <span className="opacity-70">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs opacity-70">
                    <span>{taskStats.done} completed</span>
                    <span>{currentProcess.process.tasks.length} total tasks</span>
                  </div>
                </div>

                {/* Timeline Chart */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Task Timeline</h3>
                  <div className="space-y-2">
                    {currentProcess.process.tasks.map((taskItem, idx) => {
                      const taskName = taskItem.task?.taskName || 'Untitled Task';
                      const operatorName = taskItem.operator?.name || 'Unassigned';
                      const hasTime = taskItem.startTime && taskItem.endTime;
                      
                      return (
                        <div 
                          key={idx} 
                          className={`p-3 rounded-lg border-l-4 ${getStatusColor(taskItem.status)} hover:bg-accent/50 transition-colors`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {getStatusIcon(taskItem.status)}
                                <span className="font-medium text-sm truncate">{taskName}</span>
                              </div>
                              <div className="text-xs opacity-70 truncate">
                                {operatorName}
                              </div>
                            </div>
                            {hasTime && (
                              <div className="text-xs opacity-70 whitespace-nowrap">
                                {formatTime(taskItem.startTime)} - {formatTime(taskItem.endTime)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Status</CardTitle>
                <CardDescription>Current process breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <span className="text-sm">Completed</span>
                    </div>
                    <span className="text-sm font-semibold">{taskStats.done}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500/80" />
                      <span className="text-sm">In Progress</span>
                    </div>
                    <span className="text-sm font-semibold">{taskStats.inProgress}</span>
                  </div>
                  
           
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-sm">Pending</span>
                    </div>
                    <span className="text-sm font-semibold">{taskStats.pending}</span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <h4 className="text-sm font-medium">Top Operators</h4>
                  {operators?.operators?.slice(0, 3).map((operator) => (
                    <div key={operator._id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                        {operator.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{operator.name}</div>
                        <div className="text-xs opacity-70">{operator.skills?.length || 0} skills</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Processes Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Processes</CardTitle>
            <CardDescription>Overview of all production processes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {totalProcesses?.processes?.slice(0, 5).map((process) => (
                <div 
                  key={process._id} 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Calendar className="h-4 w-4 opacity-70 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{formatDate(process.datePlanned)}</div>
                      <div className="text-xs opacity-70">{process.tasks.length} tasks</div>
                    </div>
                  </div>
                  <Badge variant={process.status === 'completed' ? 'outline' : 'default'}>
                    {process.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}