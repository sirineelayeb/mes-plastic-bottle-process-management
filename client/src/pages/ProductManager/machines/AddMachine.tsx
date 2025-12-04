import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { axiosPublic } from "@/api/axios";
import { toast, Toaster } from "react-hot-toast";
import { Plus } from 'lucide-react';

type MachineStatus = "en_service" | "en_arret" | "en_maintenance";

export default function AddMachine() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<MachineStatus>("en_arret");

  const handleAddMachine = async () => {
    if (!name) {
      toast.error("Machine Name is required.");
      return;
    }

    const newMachine = {
      name,
      description,
      status,
    };

    try {
      const res = await axiosPublic.post("/machines", newMachine);
      toast.success(`Machine "${res.data.machine.name}" added successfully!`);

      // Reset form
      setName("");
      setDescription("");
      setStatus("en_arret");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add machine");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-2xl font-bold flex items-center gap-3">
        <Plus className="w-6 h-6 text-primary" />
        Add New Machine
      </h1>

      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Machine Name *</label>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter machine name" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Enter machine description (optional)" 
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select onValueChange={(val) => setStatus(val as MachineStatus)} defaultValue="en_arret">
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en_service">In Service</SelectItem>
              <SelectItem value="en_arret">Stopped</SelectItem>
              <SelectItem value="en_maintenance">Under Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAddMachine} className="mt-2 w-full">
          Add Machine
        </Button>
      </Card>
    </div>
  );
}