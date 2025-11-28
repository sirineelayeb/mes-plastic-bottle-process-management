'use client';

import React, { useState } from "react";
import {
  Plus,
  Filter,
  UserCheck,
  Edit,
  Clock,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const productionSteps = [
  "Injection Molding",
  "Blow Molding",
  "Cooling",
  "Quality Control",
  "Labeling",
  "Packaging",
];

const shiftSchedules: Record<string, { start: string; end: string }> = {
  Morning: { start: "06:00", end: "14:00" },
  Afternoon: { start: "14:00", end: "22:00" },
  Night: { start: "22:00", end: "06:00" },
};

type Operator = {
  id: string;
  name: string;
  email: string;
  steps: string[];
  status: "active" | "inactive";
  availability: boolean;
  shift: "Morning" | "Afternoon" | "Night";
  shiftStart: string;
  shiftEnd: string;
};

const initialOperators: Operator[] = [
  {
    id: "1",
    name: "Ahmed Ben Ali",
    email: "ahmed@factory.com",
    steps: ["Injection Molding", "Blow Molding"],
    status: "active",
    availability: true,
    shift: "Morning",
    shiftStart: "06:00",
    shiftEnd: "14:00",
  },
  {
    id: "2",
    name: "Fatima Mansour",
    email: "fatima@factory.com",
    steps: ["Quality Control", "Packaging"],
    status: "active",
    availability: false,
    shift: "Afternoon",
    shiftStart: "14:00",
    shiftEnd: "22:00",
  },
  {
    id: "3",
    name: "Mohamed Trabelsi",
    email: "mohamed@factory.com",
    steps: ["Injection Molding", "Blow Molding", "Cooling", "Quality Control"],
    status: "active",
    availability: true,
    shift: "Morning",
    shiftStart: "06:00",
    shiftEnd: "14:00",
  },
  {
    id: "4",
    name: "Amira Zaidi",
    email: "amira@factory.com",
    steps: ["Cooling", "Labeling"],
    status: "inactive",
    availability: false,
    shift: "Night",
    shiftStart: "22:00",
    shiftEnd: "06:00",
  },
];

export default function OperatorManagement() {
  const [operators, setOperators] = useState<Operator[]>(initialOperators);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStep, setFilterStep] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedOperator, setEditedOperator] = useState<Operator | null>(null);

  const filteredOperators = operators.filter((op) => {
    const matchesSearch =
      op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStep === "all" || op.steps.includes(filterStep);
    return matchesSearch && matchesFilter;
  });

  const getNextStepInfo = (op: Operator) => {
    if (op.availability) {
      return {
        step: "Available – Ready for assignment",
        time: "Now",
        color: "bg-green-100 text-green-800",
      };
    }

    const now = new Date();
    const [startH, startM] = op.shiftStart.split(":").map(Number);
    const shiftStartTime = new Date();
    shiftStartTime.setHours(startH, startM, 0, 0);

    const nextStep = op.steps[0] || "None assigned";

    if (now < shiftStartTime) {
      return {
        step: nextStep,
        time: `Shift starts at ${op.shiftStart}`,
        color: "bg-blue-100 text-blue-800",
      };
    } else {
      const estimatedEnd = new Date(
        shiftStartTime.getTime() + op.steps.length * 45 * 60 * 1000
      );
      return {
        step: nextStep,
        time: `Finishes ~${estimatedEnd.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        color: "bg-orange-100 text-orange-800",
      };
    }
  };

  const handleSave = () => {
    if (editedOperator) {
      setOperators((prev) =>
        prev.map((op) => (op.id === editedOperator.id ? editedOperator : op))
      );
      setSelectedOperator(editedOperator);
      setIsEditMode(false);
    }
  };

  const openDetails = (op: Operator) => {
    setSelectedOperator(op);
    setEditedOperator({ ...op });
    setIsEditMode(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <UserCheck className="w-9 h-9 text-primary" />
              Operator Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage operators for plastic bottle production line
            </p>
          </div>
         <Button asChild>
  <Link to="/operators/add">
    <Plus className="w-4 h-4 mr-2" />
    Add Operator
  </Link>
</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-6">
            <div className="text-sm text-muted-foreground">Total Operators</div>
            <div className="text-3xl font-bold mt-1">{operators.length}</div>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <div className="text-sm text-muted-foreground">Available Now</div>
            <div className="text-3xl font-bold text-green-600 mt-1">
              {operators.filter((op) => op.availability).length}
            </div>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-3xl font-bold text-primary mt-1">
              {operators.filter((op) => op.status === "active").length}
            </div>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <div className="text-sm text-muted-foreground">On Duty</div>
            <div className="text-3xl font-bold text-orange-600 mt-1">
              {operators.filter((op) => !op.availability && op.status === "active").length}
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filter by Step
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant={filterStep === "all" ? "default" : "secondary"} size="sm" onClick={() => setFilterStep("all")}>
                All Steps
              </Button>
              {productionSteps.map((step) => (
                <Button key={step} variant={filterStep === step ? "default" : "secondary"} size="sm" onClick={() => setFilterStep(step)}>
                  {step}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Operators ({filteredOperators.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Operator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Shift</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Next Step</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOperators.map((op) => {
                  const info = getNextStepInfo(op);
                  return (
                    <tr key={op.id} className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => openDetails(op)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                            {op.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="font-medium">{op.name}</div>
                            <div className="text-sm text-muted-foreground">{op.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>{op.shift} Shift</div>
                        <div className="text-xs text-muted-foreground">{op.shiftStart} – {op.shiftEnd}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className={info.color}>
                          <Clock className="w-3 h-3 mr-1" />
                          {info.step}
                          <span className="ml-1 text-xs opacity-80">({info.time})</span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={op.status === "active" ? "default" : "secondary"}>{op.status}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={op.availability ? "outline" : "destructive"}>
                          {op.availability ? "Available" : "On Duty"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <Dialog open={!!selectedOperator} onOpenChange={() => setSelectedOperator(null)}>
          <DialogContent className="max-w-2xl">
            {selectedOperator && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between text-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                        {selectedOperator.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      {isEditMode ? "Edit Operator" : selectedOperator.name}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditMode(!isEditMode)}>
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditMode ? "Cancel" : "Edit"}
                    </Button>
                  </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                  {isEditMode ? (
                    <>
                      {/* Edit Form */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <Input
                            value={editedOperator?.name || ""}
                            onChange={(e) => setEditedOperator((p) => p ? { ...p, name: e.target.value } : null)}
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={editedOperator?.email || ""}
                            onChange={(e) => setEditedOperator((p) => p ? { ...p, email: e.target.value } : null)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Shift</Label>
                        <Select
                          value={editedOperator?.shift}
                          onValueChange={(v) => {
                            const shift = v as "Morning" | "Afternoon" | "Night";
                            setEditedOperator((p) => p ? { ...p, shift, shiftStart: shiftSchedules[shift].start, shiftEnd: shiftSchedules[shift].end } : null);
                          }}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Morning">Morning (06:00 – 14:00)</SelectItem>
                            <SelectItem value="Afternoon">Afternoon (14:00 – 22:00)</SelectItem>
                            <SelectItem value="Night">Night (22:00 – 06:00)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Production Steps</Label>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {productionSteps.map((step) => (
                            <label key={step} className="flex items-center gap-2">
                              <Checkbox
                                checked={editedOperator?.steps.includes(step)}
                                onCheckedChange={(checked) => {
                                  setEditedOperator((p) =>
                                    p
                                      ? checked
                                        ? { ...p, steps: [...p.steps, step] }
                                        : { ...p, steps: p.steps.filter((s) => s !== step) }
                                      : null
                                  );
                                }}
                              />
                              <span>{step}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={editedOperator?.status}
                            onValueChange={(v) => setEditedOperator((p) => p ? { ...p, status: v as "active" | "inactive" } : null)}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Availability</Label>
                          <Select
                            value={editedOperator?.availability ? "true" : "false"}
                            onValueChange={(v) => setEditedOperator((p) => p ? { ...p, availability: v === "true" } : null)}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Available</SelectItem>
                              <SelectItem value="false">On Duty</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* View Mode */}
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{selectedOperator.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Shift</p>
                          <p className="font-medium">{selectedOperator.shift} ({selectedOperator.shiftStart} – {selectedOperator.shiftEnd})</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Assigned Steps</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedOperator.steps.map((s) => (
                            <Badge key={s} variant="secondary">{s}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-3">Next Action</p>
                        <div className="p-5 bg-muted rounded-lg flex items-center gap-4">
                          <Calendar className="w-10 h-10 text-primary" />
                          <div>
                            <p className="font-semibold text-lg">{getNextStepInfo(selectedOperator).step}</p>
                            <p className="text-sm text-muted-foreground">{getNextStepInfo(selectedOperator).time}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge variant={selectedOperator.status === "active" ? "default" : "secondary"}>{selectedOperator.status}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Availability</p>
                          <Badge variant={selectedOperator.availability ? "outline" : "destructive"}>
                            {selectedOperator.availability ? "Available" : "On Duty"}
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {isEditMode && (
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditMode(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </DialogFooter>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}