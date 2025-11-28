import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { OperatorItem } from "@/types/types";

interface OperatorsListProps {
  operators: OperatorItem[];
}

export default function OperatorsList({ operators }: OperatorsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {operators.map((op) => (
          <div key={op.id} className="flex justify-between items-center p-2 border rounded-lg">
            <div>
              <p className="font-medium">{op.name}</p>
              {op.skills && <p className="text-sm text-muted-foreground">{op.skills.join(", ")}</p>}
            </div>
            <span
              className={`px-2 py-1 text-sm rounded-full ${
                op.availability ? "text-green-700 bg-green-100" : "text-orange-700 bg-orange-100"
              }`}
            >
              {op.availability ? "Available" : "On Duty"}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
