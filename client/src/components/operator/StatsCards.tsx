import { CheckCircle, Calendar, CalendarDays, Cpu } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface Machine {
machineId: string;
name: string;
status: string;
}

interface StatsCardsProps {
completedToday: number;
tasksThisWeek: number;
tasksThisMonth: number;
machines?: Machine[]; // replace activeMachine with machines array
}

function StatsCards({
completedToday,
tasksThisWeek,
tasksThisMonth,
machines,
}: StatsCardsProps) {
return ( <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
{/* Completed Today */} <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow"> <CardContent className="p-4"> <div className="flex items-center justify-between"> <div> <p className="text-xs text-gray-500 mb-1">Tasks Completed Today</p> <p className="text-2xl font-bold">{completedToday}</p> </div> <CheckCircle className="w-8 h-8 text-green-500" /> </div> </CardContent> </Card>


  {/* Tasks This Week */}
  <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">Tasks This Week</p>
          <p className="text-2xl font-bold">{tasksThisWeek}</p>
        </div>
        <Calendar className="w-8 h-8 text-blue-500" />
      </div>
    </CardContent>
  </Card>

  {/* Tasks This Month */}
  <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">Tasks This Month</p>
          <p className="text-2xl font-bold">{tasksThisMonth}</p>
        </div>
        <CalendarDays className="w-8 h-8 text-purple-500" />
      </div>
    </CardContent>
  </Card>

  {/* Active Machines */}
  <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 mb-1">Active Machines</p>
          <Cpu className="w-8 h-8 text-orange-500" />
        </div>
        <div className="mt-1 text-sm text-gray-700">
          {machines && machines.length > 0 ? (
            machines.map((machine) => (
              <p key={machine.machineId}>
                {machine.name} ({machine.status})
              </p>
            ))
          ) : (
            <p>N/A</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
</div>


);
}

export default StatsCards;
