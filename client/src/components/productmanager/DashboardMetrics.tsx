import type { Metric } from "../../types/types";

interface DashboardMetricsProps {
  metrics: Metric[];
}

export default function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-xl shadow ${metric.color ?? "bg-white dark:bg-gray-800"}`}
          aria-label={metric.label}
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">{metric.label}</p>
          <p className="text-2xl font-bold">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}
