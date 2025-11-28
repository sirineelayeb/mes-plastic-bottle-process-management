// Full fixed ManageProductionSteps.tsx

'use client';

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// TYPES

type Step = {
  id: string;
  name: string;
  orderId: string;
  operators: string[];
  machines: string[];
  plannedStart: Date;
  plannedEnd: Date;
  status: "pending" | "in-progress" | "completed";
};

// INITIAL DATA

const initialSteps: Step[] = [
  {
    id: "STEP-001",
    name: "Injection Molding",
    orderId: "ORD-2025-0891",
    operators: ["Ahmed Ben Ali", "Sami Jlassi"],
    machines: ["IM-01", "IM-02"],
    plannedStart: new Date("2025-04-05T08:00:00"),
    plannedEnd: new Date("2025-04-05T11:00:00"),
    status: "completed",
  },
  {
    id: "STEP-002",
    name: "Quality Control",
    orderId: "ORD-2025-0891",
    operators: ["Mohamed Trabelsi"],
    machines: ["QC Station 3"],
    plannedStart: new Date("2025-04-05T12:00:00"),
    plannedEnd: new Date("2025-04-05T14:00:00"),
    status: "in-progress",
  },
];

const operatorsList = [
  "Ahmed Ben Ali",
  "Sami Jlassi",
  "Fatima Mansour",
  "Mohamed Trabelsi",
  "Amira Zaidi",
];

const machinesList = [
  "IM-01",
  "IM-02",
  "Cooling Tunnel A",
  "QC Station 3",
  "Labeler Pro-500",
  "Auto-Pack Line 2",
];

export default function ManageProductionSteps() {
  const [steps, setSteps] = useState(initialSteps);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Step | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    orderId: "",
    operators: [] as string[],
    machines: [] as string[],
    plannedStart: new Date(),
    plannedEnd: new Date(),
    status: "pending" as "pending" | "in-progress" | "completed",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // VALIDATE FORM

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};

    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.orderId.trim()) newErrors.orderId = true;
    if (formData.operators.length === 0) newErrors.operators = true;
    if (formData.machines.length === 0) newErrors.machines = true;
    if (!formData.plannedStart) newErrors.plannedStart = true;
    if (!formData.plannedEnd) newErrors.plannedEnd = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // CREATE

  const handleCreate = () => {
    if (!validateForm()) return;

    const newStep: Step = {
      id: `STEP-${String(steps.length + 1).padStart(3, "0")}`,
      ...formData,
    };

    setSteps([...steps, newStep]);
    setIsCreateOpen(false);
    resetForm();
  };

  // EDIT

  const handleEdit = () => {
    if (!editingStep || !validateForm()) return;

    setSteps(
      steps.map((s) => (s.id === editingStep.id ? { ...s, ...formData } : s))
    );

    setEditingStep(null);
    resetForm();
  };

  // DELETE

  const handleDelete = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  // RESET FORM

  const resetForm = () => {
    setFormData({
      name: "",
      orderId: "",
      operators: [],
      machines: [],
      plannedStart: new Date(),
      plannedEnd: new Date(),
      status: "pending",
    });
    setErrors({});
  };

  // OPEN EDIT

  const openEdit = (step: Step) => {
    setEditingStep(step);
    setFormData({
      name: step.name,
      orderId: step.orderId,
      operators: step.operators,
      machines: step.machines,
      plannedStart: step.plannedStart,
      plannedEnd: step.plannedEnd,
      status: step.status,
    });
    setErrors({});
    setIsCreateOpen(true);
  };

  // UI

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Production Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => { setIsCreateOpen(true); resetForm(); }}>
            <Plus className="w-4 h-4 mr-2" /> Add New Step
          </Button>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Step</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Operators</TableHead>
              <TableHead>Machines</TableHead>
              <TableHead>Planned</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps.map((step) => (
              <TableRow key={step.id}>
                <TableCell>{step.name}</TableCell>
                <TableCell>{step.orderId}</TableCell>
                <TableCell>
                  {step.operators.join(", ")}
                </TableCell>
                <TableCell>
                  {step.machines.join(", ")}
                </TableCell>
                <TableCell>
                  {format(step.plannedStart, "dd/MM HH:mm")} →
                  {format(step.plannedEnd, "HH:mm")}
                </TableCell>
                <TableCell>
                  <Badge>{step.status}</Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button size="icon" onClick={() => openEdit(step)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(step.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* CREATE / EDIT DIALOG */}

      <Dialog open={isCreateOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingStep(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingStep ? "Edit Step" : "Create Step"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* NAME */}
            <div>
              <Label>Step Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={cn(errors.name && "border-red-500")}
              />
            </div>

            {/* ORDER ID */}
            <div>
              <Label>Order ID *</Label>
              <Input
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                className={cn(errors.orderId && "border-red-500")}
              />
            </div>

            {/* STATUS */}
            <div>
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* OPERATORS */}
            <div>
              <Label>Operators *</Label>
              <Select
                onValueChange={(v) => {
                  if (!formData.operators.includes(v)) {
                    setFormData({ ...formData, operators: [...formData.operators, v] });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {operatorsList.map((op) => (
                    <SelectItem key={op} value={op}>{op}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.operators.map((op) => (
                  <Badge key={op}>
                    {op}
                    <button
                      className="ml-2 text-red-600"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          operators: formData.operators.filter((o) => o !== op),
                        })
                      }
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* MACHINES */}
            <div>
              <Label>Machines *</Label>
              <Select
                onValueChange={(v) => {
                  if (!formData.machines.includes(v)) {
                    setFormData({ ...formData, machines: [...formData.machines, v] });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select machine" />
                </SelectTrigger>
                <SelectContent>
                  {machinesList.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.machines.map((m) => (
                  <Badge key={m}>
                    {m}
                    <button
                      className="ml-2 text-red-600"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          machines: formData.machines.filter((x) => x !== m),
                        })
                      }
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* DATES */}
            <div>
              <Label>Planned Start *</Label>
              <Input
                type="datetime-local"
                value={format(formData.plannedStart, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setFormData({ ...formData, plannedStart: new Date(e.target.value) })
                }
              />
            </div>

            <div>
              <Label>Planned End *</Label>
              <Input
                type="datetime-local"
                value={format(formData.plannedEnd, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setFormData({ ...formData, plannedEnd: new Date(e.target.value) })
                }
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingStep(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>

              <Button onClick={editingStep ? handleEdit : handleCreate}>
                {editingStep ? "Save Changes" : "Create Step"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}