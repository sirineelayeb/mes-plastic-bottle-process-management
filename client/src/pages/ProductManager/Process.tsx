import React, { useState } from "react";
import Calendar from "@/components/base/Calendar";
import { SectionCards } from "@/components/base/DahsboardElements";
import ProcessTimeline from "@/components/base/ProcessTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus } from "lucide-react";
import useFetch from "@/hooks/useFetchData";
import { axiosPublic } from "@/api/axios";
import { toast } from "sonner";

// Types
interface Task {
  _id: string;
  taskName: string;
  taskDescription: string;
  duration: number;
  machine: {
    _id: string;
    idMachine: string;
    name: string;
    status: string;
  };
}

interface Operator {
  _id: string;
  email: string;
  name: string;
}

interface ProcessTask {
  task: string;
  operator: string;
  status: "pending" | "in_progress" | "done";
}

interface FormData {
  datePlanned: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  tasks: ProcessTask[];
}

function Process() {
  const { data: operatorsData } = useFetch<{ operators: Operator[] }>("/auth/operators");
  const { data: tasksData } = useFetch<{ tasks: Task[] }>("/tasks");
  
  const operators = operatorsData?.operators || [];
  const tasks = tasksData?.tasks || [];
  
  const [open, setOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    datePlanned: "",
    status: "planned",
    tasks: []
  });

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [
        ...formData.tasks,
        {
          task: "",
          operator: "",
          status: "pending"
        }
      ]
    });
  };

  const removeTask = (index: number) => {
    setFormData({
      ...formData,
      tasks: formData.tasks.filter((_, i) => i !== index)
    });
  };

  const updateTask = (index: number, field: keyof ProcessTask, value: string) => {
    const updatedTasks = [...formData.tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    };
    setFormData({
      ...formData,
      tasks: updatedTasks
    });
  };

  const handleSubmit = async () => {
    
    try {
      await axiosPublic.post("/process", formData);
      setFormData({
        datePlanned: "",
        status: "planned",
        tasks: []
      });
      toast.success("Process created successfully!");
    } catch (error) {
      console.error("Error creating process:", error);
      toast.error("Failed to create process.");
    }
    
    setOpen(false);
  };

  return (
    <div>
      <Card>
        <CardContent className="flex items-center justify-between">
          <h1 className="font-extrabold text-2xl">Process List</h1>
          
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button>Add Process</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-2xl max-h-[90vh]">
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Process</AlertDialogTitle>
              </AlertDialogHeader>
              
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="datePlanned">Date Planned</Label>
                    <Input
                      id="datePlanned"
                      type="date"
                      value={formData.datePlanned}
                      onChange={(e) =>
                        setFormData({ ...formData, datePlanned: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: FormData["status"]) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Tasks</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTask}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Task
                      </Button>
                    </div>

                    {formData.tasks.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-8 border rounded-md">
                        No tasks added yet. Click "Add Task" to get started.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.tasks.map((task, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-4 space-y-3 bg-muted/30"
                          >
                            <div className="flex items-center justify-between">
                              <Label className="text-base font-semibold">
                                Task {index + 1}
                              </Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTask(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`task-${index}`}>Task</Label>
                              <Select
                                value={task.task}
                                onValueChange={(value) => updateTask(index, "task", value)}
                              >
                                <SelectTrigger id={`task-${index}`}>
                                  <SelectValue placeholder="Select task" />
                                </SelectTrigger>
                                <SelectContent>
                                  {tasks.map((t) => (
                                    <SelectItem key={t._id} value={t._id}>
                                      {t.taskName} - {t.machine.name} ({t.duration}min)
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`operator-${index}`}>Operator</Label>
                              <Select
                                value={task.operator}
                                onValueChange={(value) =>
                                  updateTask(index, "operator", value)
                                }
                              >
                                <SelectTrigger id={`operator-${index}`}>
                                  <SelectValue placeholder="Select operator" />
                                </SelectTrigger>
                                <SelectContent>
                                  {operators.map((operator) => (
                                    <SelectItem key={operator._id} value={operator._id}>
                                      {operator.name} ({operator.email})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`status-${index}`}>Task Status</Label>
                              <Select
                                value={task.status}
                                onValueChange={(value: ProcessTask["status"]) =>
                                  updateTask(index, "status", value)
                                }
                              >
                                <SelectTrigger id={`status-${index}`}>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="done">Done</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>
                  Create Process
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-6 gap-6">
        <div className="flex-1">
          <SectionCards />
          <ProcessTimeline />
        </div>
        <div className="pr-5">
          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default Process;