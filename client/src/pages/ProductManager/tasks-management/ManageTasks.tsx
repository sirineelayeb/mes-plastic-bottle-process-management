import React, { useState, useEffect } from "react";
import { Package, Edit2, Trash2, Eye, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { axiosPublic } from "@/api/axios";
import type { Task, Operator, Skill, Machine } from "@/types/types";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function ManageTasks() {
const [tasks, setTasks] = useState<Task[]>([]);
const [operators, setOperators] = useState<Operator[]>([]);
const [skills, setSkills] = useState<Skill[]>([]);
const [machines, setMachines] = useState<Machine[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [isEditing, setIsEditing] = useState(false);
const [editedTask, setEditedTask] = useState<Task | null>(null);
const [viewDetails, setViewDetails] = useState<Task | null>(null);

// Pagination state
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5; // Number of tasks per page
const statusTextColors: Record<string, string> = {
  Pending: "text-yellow-800",
  "In Progress": "text-blue-800",
  Completed: "text-green-800",
};const statusBgColors: Record<string, string> = {
  Pending: "bg-yellow-100",
  "In Progress": "bg-blue-100",
  Completed: "bg-green-100",
};


// Fetch tasks, operators, skills, and machines
useEffect(() => {
const fetchData = async () => {
try {
const [tasksRes, operatorsRes, skillsRes, machinesRes] = await Promise.all([
axiosPublic.get("/tasks"),
axiosPublic.get("/auth/users"),
axiosPublic.get("/skills"),
axiosPublic.get("/machines"),
]);
setTasks(tasksRes.data.tasks);
setOperators(
operatorsRes.data.operators.map((u: any) => ({
_id: u._id,
name: u.name,
skills: u.skills || [],
}))
);
setSkills(skillsRes.data.skills || []);
setMachines(machinesRes.data.machines || []);
} catch (err) {
console.error(err);
setError("Failed to load data");
} finally {
setLoading(false);
}
};
fetchData();
}, []);

const handleDelete = async (taskId: string) => {
if (!window.confirm("Are you sure you want to delete this task?")) return;
try {
await axiosPublic.delete(`/tasks/${taskId}`);
setTasks(tasks.filter((t) => t._id !== taskId));
toast.success("Task deleted successfully");
} catch (err: any) {
console.error(err);
toast.error(err.response?.data?.message || "Failed to delete task");
}
};

const handleSaveEdit = async () => {
if (!editedTask) return;
try {
await axiosPublic.put(`/tasks/${editedTask._id}`, editedTask);
setTasks(
tasks.map((t) => (t._id === editedTask._id ? editedTask : t))
);
setIsEditing(false);
toast.success("Task updated successfully");
} catch (err) {
console.error(err);
toast.error("Failed to update task");
}
};

const toggleSkill = (skillId: string) => {
if (!editedTask) return;
const skill = skills.find((s) => s._id === skillId);
if (!skill) return;


const hasSkill = editedTask.skills.some((s) => s._id === skillId);
const updatedSkills = hasSkill
  ? editedTask.skills.filter((s) => s._id !== skillId)
  : [...editedTask.skills, skill];

setEditedTask({ ...editedTask, skills: updatedSkills });


};

const toggleOperator = (operatorId: string) => {
if (!editedTask) return;
const operator = operators.find((o) => o._id === operatorId);
if (!operator) return;


const hasOperator = editedTask.operators?.some((o) => o._id === operatorId);
const updatedOperators = hasOperator
  ? editedTask.operators.filter((o) => o._id !== operatorId)
  : [...(editedTask.operators || []), { _id: operator._id, name: operator.name }];

setEditedTask({ ...editedTask, operators: updatedOperators });


};

if (loading) return <p>Loading tasks...</p>;
if (error) return <p className="text-red-500">{error}</p>;

// Pagination
const totalPages = Math.ceil(tasks.length / itemsPerPage);
const paginatedTasks = tasks.slice(
(currentPage - 1) * itemsPerPage,
currentPage * itemsPerPage
);

return ( <div className="min-h-screen bg-background"> <Toaster position="top-right" reverseOrder={false} />


  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
    <h1 className="text-3xl font-bold flex items-center gap-3">
      <Package className="w-9 h-9 text-primary" />
      Manage Production Tasks
    </h1>

    <Button asChild variant="default">
      <Link to="/tasks/add" className="flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add Task
      </Link>
    </Button>

    {/* Tasks Table */}
    <Card>
      <CardHeader>
        <CardTitle>Tasks ({tasks.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTasks.map((task) => (
              <TableRow key={task._id} className="hover:bg-muted/50">
                <TableCell className="font-semibold">{task.taskName}</TableCell>
         <TableCell>
  <span
    className={`inline-block px-2 py-1 rounded-full text-sm font-medium 
      ${statusBgColors[task.status || "Pending"]} 
      ${statusTextColors[task.status || "Pending"]}`}
  >
    {task.status || "Pending"}
  </span>
</TableCell>


                <TableCell>{task.dateStart ? new Date(task.dateStart).toLocaleString() : "—"}</TableCell>
                <TableCell>{task.dateEnd ? new Date(task.dateEnd).toLocaleString() : "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditedTask(task);
                        setIsEditing(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(task._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setViewDetails(task)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationPrevious
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </PaginationPrevious>

            <PaginationContent>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem
                  key={i + 1}
                  page={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? "bg-primary text-white" : ""}
                >
                  {i + 1}
                </PaginationItem>
              ))}
            </PaginationContent>

            <PaginationNext
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </PaginationNext>
          </Pagination>
        </div>
      </CardContent>
    </Card>

    {/* Edit Task Modal */}
    {isEditing && editedTask && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4"
        onClick={() => setIsEditing(false)}
      >
        <Card 
          className="w-full max-w-2xl my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Edit Task: {editedTask.taskName}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsEditing(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
            
            {/* Task Name */}
            <div>
              <label className="font-semibold block mb-2">Task Name</label>
              <Input
                value={editedTask.taskName}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, taskName: e.target.value })
                }
              />
            </div>

            {/* Status */}
          <div>
  <label className="font-semibold block mb-2">Status</label>
  <select
    value={editedTask.status || "Pending"}
    onChange={(e) =>
      setEditedTask({
        ...editedTask,
        status: e.target.value as "Pending" | "In Progress" | "Completed",
      })
    }
    className={`w-full border rounded-md p-2
      ${statusBgColors[editedTask.status || "Pending"]}
      ${statusTextColors[editedTask.status || "Pending"]}`}
  >
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Completed">Completed</option>
  </select>
</div>


            {/* Skills */}
            <div>
              <label className="font-semibold block mb-2">Skills</label>
              <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                {skills.map((skill) => (
                  <label key={skill._id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedTask.skills.some((s) => s._id === skill._id)}
                      onChange={() => toggleSkill(skill._id)}
                      className="w-4 h-4"
                    />
                    <span>{skill.name}</span>
                  </label>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {editedTask.skills.map((skill) => (
                  <Badge key={skill._id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Machine */}
            <div>
              <label className="font-semibold block mb-2">Machine</label>
              <select
                value={editedTask.machine?._id || ""}
                onChange={(e) => {
                  const selectedMachine = machines.find((m) => m._id === e.target.value);
                  setEditedTask({ ...editedTask, machine: selectedMachine || null });
                }}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select a machine</option>
                {machines.map((machine) => (
                  <option key={machine._id} value={machine._id}>
                    {machine.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Operators */}
            <div>
              <label className="font-semibold block mb-2">Operators</label>
              <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                {operators.map((operator) => (
                  <label key={operator._id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedTask.operators?.some((o) => o._id === operator._id)}
                      onChange={() => toggleOperator(operator._id)}
                      className="w-4 h-4"
                    />
                    <span>{operator.name}</span>
                  </label>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {editedTask.operators?.map((operator) => (
                  <Badge key={operator._id} variant="secondary">
                    {operator.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Start Time */}
            <div>
              <label className="font-semibold block mb-2">Start Time</label>
              <Input
                type="datetime-local"
                value={
                  editedTask.dateStart
                    ? new Date(editedTask.dateStart).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setEditedTask({ ...editedTask, dateStart: e.target.value })
                }
              />
            </div>

            {/* End Time */}
            <div>
              <label className="font-semibold block mb-2">End Time</label>
              <Input
                type="datetime-local"
                value={
                  editedTask.dateEnd
                    ? new Date(editedTask.dateEnd).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setEditedTask({ ...editedTask, dateEnd: e.target.value })
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="default" onClick={handleSaveEdit}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )}

    {/* View Task Details Modal */}
    {viewDetails && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={() => setViewDetails(null)}
      >
        <Card 
          className="w-full max-w-lg mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Task Details: {viewDetails.taskName}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setViewDetails(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong>Task Name:</strong> {viewDetails.taskName}</p>
            <p><strong>Status:</strong> {viewDetails.status || "Pending"}</p>
            <p><strong>Skills:</strong> {viewDetails.skills?.map((s) => s.name).join(", ") || "—"}</p>
            <p><strong>Operators:</strong> {viewDetails.operators?.map((o) => o.name).join(", ") || "—"}</p>
            <p><strong>Machine:</strong> {viewDetails.machine?.name || "—"}</p>
            <p><strong>Start:</strong> {viewDetails.dateStart ? new Date(viewDetails.dateStart).toLocaleString() : "—"}</p>
            <p><strong>End:</strong> {viewDetails.dateEnd ? new Date(viewDetails.dateEnd).toLocaleString() : "—"}</p>
          </CardContent>
        </Card>
      </div>
    )}
  </div>
</div>


);
}
