import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface NavigationTabsProps {
  activeStepsCount: number;
}

function NavigationTabs({ activeStepsCount }: NavigationTabsProps) {
  return (
    <div className="flex gap-6 border-b border-gray-200 bg-white px-6">
      <button className="flex items-center gap-2 px-1 py-4 border-b-2 border-blue-600 text-blue-600 font-semibold">
        <Clock className="w-5 h-5" />
        Mes Étapes
        <span className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
          {activeStepsCount}
        </span>
      </button>
      <button className="flex items-center gap-2 px-1 py-4 text-gray-600 hover:text-gray-900 font-medium">
        <CheckCircle className="w-5 h-5" />
        Historique
      </button>
      <button className="flex items-center gap-2 px-1 py-4 text-gray-600 hover:text-gray-900 font-medium">
        <AlertCircle className="w-5 h-5" />
        Signaler Incident
      </button>
    </div>
  );
}
export default NavigationTabs;