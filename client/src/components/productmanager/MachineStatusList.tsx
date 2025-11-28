import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getMachineStatusConfig } from "./utils/statusConfig";
import type { MachineItem } from "@/types/types";

interface MachineStatusListProps {
  machines: MachineItem[];
}

export default function MachineStatusList({ machines }: MachineStatusListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Machine Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {machines.map((machine) => {
          const status = getMachineStatusConfig(machine.status);
          return (
            <div key={machine.id} className="flex justify-between items-center p-2 border rounded-lg">
              <div>
                <p className="font-medium">{machine.name}</p>
                {machine.type && <p className="text-sm text-muted-foreground">{machine.type}</p>}
              </div>
              <span className={`px-2 py-1 text-sm rounded-full ${status.color} ${status.bg}`}>
                {status.label}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
