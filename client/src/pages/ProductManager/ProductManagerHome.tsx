import { useEffect, useState } from "react";
import OperatorsChart from "@/components/productmanager/OperatorsChart";
import TasksStatusChart from "@/components/productmanager/TasksStatusChart";
import MachinesStatusChart from "@/components/productmanager/MachinesStatusChart";
import ProductionSteps from "@/components/productmanager/ProductionSteps";
import ProductionTimeline from "@/components/productmanager/ProductionTimeline";
import OperatorsList from "@/components/productmanager/OperatorsList";
<<<<<<< HEAD
import AlertsList from "@/components/productmanager/AlertsList";
import ProductionPieChart from "@/components/productmanager/ProductionPieChart";
import ProductionTimeline from "@/components/productmanager/ProductionTimeline"; // New component

import { batchInfo, steps, machines, operators, alerts } from "@/components/productmanager/mockData";
import useFetch from "@/hooks/useFetchData";
=======
import MachineStatusList from "@/components/productmanager/MachineStatusList";
import { axiosPublic } from "@/api/axios";
import type { Task, Operator, Machine } from "@/types/types";
>>>>>>> cf6c6ca96781f09cf40d2c768a6c8b7eb0338688

export default function ProductManagerHome() {
const [tasks, setTasks] = useState<Task[]>([]);
const [operators, setOperators] = useState<Operator[]>([]);
const [machines, setMachines] = useState<Machine[]>([]);

// Fetch tasks
useEffect(() => {
const fetchTasks = async () => {
try {
const res = await axiosPublic.get("/tasks");
setTasks(res.data.tasks);
} catch (error) {
console.error("Failed to load tasks:", error);
}
};
fetchTasks();
}, []);

// Fetch operators
useEffect(() => {
const fetchOperators = async () => {
try {
const res = await axiosPublic.get("/auth/users");
setOperators(res.data.operators);
} catch (error) {
console.error("Failed to load operators:", error);
}
};
fetchOperators();
}, []);

// Fetch machines
useEffect(() => {
const fetchMachines = async () => {
try {
const res = await axiosPublic.get("/machines");
setMachines(res.data.machines);
} catch (error) {
console.error("Failed to load machines:", error);
}
};
fetchMachines();
}, []);

// Compute operator assignment counts
const assignedOperatorIds = new Set(tasks.flatMap(t => t.operators.map(op => op._id)));
const operatorsAssigned = operators.filter(op => assignedOperatorIds.has(op._id)).length;
const operatorsUnassigned = operators.length - operatorsAssigned;

// Compute task status counts
const tasksInProgress = tasks.filter(t => t.status === "In Progress").length;
const tasksCompleted = tasks.filter(t => t.status === "Completed").length;
const tasksPending = tasks.filter(t => t.status === "Pending").length;

// Compute machine status counts
const machinesInService = machines.filter(m => m.status === "en_service").length;
const machinesStopped = machines.filter(m => m.status === "en_arret").length;
const machinesMaintenance = machines.filter(m => m.status === "en_maintenance").length;

return ( <div className="p-6 space-y-8"> <h1 className="text-2xl font-bold mb-4">Production Dashboard</h1>


  {/* -------------------- Charts -------------------- */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <OperatorsChart assigned={operatorsAssigned} unassigned={operatorsUnassigned} />
    <TasksStatusChart
      inProgress={tasksInProgress}
      completed={tasksCompleted}
      pending={tasksPending}
    />
    <MachinesStatusChart
      inService={machinesInService}
      stopped={machinesStopped}
      maintenance={machinesMaintenance}
    />
  </div>

  {/* -------------------- Production Tasks -------------------- */}
  <div className="grid grid-cols-1 gap-6">
    <ProductionSteps tasks={tasks} />
  </div>

  {/* -------------------- Production Timeline -------------------- */}
  <div className="grid grid-cols-1 gap-6">
    <ProductionTimeline tasks={tasks} />
  </div>

  {/* -------------------- Operators & Machines -------------------- */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <OperatorsList operators={operators} />
    <MachineStatusList machines={machines} />
  </div>
</div>


);
}
