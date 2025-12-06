import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { OperatorStep } from "@/types/types";
import { Calendar, Clock, Play, StopCircle, Cpu, User, FileText } from "lucide-react";

interface AllStepsListProps {
steps: OperatorStep[];
onStatusChange: (taskId: string, newStatus: string) => void;
}

function AllStepsList({ steps, onStatusChange }: AllStepsListProps) {
const [selectedTask, setSelectedTask] = useState<OperatorStep | null>(null);

return (
<> <div className="space-y-4">
{steps.map((step) => (
<Card
key={`${step.taskId}-${step.processId}`}
className={`border cursor-pointer ${step.status === 'in_progress' ? 'border-primary' : 'border-border'}`}
onClick={() => setSelectedTask(step)}
> <CardHeader className="flex justify-between items-center"> <CardTitle>
{step.taskName} - <span className="text-sm text-muted-foreground">{step.processName}</span> </CardTitle>
<span
className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  step.status === 'in_progress' ? 'bg-primary text-primary-foreground' :
                  step.status === 'done' ? 'bg-green-200 text-green-800' :
                  step.status === 'paused' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-muted text-muted-foreground'
                }`}
>
{step.status.replace('_', ' ').toUpperCase()} </span> </CardHeader>


        <CardContent className="flex justify-end gap-2">
          {step.status !== 'done' && (
            <>
              {step.status === 'pending' && (
                <Button size="sm" onClick={(e) => { e.stopPropagation(); onStatusChange(step.taskId, 'in_progress'); }}>
                  Start
                </Button>
              )}
              {step.status === 'paused' && (
                <Button size="sm" onClick={(e) => { e.stopPropagation(); onStatusChange(step.taskId, 'in_progress'); }}>
                  Resume
                </Button>
              )}
              {step.status === 'in_progress' && (
                <>
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onStatusChange(step.taskId, 'paused'); }}>
                    Pause
                  </Button>
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); onStatusChange(step.taskId, 'done'); }}>
                    Complete
                  </Button>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    ))}
  </div>

  {/* Task Details Modal */}
  {selectedTask && (
    <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedTask.taskName}</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-2 text-sm text-gray-700">
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" /> <strong>Process:</strong> {selectedTask.processName}
          </p>
          <p className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" /> <strong>Description:</strong> {selectedTask.taskDescription || "No description"}
          </p>
          <p className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-gray-500" /> <strong>Machine:</strong> {selectedTask.machine.name} ({selectedTask.machine.status})
          </p>
          <p className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" /> <strong>Skills Required:</strong> {selectedTask.skills.map(s => s.name).join(', ')}
          </p>
          <p className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" /> <strong>Operator:</strong> {selectedTask.operator.name}
          </p>

          {selectedTask.duration && (
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" /> <strong>Planned Duration:</strong> {selectedTask.duration} min
            </p>
          )}
          {selectedTask.startTime && (
            <p className="flex items-center gap-2">
              <Play className="w-4 h-4 text-gray-500" /> <strong>Start:</strong> {new Date(selectedTask.startTime).toLocaleString()}
            </p>
          )}
          {selectedTask.endTime && (
            <p className="flex items-center gap-2">
              <StopCircle className="w-4 h-4 text-gray-500" /> <strong>End:</strong> {new Date(selectedTask.endTime).toLocaleString()}
            </p>
          )}
          {selectedTask.plannedDate && (
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" /> <strong>Planned Date:</strong> {new Date(selectedTask.plannedDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => setSelectedTask(null)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )}
</>


);
}

export default AllStepsList;
