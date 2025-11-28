import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Calendar, User, Cpu } from "lucide-react";
import type { StepItem } from "@/types/types";

interface ProductionStepsProps {
  steps: StepItem[];
}

export default function ProductionSteps({ steps }: ProductionStepsProps) {
  if (!steps.length)
    return <p className="text-center text-muted-foreground">No production steps available</p>;

  return (
    <div className="space-y-5">
      {steps.map((step) => (
        <Card key={step.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold">{step.label}</CardTitle>

            {/* Status badge */}
            <span
              className={`px-3 py-1 text-xs rounded-full capitalize ${
                step.status === "completed"
                  ? "bg-green-500 text-white"
                  : step.status === "in_progress"
                  ? "bg-blue-500 text-white"
                  : step.status === "pending"
                  ? "bg-gray-400 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {step.status.replace("_", " ")}
            </span>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">

            {/* Expected Start */}
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock size={14} />  Start Date
              </p>
              <p className="font-medium text-sm mt-1">
                {step.realStart ? new Date(step.realStart).toLocaleString() : "-"}
              </p>
            </div>

            {/* Expected End */}
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={14} />  End Date
              </p>
              <p className="font-medium text-sm mt-1">
                {step.realEnd ? new Date(step.realEnd).toLocaleString() : "-"}
              </p>
            </div>

            {/* Operators */}
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <User size={14} /> Operators
              </p>
              {step.operators && step.operators.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {step.operators.map((op, idx) => (
                    <span key={idx} className="text-xs bg-muted px-2 py-0.5 rounded-md">
                      {op}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-medium text-sm mt-1">Not assigned</p>
              )}
            </div>

            {/* Machines */}
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Cpu size={14} /> Machines
              </p>
              {step.machines && step.machines.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {step.machines.map((m, idx) => (
                    <span key={idx} className="text-xs bg-muted px-2 py-0.5 rounded-md">
                      {m}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-medium text-sm mt-1">Not assigned</p>
              )}
            </div>

            {/* Progress */}
            <div className="col-span-full mt-2">
              <p className="text-xs text-muted-foreground mb-2">Progress</p>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    step.status === "completed"
                      ? "bg-green-500"
                      : step.status === "in_progress"
                      ? "bg-blue-500"
                      : step.status === "pending"
                      ? "bg-gray-400"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${step.progress}%` }}
                />
              </div>
              <p className="text-xs text-right mt-1 font-medium">{step.progress}%</p>
            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  );
}
