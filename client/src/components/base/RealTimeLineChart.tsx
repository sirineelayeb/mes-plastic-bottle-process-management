
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MachineLineChartProps {
  data: Array<any>;
  title?: string;
  description?: string;
  dataKey: string;
  min?: number; // Y-axis min
  max?: number; // Y-axis max
  color?: string; // Line color
}

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function MachineLineChart({
  data,
  title = "Machine Metric",
  description = "Live operational performance",
  dataKey,
  min,
  max,
  color = "var(--chart-1)",
}: MachineLineChartProps) {
  return (
    <Card className="shadow-lg border rounded-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-48">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 10,
              left: 10,
              right: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={false} opacity={0.2} />

            {/* Y-axis with dynamic range */}
            <YAxis
              domain={[min ?? "auto", max ?? "auto"]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />

            {/* X-axis with clean timestamp formatting */}
            {/* <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tickFormatter={(value) =>
                new Date(value).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              }
            /> */}

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Line
              dataKey={dataKey}
              type="natural"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

     
    </Card>
  );
}
