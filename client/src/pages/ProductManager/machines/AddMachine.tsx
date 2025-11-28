
import  { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MachineItem } from "@/types/types"; // import from types.ts

export default function AddMachine() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState<MachineItem["status"]>("available");
  const [unavailableFrom, setUnavailableFrom] = useState("");
  const [expectedAvailable, setExpectedAvailable] = useState("");
  const [machines, setMachines] = useState<MachineItem[]>([]);

  const handleAddMachine = () => {
    if (!name || !type) {
      alert("Name and Type are required.");
      return;
    }

    const newMachine: MachineItem = {
      id: `m${machines.length + 1}`, // string id to match MachineItem
      name,
      type,
      status,
      unavailableFrom: unavailableFrom || undefined,
      expectedAvailable: expectedAvailable || undefined,
      efficiency: undefined, // optional, can add input later
    };

    setMachines([...machines, newMachine]);

    // Reset form
    setName("");
    setType("");
    setStatus("available");
    setUnavailableFrom("");
    setExpectedAvailable("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Add New Machine</h1>

      <Card className="p-6 space-y-4">
        {/* Machine Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Machine Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter machine name"
          />
        </div>

        {/* Machine Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Machine Type</label>
          <Input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Enter machine type"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            onValueChange={(val) => setStatus(val as MachineItem["status"])}
            defaultValue="available"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in_use">In Use</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="out_of_service">Out of Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Unavailable From */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Unavailable From</label>
          <Input
            type="datetime-local"
            value={unavailableFrom}
            onChange={(e) => setUnavailableFrom(e.target.value)}
          />
        </div>

        {/* Expected Availability */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Expected Availability</label>
          <Input
            type="datetime-local"
            value={expectedAvailable}
            onChange={(e) => setExpectedAvailable(e.target.value)}
          />
        </div>

        <Button onClick={handleAddMachine} className="mt-2 w-full">
          Add Machine
        </Button>
      </Card>

      {/* Display Added Machines */}
      {machines.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Machines Added</h2>
          {machines.map((machine) => (
            <Card key={machine.id} className="p-4 border">
              <p className="font-semibold">
                {machine.name} ({machine.type})
              </p>
              <p>Status: {machine.status.replace("_", " ").toUpperCase()}</p>
              {machine.unavailableFrom && (
                <p>
                  Unavailable From:{" "}
                  {new Date(machine.unavailableFrom).toLocaleString()}
                </p>
              )}
              {machine.expectedAvailable && (
                <p>
                  Expected Available:{" "}
                  {new Date(machine.expectedAvailable).toLocaleString()}
                </p>
              )}
              {machine.efficiency !== undefined && (
                <p>Efficiency: {machine.efficiency}%</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
