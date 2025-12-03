import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Machine } from "@/types/types";

interface MachineStatusListProps {
machines: Machine[];
}

export default function MachineStatusList({ machines }: MachineStatusListProps) {
const getStatusConfig = (status: Machine["status"]) => {
switch (status) {
case "en_service":
return { label: "In Service", color: "text-green-700", bg: "bg-green-100" };
case "en_arret":
return { label: "Stopped", color: "text-red-700", bg: "bg-red-100" };
case "en_maintenance":
return { label: "Maintenance", color: "text-yellow-700", bg: "bg-yellow-100" };
default:
return { label: "Unknown", color: "text-gray-700", bg: "bg-gray-100" };
}
};

return ( <Card className="shadow-sm hover:shadow-md transition-shadow"> <CardHeader> <CardTitle>Machine Status</CardTitle> </CardHeader> <CardContent className="space-y-3">
{machines.length === 0 && ( <p className="text-center text-muted-foreground">No machines available</p>
)}


    {machines.map((machine) => {
      const status = getStatusConfig(machine.status);
      return (
        <div
          key={machine._id}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg hover:bg-grey-10 transition-colors"
        >
          <div className="flex flex-col">
            <p className="font-medium text-sm">{machine.name}</p>
            {machine.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{machine.description}</p>
            )}
          </div>
          <span className={`mt-2 sm:mt-0 px-2 py-1 text-xs font-medium rounded-full ${status.color} ${status.bg}`}>
            {status.label}
          </span>
        </div>
      );
    })}
  </CardContent>
</Card>


);
}
