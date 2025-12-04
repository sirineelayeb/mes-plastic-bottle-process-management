import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Calendar, User, Cpu } from "lucide-react";
import type { Task } from "@/types/types";

interface ProductionStepsProps {
  tasks: Task[];
}

export default function ProductionSteps({ tasks }: ProductionStepsProps) {
  if (!tasks.length)
    return <p className="text-center text-muted-foreground">No production tasks available</p>;

  return (
    <div className="space-y-5">
      {tasks.map((task) => (
        <Card key={task._id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold">{task.taskName}</CardTitle>

            {/* Status badge */}
            <span
              className={`px-3 py-1 text-xs rounded-full capitalize ${
                task.dateEnd
                  ? "bg-green-500 text-white"
                  : task.dateStart
                  ? "bg-blue-500 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {task.dateEnd
                ? "completed"
                : task.dateStart
                ? "in_progress"
                : "pending"}
            </span>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {/* Start Date */}
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock size={14} /> Start Date
              </p>
              <p className="font-medium text-sm mt-1">
                {task.dateStart ? new Date(task.dateStart).toLocaleString() : "-"}
              </p>
            </div>

            {/* End Date */}
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={14} /> End Date
              </p>
              <p className="font-medium text-sm mt-1">
                {task.dateEnd ? new Date(task.dateEnd).toLocaleString() : "-"}
              </p>
            </div>

            {/* Operators */}
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <User size={14} /> Operators
              </p>
              {task.operators && task.operators.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {task.operators.map((op) => (
                    <span key={op._id} className="text-xs bg-muted px-2 py-0.5 rounded-md">
                      {op.name}
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
              <p className="font-medium text-sm mt-1">{task.machine?.name || "Not assigned"}</p>
            </div>

            {/* Progress */}
            <div className="col-span-full mt-2">
              <p className="text-xs text-muted-foreground mb-2">Progress</p>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    task.dateEnd
                      ? "bg-green-500"
                      : task.dateStart
                      ? "bg-blue-500"
                      : "bg-gray-400"
                  }`}
                  style={{
                    width: task.dateEnd
                      ? "100%"
                      : task.dateStart
                      ? "50%"
                      : "0%",
                  }}
                />
              </div>
              <p className="text-xs text-right mt-1 font-medium">
                {task.dateEnd ? "100%" : task.dateStart ? "50%" : "0%"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
