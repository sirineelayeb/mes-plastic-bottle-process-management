import type { OperatorStep } from "@/types/types";
import { Activity, AlertTriangle, Calendar, CheckSquare, Clock, FileText, Package, Pause, Settings} from "lucide-react";
import { Card, CardContent, CardHeader ,CardTitle} from "../ui/card";

interface CurrentStepCardProps {
  step: OperatorStep;
}

function CurrentStepCard({ step }: CurrentStepCardProps) {
  return (
    <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              {step.id}
            </div>
            <div>
              <CardTitle className="text-xl">{step.label}</CardTitle>
              <p className="text-gray-600 text-sm mt-1">{step.product}</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold text-sm">
            <Activity className="w-4 h-4" />
               In Progress
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {step.machine && (
          <div className=" rounded-lg p-4 border">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-white-700 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-white-900 mb-2">Assigned Machine</h3>
                <p className="text-white-900 font-medium text-lg">{step.machine.name}</p>
                <p className="text-sm text-white-600 mt-1">
                 Temperature: {step.machine.temperature} • Pressure: {step.machine.pressure}
                </p>
              </div>
            </div>
          </div>
        )}

        {step.materials && step.materials.length > 0 && (
          <div className=" rounded-lg p-4 border">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-white-700 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-wh-900 mb-2">Required Materials</h3>
                <ul className="space-y-1.5">
                  {step.materials.map((mat, idx) => (
                    <li key={idx} className="text-white-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      <span className="font-medium">{mat.name}:</span> {mat.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {step.instructions && (
          <div className=" border  rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-yellow-700 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-white-900 mb-1.5">Instructions</h3>
                <p className="text-sm text-white-800 leading-relaxed">{step.instructions}</p>
              </div>
            </div>
          </div>
        )}

        {step.timeElapsed !== undefined && step.estimatedDuration !== undefined && (
          <div className="pt-2">
            <div className="flex justify-between text-sm text-white-600 mb-3 font-medium">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
               Time Elapsed: {step.timeElapsed} min
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Estimated Duration: {step.estimatedDuration} min
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-500" 
                style={{ width: `${step.progress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-white-600 mt-2 font-semibold">{step.progress}% Complete</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 pt-2">
          <button className="bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-semibold flex items-center justify-center gap-2 shadow-sm transition-all">
            <Pause className="w-5 h-5" />
            Pause
          </button>
          <button className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2 shadow-sm transition-all">
            <CheckSquare className="w-5 h-5" />
             Complete
          </button>
          <button className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold flex items-center justify-center gap-2 shadow-sm transition-all">
            <AlertTriangle className="w-5 h-5" />
            Incident
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
export default CurrentStepCard;