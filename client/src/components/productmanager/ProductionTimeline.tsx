import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
Cell,
ResponsiveContainer,
} from "recharts";
import type { Task } from "@/types/types";
import type { TooltipContentProps } from "recharts";

interface ProductionTimelineProps {
tasks: Task[];
}

// Helper: convert ISO string to timestamp
const getTimestamp = (isoString: string) => new Date(isoString).getTime();

// Format timestamp to "DD MMM HH:MM"
const formatDateTime = (ts: number | undefined | null) => {
if (!ts) return "—";
const d = new Date(ts);
return `${d.getDate().toString().padStart(2,"0")} ${d.toLocaleString("default", { month: "short" })} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
};

export default function ProductionTimeline({ tasks }: ProductionTimelineProps) {
if (!tasks.length) return null;

// Find earliest start for X-axis reference
const minStart = Math.min(
...tasks
.map((t) => t.dateStart && getTimestamp(t.dateStart))
.filter(Boolean) as number[]
);

// Prepare chart data
const chartData = tasks.map((task) => {
const start = task.dateStart ? getTimestamp(task.dateStart) : minStart;
const end = task.dateEnd ? getTimestamp(task.dateEnd) : start;
const durationMin = Math.round((end - start) / 60000);


return {
  name: task.taskName,
  offset: start - minStart,
  duration: end - start,
  status: "in_progress", // default or derive if you have a status
  startStr: start,
  endStr: end,
  durationMin,
  operators: task.operators,
  machine: task.machine,
};


});

const statusColors: Record<string, string> = {
completed: "#22c55e",
in_progress: "#3b82f6",
pending: "#9ca3af",
error: "#f87171",
};

const renderTooltip = (props: TooltipContentProps<number, string>) => {
const { active, payload } = props;
if (!active || !payload || !payload.length) return null;


const data = payload[0]?.payload as any;
if (!data) return null;

const operatorNames = data.operators?.map((op: any) => op.name).join(", ") || "—";
const machineName = data.machine?.name || "—";

return (
  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded shadow text-sm">
    <strong>{data.name}</strong>
    <div className="mt-1 text-xs">
      <div>
        <strong>Duration:</strong> {formatDateTime(data.startStr)} → {formatDateTime(data.endStr)} ({data.durationMin} min)
      </div>
      <div><strong>Operators:</strong> {operatorNames}</div>
      <div><strong>Machine:</strong> {machineName}</div>
    </div>
  </div>
);


};

return ( <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4"> <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
Production Timeline </h2>


  <ResponsiveContainer width="100%" height={tasks.length * 50}>
    <BarChart
      layout="vertical"
      data={chartData}
      margin={{ top: 20, right: 20, left: 120, bottom: 20 }}
    >
      <XAxis
        type="number"
        domain={[
          0,
          Math.max(...chartData.map((d) => d.offset + d.duration)),
        ]}
        tickFormatter={(msOffset) => formatDateTime(msOffset + minStart)}
        stroke="currentColor"
      />
      <YAxis type="category" dataKey="name" width={150} stroke="currentColor" />
      <Tooltip content={renderTooltip} />
      <Bar dataKey="offset" stackId="task" fill="transparent" />
      <Bar dataKey="duration" stackId="task" barSize={20} radius={3}>
        {chartData.map((entry, idx) => (
          <Cell key={idx} fill={statusColors[entry.status]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>


);
}
