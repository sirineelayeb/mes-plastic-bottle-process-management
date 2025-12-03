import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface MachinesStatusChartProps {
inService: number;
stopped: number;
maintenance: number;
}

export default function MachinesStatusChart({
inService = 0,
stopped = 0,
maintenance = 0,
}: MachinesStatusChartProps) {
const total = inService + stopped + maintenance;

const data = [
{ name: "Service", value: total > 0 ? +(inService / total * 100).toFixed(1) : 0 },
{ name: "Stopped", value: total > 0 ? +(stopped / total * 100).toFixed(1) : 0 },
{ name: "Maint.", value: total > 0 ? +(maintenance / total * 100).toFixed(1) : 0 },
];

const COLORS = ["#16a34a", "#f87171", "#facc15"]; // green, red, yellow

return ( <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"> <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
Machines Status (%) </h2> <ResponsiveContainer width="100%" height={300}> <PieChart>
<Pie
data={data}
dataKey="value"
nameKey="name"
outerRadius={50}
label={({ name, value }) => `${name}: ${value}%`}
>
{data.map((entry, index) => (
<Cell key={index} fill={COLORS[index % COLORS.length]} />
))} </Pie>
<Tooltip formatter={(value: number) => `${value}%`} /> </PieChart> </ResponsiveContainer> </div>
);
}
