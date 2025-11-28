import type { AlertItem } from "@/types/types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, TriangleAlert } from "lucide-react";

interface AlertsListProps {
  alerts: AlertItem[];
}

const getAlertStyle = (type: AlertItem["type"]) => {
  switch (type) {
    case "error":
      return {
        container: "border-red-300 bg-red-100",
        title: "text-red-800",
        desc: "text-red-700",
        icon: <AlertCircle className="h-4 w-4 text-red-700" />,
      };
    case "warning":
      return {
        container: "border-yellow-300 bg-yellow-100",
        title: "text-yellow-800",
        desc: "text-yellow-700",
        icon: <TriangleAlert className="h-4 w-4 text-yellow-700" />,
      };
    case "info":
    default:
      return {
        container: "border-blue-300 bg-blue-100",
        title: "text-blue-800",
        desc: "text-blue-700",
        icon: <Info className="h-4 w-4 text-blue-700" />,
      };
  }
};

export default function AlertsList({ alerts }: AlertsListProps) {
  return (
    <div className="space-y-2">
      {alerts.map((alert) => {
        const style = getAlertStyle(alert.type);

        return (
          <Alert
            key={alert.id}
            className={`flex items-start gap-3 ${style.container}`}
          >
            {style.icon}

            <div className="flex-1">
              <AlertTitle className={`${style.title} uppercase font-semibold`}>
                {alert.type}
              </AlertTitle>

              <AlertDescription className={style.desc}>
                {alert.message}

                <p className="text-xs mt-1 text-gray-600">
                  Step: {alert.step} •{" "}
                  {new Date(alert.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </AlertDescription>
            </div>
          </Alert>
        );
      })}
    </div>
  );
}
