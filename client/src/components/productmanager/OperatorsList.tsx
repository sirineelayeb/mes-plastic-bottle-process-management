import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Operator } from "@/types/types";

interface OperatorsListProps {
  operators: Operator[];
}

export default function OperatorsList({ operators }: OperatorsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {operators.length === 0 && (
          <p className="text-center text-muted-foreground">No operators available</p>
        )}

        {operators.map((op) => (
          <div
            key={op._id}
            className="flex justify-between items-center p-2 border rounded-lg"
          >
            <div>
              <p className="font-medium">{op.name}</p>
              {op.skills && op.skills.length > 0 && (
                <p className="text-sm text-muted-foreground">{op.skills.join(", ")}</p>
              )}
              <p className="text-xs text-gray-400">{op.email}</p>
            </div>

            {/* You can add availability status if you have it in your data */}
            {/* <span
              className={`px-2 py-1 text-sm rounded-full ${
                op.availability ? "text-green-700 bg-green-100" : "text-orange-700 bg-orange-100"
              }`}
            >
              {op.availability ? "Available" : "On Duty"}
            </span> */}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
