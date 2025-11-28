import type { StepItem, MachineItem, OperatorItem, AlertItem } from "@/types/types";

export const batchInfo = {
  productName: "500ml Water Bottle",
  quantity: 3250,
  progress: 54,
};
export const steps: StepItem[] = [
  {
    id: "1",
    label: "Injection Molding",
    status: "completed",
    progress: 100,
    expectedStart: "2024-11-19T08:00",
    expectedEnd: "2024-11-19T09:30",
    realStart: "2024-11-19T08:05",
    realEnd: "2024-11-19T09:40",
    operators: ["Operator A", "Operator B"],
    machines: ["Machine 1"],
  },
  {
    id: "2",
    label: "Blow Molding",
    status: "completed",
    progress: 100,
    expectedStart: "2024-11-19T09:30",
    expectedEnd: "2024-11-19T11:00",
    realStart: "2024-11-19T09:25",
    realEnd: "2024-11-19T11:05",
    operators: ["Operator C"],
    machines: ["Machine 3", "Machine 4"],
  },
  {
    id: "3",
    label: "Cooling",
    status: "in_progress",
    progress: 65,
    expectedStart: "2024-11-19T11:00",
    expectedEnd: "2024-11-19T11:45",
    realStart: "2024-11-19T11:05",
    operators: [],
    machines: [],
  },
  {
    id: "4",
    label: "Assembly",
    status: "pending",
    progress: 0,
    expectedStart: "2024-11-19T12:00",
    expectedEnd: "2024-11-19T14:00",
    operators: ["Operator D"],
    machines: ["Machine 5"],
  },
  {
    id: "5",
    label: "Quality Check",
    status: "error",
    progress: 0,
    expectedStart: "2024-11-20T08:00",
    expectedEnd: "2024-11-20T10:30",
    realStart: "2024-11-20T08:10",
    realEnd: "2024-11-20T10:45",
    operators: ["Operator E"],
    machines: ["Machine 6"],
  },
];




export const machines: MachineItem[] = [
{  id: "m1",
  name: "Injection M1",
  type: "Injection Molding",
  status: "maintenance",
  efficiency: 92,
  unavailableFrom: "2025-11-28T08:00",    // date + hour
  expectedAvailable: "2025-11-30T17:00",  // date + hour
},
  {
    id: "m2",
    name: "Blowing M2",
    type: "Blow Molding",
    status: "available",
    efficiency: 89,
    unavailableFrom: "2025-11-28T08:00",    // date + hour
    expectedAvailable: "2025-11-30T17:00",  // date + hour
  },
  {
    id: "m3",
    name: "Cooling M3",
    type: "Cooling",
    status: "in_use",
    efficiency: 92,
    unavailableFrom: "2025-11-28T08:00",    // date + hour
    expectedAvailable: "2025-11-30T17:00",  // date + hour
  },
  
];


export const operators: OperatorItem[] = [
  { id: "o1", name: "Ahmed Ben Ali", availability: true, skills: ["Injection Molding", "Blow Molding"] },
  { id: "o2", name: "Fatima Mansour", availability: false, skills: ["Cooling", "Quality Control"], currentStep: "Cooling" },
];

export const alerts: AlertItem[] = [
  {
    id: "a1",
    type: "error",
    message: "Injection Molding machine stopped unexpectedly",
    step: "Injection Molding",
    timestamp: "2024-11-19T08:45:00",
  },
  {
    id: "a2",
    type: "warning",
    message: "Cooling temperature slightly elevated",
    step: "Cooling",
    timestamp: "2024-11-19T11:15:00",
  },
  {
    id: "a3",
    type: "info",
    message: "Blow Molding completed successfully",
    step: "Blow Molding",
    timestamp: "2024-11-19T11:00:00",
  },
  {
    id: "a4",
    type: "error",
    message: "Assembly operator not assigned",
    step: "Assembly",
    timestamp: "2024-11-19T12:05:00",
  },
  {
    id: "a5",
    type: "warning",
    message: "Packaging line speed lower than expected",
    step: "Packaging",
    timestamp: "2024-11-21T09:30:00",
  },
  {
    id: "a6",
    type: "info",
    message: "Shipment prep ready for loading",
    step: "Shipment Prep",
    timestamp: "2024-11-22T08:45:00",
  },
  {
    id: "a7",
    type: "error",
    message: "Quality Check failed for batch #42",
    step: "Quality Check",
    timestamp: "2024-11-20T09:20:00",
  },
  {
    id: "a8",
    type: "info",
    message: "Maintenance completed for Machine 3",
    step: "Maintenance",
    timestamp: "2024-11-18T15:10:00",
  },
];

