import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, CheckCircle } from "lucide-react";
import type { OperatorStep } from "@/types/types";

interface CurrentStepCardProps {
  currentStep?: OperatorStep;
  onStart: () => void;
  onPause: () => void;
  onComplete: () => void;
}

export default function CurrentStepCard({
  currentStep,
  onStart,
  onPause,
  onComplete,
}: CurrentStepCardProps) {
  if (!currentStep) {
    return (
      <Card className="w-full shadow-sm border rounded-lg p-4 ">
        <p className="text-sm text-center ">No current step assigned.</p>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm border rounded-lg ">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center ">
          {currentStep.taskName}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Process */}
        <div className="text-center">
          <p className="font-medium ">Process</p>
          <p className="text-sm ">{currentStep.processName}</p>
        </div>

        {/* Machine */}
        <div className="text-center">
          <p className="font-medium ">Machine</p>
          <p className="text-sm ">{currentStep.machine?.name}</p>
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="font-medium ">Step Status</p>
          <p className="text-sm  capitalize">
            {currentStep.status.replace("_", " ")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={onStart}
            variant="default"
            className="flex items-center gap-2 bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            <Play size={16} />
            Start
          </Button>

          <Button
            onClick={onPause}
            variant="default"
            className="flex items-center gap-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          >
            <Pause size={16} />
            Pause
          </Button>

          <Button
            onClick={onComplete}
            variant="default"
            className="flex items-center gap-2 bg-green-100 text-green-800 hover:bg-green-200"
          >
            <CheckCircle size={16} />
            Done
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
