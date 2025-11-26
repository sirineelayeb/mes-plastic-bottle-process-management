// src/pages/supervisor/AllTasks.tsx
import React from "react";
import { Package, Clock, CheckCircle, AlertCircle, Filter, Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";

const tasks = [
  { id: "T001", name: "Batch A-101", product: "500ml Water Bottle", status: "in_progress", priority: "high", assignedTo: "Ahmed Ben Ali", startTime: "08:00", progress: 68 },
  { id: "T002", name: "Batch B-202", product: "1L Juice Bottle", status: "in_progress", priority: "medium", assignedTo: "Fatima Mansour", startTime: "09:30", progress: 82 },
  { id: "T003", name: "Batch C-303", product: "2L Soda Bottle", status: "pending", priority: "low", assignedTo: null, startTime: "10:00", progress: 0 },
  { id: "T004", name: "Batch D-404", product: "1.5L Water Bottle", status: "completed", priority: "medium", assignedTo: "Mohamed Trabelsi", startTime: "07:00", progress: 100 },
  { id: "T005", name: "Batch E-505", product: "750ml Sports Bottle", status: "paused", priority: "high", assignedTo: "Amira Zaidi", startTime: "08:30", progress: 35 },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "in_progress":
      return {
        label: "In Progress",
        variant: "default" as const,
        className: "bg-blue-100 text-blue-800",
        icon: <Clock className="w-3 h-3" />,
      };
    case "pending":
      return {
        label: "Pending",
        variant: "secondary" as const,
        className: "",
        icon: <AlertCircle className="w-3 h-3" />,
      };
    case "completed":
      return {
        label: "Completed",
        variant: "outline" as const,
        className: "bg-green-100 text-green-800 border-green-300",
        icon: <CheckCircle className="w-3 h-3" />,
      };
    case "paused":
      return {
        label: "Paused",
        variant: "destructive" as const,
        className: "bg-orange-100 text-orange-800",
        icon: <AlertCircle className="w-3 h-3" />,
      };
    default:
      return {
        label: status,
        variant: "secondary" as const,
        className: "",
        icon: null,
      };
  }
};

export default function AllTasks() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Package className="w-9 h-9 text-primary" />
              All Production Tasks
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor and track all active and scheduled production tasks
            </p>
          </div>
          <Button asChild>
            <Link to="/tasks/manage">
              <Filter className="w-4 h-4 mr-2" />
              Manage Tasks
            </Link>
          </Button>
        </div>

        {/* Search & Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tasks..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Tasks ({tasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task ID</TableHead>
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => {
                  const status = getStatusConfig(task.status);
                  return (
                    <TableRow key={task.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{task.id}</TableCell>
                      <TableCell className="font-semibold">{task.name}</TableCell>
                      <TableCell>{task.product}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className={status.className || ""}>
                          {status.icon} {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}>
                          {task.priority.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.assignedTo || "—"}</TableCell>
                      <TableCell>{task.startTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{task.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}