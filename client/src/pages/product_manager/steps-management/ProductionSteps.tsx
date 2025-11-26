// src/pages/supervisor/ProductionSteps.tsx
'use client';

import React, { useState } from "react";
import { format } from "date-fns";
import { Clock, User, Package, CheckCircle2, Timer, Wrench, Calendar, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const productionSteps = [
  {
    id: "STEP-001",
    name: "Injection Molding",
    orderId: "ORD-2025-0891",
    operators: ["Ahmed Ben Ali", "Sami Jlassi"],
    machines: ["IM-01 (KraussMaffei 120T)", "IM-02 (Engel 150T)", "IM-03 (Backup)"],
    plannedStart: new Date("2025-04-05T08:00:00"),
    plannedEnd: new Date("2025-04-05T11:00:00"),
    actualStart: new Date("2025-04-05T08:15:00"),
    actualEnd: new Date("2025-04-05T10:45:00"),
    status: "completed" as const,
  },
  {
    id: "STEP-002",
    name: "Cooling",
    orderId: "ORD-2025-0891",
    operators: ["Fatima Mansour"],
    machines: ["Cooling Tunnel A", "Cooling Tunnel B"],
    plannedStart: new Date("2025-04-05T11:00:00"),
    plannedEnd: new Date("2025-04-05T12:30:00"),
    actualStart: new Date("2025-04-05T10:50:00"),
    actualEnd: new Date("2025-04-05T11:30:00"),
    status: "completed" as const,
  },
  {
    id: "STEP-003",
    name: "Quality Control",
    orderId: "ORD-2025-0891",
    operators: ["Mohamed Trabelsi", "Amina Khelifi"],
    machines: ["QC Station 3", "Vision System B", "Manual Inspection Bench"],
    plannedStart: new Date("2025-04-05T12:30:00"),
    plannedEnd: new Date("2025-04-05T15:00:00"),
    actualStart: new Date("2025-04-05T11:35:00"),
    actualEnd: null,
    status: "in-progress" as const,
  },
  {
    id: "STEP-004",
    name: "Labeling",
    orderId: "ORD-2025-0892",
    operators: ["Amira Zaidi"],
    machines: ["Labeler Pro-500"],
    plannedStart: new Date("2025-04-06T09:00:00"),
    plannedEnd: new Date("2025-04-06T12:00:00"),
    actualStart: null,
    actualEnd: null,
    status: "pending" as const,
  },
  {
    id: "STEP-005",
    name: "Packaging",
    orderId: "ORD-2025-0892",
    operators: [],
    machines: ["Auto-Pack Line 2", "Carton Sealer X", "Pallet Wrapper Z"],
    plannedStart: new Date("2025-04-06T13:00:00"),
    plannedEnd: new Date("2025-04-06T17:00:00"),
    actualStart: null,
    actualEnd: null,
    status: "pending" as const,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="default"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
    case "in-progress":
      return <Badge variant="default"><Timer className="w-3 h-3 mr-1" />In Progress</Badge>;
    case "pending":
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const formatDateTime = (date: Date | null) => {
  if (!date) return "—";
  return format(date, "dd/MM/yyyy HH:mm");
};

export default function ProductionSteps() {
  const [selectedStep, setSelectedStep] = useState<typeof productionSteps[0] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Package className="w-10 h-10 text-primary" />
              Production Steps Monitor
            </h1>
            <p className="text-muted-foreground mt-2">
              Click "View Details" to see full schedule and assignments
            </p>
          </div>
        </div>

        {/* Compact Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Production Steps</CardTitle>
            <CardDescription>Current batch overview</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Step</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Operators</TableHead>
                  <TableHead>Machines</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionSteps.map((step) => (
                  <TableRow key={step.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{step.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{step.orderId}</Badge>
                    </TableCell>

                    {/* Operators (compact) */}
                    <TableCell>
                      {step.operators.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {step.operators.slice(0, 2).map((op) => (
                            <Badge key={op} variant="secondary" className="text-xs">
                              <User className="w-3 h-3 mr-1" />
                              {op.split(" ")[0]}
                            </Badge>
                          ))}
                          {step.operators.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{step.operators.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">None</span>
                      )}
                    </TableCell>

                    {/* Machines (compact) */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {step.machines.slice(0, 2).map((m) => (
                          <Badge key={m} variant="outline" className="text-xs">
                            {m.split(" ")[0]}
                          </Badge>
                        ))}
                        {step.machines.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{step.machines.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(step.status)}</TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedStep(step)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={!!selectedStep} onOpenChange={() => setSelectedStep(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <Package className="w-8 h-8" />
                {selectedStep?.name}
              </DialogTitle>
              <DialogDescription>
                Order: <Badge variant="outline">{selectedStep?.orderId}</Badge> • Status: {selectedStep && getStatusBadge(selectedStep.status)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground">Planned Schedule</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Start: <strong>{selectedStep && formatDateTime(selectedStep.plannedStart)}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>End: <strong>{selectedStep && formatDateTime(selectedStep.plannedEnd)}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground">Actual Progress</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Started: {selectedStep && formatDateTime(selectedStep.actualStart)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Finished: {selectedStep && formatDateTime(selectedStep.actualEnd)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4" />

              {/* Operators & Machines */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" /> Assigned Operators
                  </h4>
                  {selectedStep?.operators.length ? (
                    <div className="space-y-2">
                      {selectedStep.operators.map((op) => (
                        <div key={op} className="flex items-center gap-2 text-sm">
                          <Badge variant="secondary">{op}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No operators assigned</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Wrench className="w-5 h-5" /> Assigned Machines
                  </h4>
                  <div className="space-y-2">
                    {selectedStep?.machines.map((m) => (
                      <div key={m} className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{m}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}