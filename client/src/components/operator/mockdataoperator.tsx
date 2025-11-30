import type { OperatorAlert, OperatorInfo, OperatorStats, OperatorStep } from "@/types/types";

 export const operatorInfo: OperatorInfo = {
  name: "Fatima Mansour",
  employeeId: "OP-2025-002",
  skills: ["Cooling", "Quality Control", "Assembly"],
  activeSkills: ["Cooling", "Quality Control"]
};

 export const currentStep: OperatorStep = {
  id: "3",
  label: "Cooling",
  product: "500ml Water Bottle - Batch #54",
  status: "in_progress",
  progress: 65,
  expectedStart: "2024-11-19T11:00",
  expectedEnd: "2024-11-19T11:45",
  realStart: "2024-11-19T11:05",
  machine: {
    name: "Cooling M3",
    temperature: "64°F",
    pressure: "36 psi"
  },
  materials: [
    { name: "Cooling Water", quantity: "200 L" },
    { name: "Cooling Agent", quantity: "5 L" }
  ],
  instructions: "Maintain temperature between 59-68°F. Check water flow every 10 minutes. Alert if temperature exceeds 72°F.",
  timeElapsed: 28,
  estimatedDuration: 45
};

export const mySteps: OperatorStep[] = [
  {
    id: "3",
    label: "Cooling",
    product: "500ml Water Bottle - Batch #54",
    status: "in_progress",
    progress: 65,
    expectedStart: "2024-11-19T11:00",
    expectedEnd: "2024-11-19T11:45",
    realStart: "2024-11-19T11:05",
    startTime: "11:05",
    estimatedEnd: "11:45"
  },
  {
    id: "5",
    label: "Quality Check",
    product: "500ml Water Bottle - Batch #54",
    status: "pending",
    progress: 0,
    expectedStart: "2024-11-20T08:00",
    expectedEnd: "2024-11-20T10:30",
    startTime: "08:00",
    estimatedEnd: "10:30"
  }
];

export const operatorAlerts: OperatorAlert[] = [
  { id: 2, type: "warning", message: "Cooling temperature slightly elevated", time: "11:15" },
  { id: 8, type: "info", message: "Maintenance completed for Machine 3", time: "15:10" }
];

export const todayStats: OperatorStats = {
  stepsCompleted: 2,
  totalSteps: 4,
  efficiency: 88,
  hoursWorked: 5.5
};