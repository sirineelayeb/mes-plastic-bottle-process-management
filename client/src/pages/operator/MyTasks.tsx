import { useState } from "react";
import AllStepsList from "@/components/operator/AllStepsList";
import useFetch from "@/hooks/useFetchData";
import type { OperatorStep } from "@/types/types";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Clipboard } from "lucide-react";
import { axiosPrivate } from "@/api/axios";

function MyTasks() {
const { user } = useAuthContext();
const operatorId = user?._id;

const [statusFilter, setStatusFilter] = useState<string>("all");
const [machineFilter, setMachineFilter] = useState<string>("");

// Build query string for filtered API
const queryParams = new URLSearchParams();
if (statusFilter !== "all") queryParams.append("status", statusFilter);
if (machineFilter) queryParams.append("machineName", machineFilter);

const { data, loading, error, refetch } = useFetch<{ tasks: OperatorStep[] }>(
operatorId
? `/process/tasks/operator/${operatorId}/filtered?${queryParams.toString()}`
: "",
{ dependencies: [operatorId, statusFilter, machineFilter] }
);

const handleStatusChange = async (taskId: string, newStatus: string) => {
try {
await axiosPrivate.patch(`/process/tasks/${taskId}/task-status`, { status: newStatus });
refetch(); // Refresh tasks after status update
} catch (err) {
console.error("Error updating task status:", err);
}
};

return ( <div className="max-w-7xl mx-auto px-6 py-8 space-y-6"> <h1 className="text-3xl font-bold mb-5 flex items-center gap-2"> <Clipboard className="w-6 h-6 text-gray-700" />
My Assigned Tasks </h1>


  {/* Filters */}
  <div className="flex flex-wrap gap-4 mb-4">
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border rounded px-3 py-1 bg-white text-black"
    >
      <option value="all">All Statuses</option>
      <option value="pending">Pending</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Completed</option>
      <option value="paused">Paused</option>
    </select>

    <input
      type="text"
      placeholder="Filter by machine"
      value={machineFilter}
      onChange={(e) => setMachineFilter(e.target.value)}
      className="border rounded px-3 py-1 bg-white text-black"
    />
  </div>

  {/* Loading / Error / Tasks */}
  {loading && <p>Loading tasks...</p>}
  {error && <p className="text-red-500">{error}</p>}
  {data && data.tasks.length > 0 ? (
    <AllStepsList steps={data.tasks} onStatusChange={handleStatusChange} />
  ) : (
    <p>No tasks found for the selected filters.</p>
  )}
</div>


);
}

export default MyTasks;
