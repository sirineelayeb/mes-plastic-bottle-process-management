import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface OperatorsChartProps {
  assigned: number;
  unassigned: number;
}

export default function OperatorsChart({ assigned, unassigned }: OperatorsChartProps) {
  const data = [
    { name: "Assigned", value: assigned },
    { name: "Unassigned", value: unassigned },
  ];

  const COLORS = ["#3b82f6", "#f87171"]; // blue for assigned, red for unassigned

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Operators Status
      </h2>
     <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={50}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
