import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/useFetchData";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { axiosPublic } from "@/api/axios";
import { toast } from "sonner";
import { BotIcon, Clock, Settings, WorkflowIcon } from "lucide-react";

export default function AddTask() {
  const { data: tasks, loading, error, refetch } = useFetch("/tasks");
  const { data: skillsData } = useFetch("/skills");
  const { data: machinesData } = useFetch("/machines");

  const [open, setOpen] = useState(false);

  // Form States
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [machine, setMachine] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const handleSkillToggle = (id: string) => {
    setSkills((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  console.log("Selected skills:", tasks);

  const handleSubmit = async () => {
    try {
      await axiosPublic.post("/tasks", {
        taskName,
        taskDescription,
        duration: Number(duration),
        machine,
        skills,
      })

      toast.success("Task created successfully!");
      setOpen(false);
      setTaskName("");
      setTaskDescription("");
      setDuration("");
      setMachine("");
      refetch();
      
    } catch (error) {
      toast.error("Error creating task.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-background">
      <Card className="p-2">
        <CardContent className="p-2">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Tasks</h1>

            {/* ---------------- ADD TASK MODAL ---------------- */}
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button>Add New Task</Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>Create New Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Fill in all required fields to add a task.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* ---------------- FORM ---------------- */}
                <div className="space-y-4 mt-4">

                  <div>
                    <Label>Task Name</Label>
                    <Input
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder="Enter task name"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Enter task description"
                    />
                  </div>

                  <div>
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="ex: 45"
                    />
                  </div>

                  {/* Machines */}
                  <div>
                    <Label>Select Machine</Label>
                  <Select onValueChange={(value) => setMachine(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a machine" />
                  </SelectTrigger>

                  <SelectContent>
                    {machinesData?.machines?.map((m: any) => (
                      <SelectItem key={m._id} value={m._id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                  </div>

                  {/* Skills Multi-Select */}
                  <div>
                    <Label>Required Skills</Label>
                    <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                      {skillsData?.skills?.map((s: any) => (
                        <Label
                          key={s._id}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            checked={skills.includes(s._id)}
                            onCheckedChange={() => handleSkillToggle(s._id)}
                          />
                          <span>{s.name}</span>
                        </Label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ---------------- FOOTER ---------------- */}
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>
                    Create Task
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {/* ------------------------------------------------ */}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-6 flex-1 flex-wrap">
        {tasks &&
          tasks.success &&
          tasks.tasks.map((task: any) => (
            <Card key={task._id} className="mb-4 w-[80vh]">
              <CardContent>
                <div className="flex gap-5 items-center">

                  <div>
                    <Settings />
                  </div>
                  <div className="flex flex-col">

                <span className="text-lg font-semibold mb-2 flex items-center gap-2">
                  {task.taskName} - <span className="text-xs flex items-center gap-2 items-center"><BotIcon size={15}/> {task.machine.name}</span> - <span className="text-xs flex items-center gap-2 bg-primary/20 px-3 py-[3px] rounded-[10px] text-primary"><Clock size={13} /> {task.duration} Min</span>
                </span>
                <p className="text-sm mb-1">
                  {task.taskDescription}
                </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
