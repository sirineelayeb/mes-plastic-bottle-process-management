import { AlertTriangle, Info, AlertCircle } from "lucide-react";

interface AlertItemProps {
  type: "error" | "warning" | "info";
  message: string;
  step: string;
  timestamp: string;
}

export default function AlertItem({
  type,
  message,
  step,
  timestamp,
}: AlertItemProps) {
  // Color theme per alert type
  const theme = {
    error: {
      container: "bg-red-100 border-red-300 text-red-800",
      icon: <AlertCircle className="h-4 w-4" />,
    },
    warning: {
      container: "bg-yellow-100 border-yellow-300 text-yellow-800",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    info: {
      container: "bg-blue-100 border-blue-300 text-blue-800",
      icon: <Info className="h-4 w-4" />,
    },
  };

  // Format time safely
  const timeString = (() => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid time";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  })();

  return (
    <div
      className={`p-3 rounded-xl border shadow-sm transition hover:scale-[1.01] ${theme[type].container}`}
    >
      <div className="flex gap-3 items-start">
        <div className="mt-0.5">{theme[type].icon}</div>

        <div className="flex-1">
          <p className="text-sm font-semibold capitalize">{type}</p>

          <p className="text-sm mt-1 leading-tight">{message}</p>

          <p className="text-xs text-gray-600 mt-2">
            <span className="font-medium">{step}</span> • {timeString}
          </p>
        </div>
      </div>
    </div>
  );
}
