import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface TasksStatusChartProps {
  inProgress: number;
  completed: number;
  pending: number;
}

export default function TasksStatusChart({ inProgress = 0, completed = 0, pending = 0 }: TasksStatusChartProps) {
  const total = inProgress + completed + pending;

  // Calculate percentages as numbers
const data = [
  { name: "Progress", value: total > 0 ? +(inProgress / total * 100).toFixed(1) : 0 },
  { name: "Done", value: total > 0 ? +(completed / total * 100).toFixed(1) : 0 },
  { name: "Pending", value: total > 0 ? +(pending / total * 100).toFixed(1) : 0 },
];


  const COLORS = ["#3b82f6", "#16a34a", "#facc15"]; // blue, green, yellow

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Tasks Status (%)
      </h2>
     <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      outerRadius={45} 
      label={({ name, value }) => `${name}: ${value}%`}
    >
      {data.map((entry, index) => (
        <Cell key={index} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip formatter={(value: number) => `${value}%`} />
  </PieChart>
</ResponsiveContainer>

    </div>
  );
}
