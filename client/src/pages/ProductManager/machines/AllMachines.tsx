import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
Select,
SelectTrigger,
SelectContent,
SelectItem,
SelectValue,
} from "@/components/ui/select";
import {
Pagination,
PaginationContent,
PaginationItem,
PaginationNext,
PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { axiosPublic } from "@/api/axios";
import { toast, Toaster } from "react-hot-toast";
import { Edit2, Trash2 } from "lucide-react";
import type { Machine } from "@/types/types";

const statusStyles: Record<Machine["status"], string> = {
en_service: "bg-green-100 text-green-700 border-green-300",
en_arret: "bg-red-100 text-red-700 border-red-300",
en_maintenance: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

export default function AllMachines() {
const [machines, setMachines] = useState<Machine[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const [search, setSearch] = useState("");
const [filterStatus, setFilterStatus] = useState<Machine["status"] | "all">("all");
const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 4;

const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
const [openDialog, setOpenDialog] = useState(false);
const [machineName, setMachineName] = useState("");
const [machineDescription, setMachineDescription] = useState("");
const [machineStatus, setMachineStatus] = useState<Machine["status"]>("en_arret");

useEffect(() => {
const fetchMachines = async () => {
try {
const res = await axiosPublic.get("/machines");
setMachines(res.data.machines);
} catch (err) {
console.error(err);
setError("Failed to load machines");
toast.error("Failed to load machines");
} finally {
setLoading(false);
}
};
fetchMachines();
}, []);

const filtered = machines.filter((m) => {
const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
const matchesStatus = filterStatus === "all" || m.status === filterStatus;
return matchesSearch && matchesStatus;
});

const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

const handleEdit = (machine: Machine) => {
setEditingMachine(machine);
setMachineName(machine.name);
setMachineDescription(machine.description || "");
setMachineStatus(machine.status);
setOpenDialog(true);
};

const handleDelete = async (machineId: string) => {
try {
await axiosPublic.delete(`/machines/${machineId}`);
setMachines((prev) => prev.filter((m) => m._id !== machineId));
toast.success("Machine deleted successfully!");
} catch (err) {
console.error(err);
toast.error("Failed to delete machine");
}
};

const handleSave = async () => {
if (!machineName.trim()) return;


try {
  if (editingMachine) {
    const res = await axiosPublic.put(`/machines/${editingMachine._id}`, {
      name: machineName,
      description: machineDescription,
      status: machineStatus,
    });
    setMachines((prev) =>
      prev.map((m) => (m._id === editingMachine._id ? res.data.machine : m))
    );
    toast.success("Machine updated successfully!");
  } else {
    const res = await axiosPublic.post("/machines", {
      name: machineName,
      description: machineDescription,
      status: machineStatus,
    });
    setMachines((prev) => [...prev, res.data.machine]);
    toast.success("Machine added successfully!");
  }
} catch (err) {
  console.error(err);
  toast.error("Failed to save machine");
} finally {
  setOpenDialog(false);
  setEditingMachine(null);
  setMachineName("");
  setMachineDescription("");
  setMachineStatus("en_arret");
}


};

if (loading) return <p>Loading machines...</p>;
if (error) return <p className="text-red-500">{error}</p>;

return ( <div className="p-6 space-y-6 max-w-5xl mx-auto"> <Toaster position="top-right" reverseOrder={false} /> <h1 className="text-2xl font-bold mb-4">All Machines</h1>


  {/* Filters */}
  <div className="flex flex-col md:flex-row gap-4 mb-4">
  <Input
  placeholder="Search machine..."
  value={search}
  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
/>

<Select
  onValueChange={(val) => { setFilterStatus(val as Machine["status"] | "all"); setCurrentPage(1); }}
>

      <SelectTrigger className="md:w-1/3">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="en_service">In Service</SelectItem>
        <SelectItem value="en_arret">Stopped</SelectItem>
        <SelectItem value="en_maintenance">Under Maintenance</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Machine Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {paginated.length > 0 ? (
      paginated.map((machine) => (
        <Card key={machine._id} className="p-4 border rounded-lg space-y-2 relative">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">{machine.name}</h2>
              <p className="text-sm text-gray-600">{machine.description || "-"}</p>
              <Badge className={`text-xs px-2 py-1 rounded-md border ${statusStyles[machine.status]}`}>
                {machine.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(machine)} className="p-1 hover:bg-gray-200 rounded">
                <Edit2 className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(machine._id)} className="p-1 hover:bg-gray-200 rounded">
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </Card>
      ))
    ) : (
      <p className="text-center text-gray-500 col-span-full">No machines found.</p>
    )}
  </div>

  {/* Pagination */}
  {totalPages > 1 && (
    <Pagination className="mt-4 flex justify-center">
      <PaginationContent>
        <PaginationPrevious
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
        >
          Previous
        </PaginationPrevious>

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

        <PaginationNext
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
        >
          Next
        </PaginationNext>
      </PaginationContent>
    </Pagination>
  )}

  {/* Edit/Add Dialog */}
  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{editingMachine ? "Edit Machine" : "Add Machine"}</DialogTitle>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <Input
            value={machineName}
            onChange={(e) => setMachineName(e.target.value)}
            placeholder="Machine name"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <Input
            value={machineDescription}
            onChange={(e) => setMachineDescription(e.target.value)}
            placeholder="Machine description"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <Select
            value={machineStatus}
            onValueChange={(val) => setMachineStatus(val as Machine["status"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en_service">In Service</SelectItem>
              <SelectItem value="en_arret">Stopped</SelectItem>
              <SelectItem value="en_maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            setOpenDialog(false);
            setEditingMachine(null);
            setMachineName("");
            setMachineDescription("");
            setMachineStatus("en_arret");
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSave}>{editingMachine ? "Save" : "Add"}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>


);
}
