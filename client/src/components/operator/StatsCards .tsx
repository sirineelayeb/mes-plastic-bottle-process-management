import { CheckCircle, Clock, Cpu, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import type { OperatorStats } from "@/types/types";

interface StatsCardsProps {
  stats: OperatorStats;
}

function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Steps Completed</p>
              <p className="text-2xl font-bold text-white">{stats.stepsCompleted}/{stats.totalSteps}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Efficiency</p>
              <p className="text-2xl font-bold text-white">{stats.efficiency}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Hours Worked</p>
              <p className="text-2xl font-bold text-white">{stats.hoursWorked}h</p>
            </div>
            <Clock className="w-10 h-10 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Active Machine</p>
              <p className="text-2xl font-bold text-white">M3</p>
            </div>
            <Cpu className="w-10 h-10 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default StatsCards;