import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProductionPieChartProps {
  completed: number;
  remaining: number;
}

export default function ProductionPieChart({
  completed,
  remaining,
}: ProductionPieChartProps) {
  const total = completed + remaining;

  const completedPercent =
    total > 0 ? Math.round((completed / total) * 100) : 0;
  const remainingPercent = 100 - completedPercent;

  const data = [
    { name: "Completed", value: completed },
    { name: "Remaining", value: remaining },
  ];

  // Soft default colors (can be overridden by theme)
  const COLORS = ["#4ade80", "#d1d5db"]; // green-300 / gray-300

  // Center label inside pie
  const renderCenterLabel = ({ cx, cy }: PieLabelRenderProps) => (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="middle"
      className="font-semibold text-muted-foreground text-lg"
    >
      {completedPercent}%
    </text>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Progress</CardTitle>
      </CardHeader>

      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              label={renderCenterLabel}
              isAnimationActive
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: number) => `${value} steps`}
              contentStyle={{ borderRadius: "8px" }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Custom Legend */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span>Completed: {completedPercent}%</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-300" />
            <span>Remaining: {remainingPercent}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
