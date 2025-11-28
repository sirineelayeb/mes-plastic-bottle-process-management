import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { StepItem } from "@/types/types";
import type { TooltipContentProps } from "recharts";

interface ProductionTimelineProps {
  steps: StepItem[];
}

// Helper: convert ISO string to timestamp
const getTimestamp = (isoString: string) => new Date(isoString).getTime();

// Format timestamp to "DD MMM HH:MM"
const formatDateTime = (ts: number | undefined | null) => {
  if (!ts) return "—";
  const d = new Date(ts);
  return `${d.getDate().toString().padStart(2,"0")} ${d.toLocaleString("default", { month: "short" })} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
};

export default function ProductionTimeline({ steps }: ProductionTimelineProps) {
  if (!steps.length) return null;

  // Find earliest start for X-axis reference
  const minStart = Math.min(
    ...steps
      .map((s) => s.expectedStart && getTimestamp(s.expectedStart))
      .filter(Boolean) as number[]
  );

  // Prepare chart data
  const chartData = steps.map((step) => {
    const expectedStart = step.expectedStart ? getTimestamp(step.expectedStart) : minStart;
    const expectedEnd = step.expectedEnd ? getTimestamp(step.expectedEnd) : expectedStart;
    const realStart = step.realStart ? getTimestamp(step.realStart) : expectedStart;
    const realEnd = step.realEnd ? getTimestamp(step.realEnd) : expectedEnd;

    const expectedDurationMin = Math.round((expectedEnd - expectedStart) / 60000);
    const realDurationMin = step.realEnd
      ? Math.round((realEnd - realStart) / 60000)
      : null;

    return {
      name: step.label,
      expectedOffset: expectedStart - minStart,
      expectedDuration: expectedEnd - expectedStart,
      realOffset: realStart - minStart,
      realDuration: realEnd - realStart,
      status: step.status,
      expectedStartStr: expectedStart,
      expectedEndStr: expectedEnd,
      realStartStr: realStart,
      realEndStr: step.realEnd ? realEnd : null,
      expectedDurationMin,
      realDurationMin,
    };
  });

  // Colors that work on light/dark backgrounds
  const statusColors: Record<StepItem["status"], string> = {
    completed: "#22c55e",   // green
    in_progress: "#3b82f6", // blue
    pending: "#9ca3af",     // gray
    error: "#f87171",       // red
  };
  const expectedColor = "#94a3b8"; // muted gray for expected bars

  // Tooltip renderer
  const renderTooltip = (props: TooltipContentProps<number, string>) => {
    const { active, payload } = props;
    if (!active || !payload || !payload.length) return null;

    const data = payload[0]?.payload;
    if (!data) return null;

    return (
      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded shadow text-sm">
        <strong>{data.name}</strong>
        <div className="mt-1">
          <div>
            <strong>Expected:</strong> {formatDateTime(data.expectedStartStr)} → {formatDateTime(data.expectedEndStr)} ({data.expectedDurationMin} min)
          </div>
          <div>
            <strong>Real:</strong> {formatDateTime(data.realStartStr)} → {formatDateTime(data.realEndStr)} 
            {data.realDurationMin !== null ? ` (${data.realDurationMin} min)` : ""}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Production Timeline
      </h2>

      <ResponsiveContainer width="100%" height={steps.length * 50}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 20, left: 120, bottom: 20 }}
        >
          {/* X-axis: show full date + hour */}
          <XAxis
            type="number"
            domain={[
              0,
              Math.max(
                ...chartData.map((d) =>
                  Math.max(d.expectedOffset + d.expectedDuration, d.realOffset + d.realDuration)
                )
              ),
            ]}
            tickFormatter={(msOffset) => formatDateTime(msOffset + minStart)}
            stroke="currentColor"
          />

          {/* Y-axis */}
          <YAxis type="category" dataKey="name" width={150} stroke="currentColor" />

          {/* Tooltip */}
          <Tooltip content={renderTooltip} />

          {/* Expected bars */}
          <Bar dataKey="expectedOffset" stackId="expected" fill="transparent" />
          <Bar
            dataKey="expectedDuration"
            stackId="expected"
            fill={expectedColor}
            barSize={20}
            radius={3}
          />

          {/* Real bars */}
          <Bar dataKey="realOffset" stackId="real" fill="transparent" />
          <Bar dataKey="realDuration" stackId="real" barSize={20} radius={3}>
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={statusColors[entry.status]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
