import type { OperatorStep } from "@/types/types";
import { Card ,CardHeader,CardTitle,CardContent} from "../ui/card";
import { Clock } from "lucide-react";

interface AllStepsListProps {
  steps: OperatorStep[];
}

function AllStepsList({ steps }: AllStepsListProps) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-600" />
        My Assigned Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`rounded-lg p-4 border-2 transition-all ${
              step.status === 'in_progress' 
                ? ' ' 
                : '  hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  step.status === 'in_progress' ? 'bg-blue-600' : 'bg-gray-400'
                }`}>
                  {step.id}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{step.label}</h4>
                  <p className="text-sm text-white-600">{step.product}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                step.status === 'in_progress' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-400 text-white'
              }`}>
                {step.status === 'in_progress' ? 'In Progress' : 'Pending'}
              </span>
            </div>
            
            {step.startTime && step.estimatedEnd && (
              <div className="flex items-center justify-between text-sm text-white-600 mt-3">
                <span>Start: {step.startTime}</span>
                <span>Est. End: {step.estimatedEnd}</span>
              </div>
            )}
            
            {step.progress !== undefined && step.progress > 0 && (
              <div className="mt-3">
                <div className="w-full bg-gray-400 rounded-full h-2 ">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all" 
                    style={{ width: `${step.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export default AllStepsList;