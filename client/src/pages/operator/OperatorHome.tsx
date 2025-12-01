import AlertsPanel from "@/components/operator/AlertsPanel";
import AllStepsList from "@/components/operator/AllStepsList";
import CurrentStepCard from "@/components/operator/CurrentStepCard";
import NavigationTabs from "@/components/operator/NavigationTabs";
import OperatorHeader from "@/components/operator/OperatorHeader";
import StatsCards from "@/components/operator/StatsCards ";

import { operatorInfo, currentStep, mySteps, operatorAlerts ,todayStats} from "@/components/operator/mockdataoperator";

export default function OperatorHome() {
  
  return (
    <div className="min-h-screen">
      <OperatorHeader operator={operatorInfo} />
      {/* <NavigationTabs activeStepsCount={mySteps.length} /> */}
      
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <StatsCards stats={todayStats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CurrentStepCard step={currentStep} />
          </div>
          <div className="space-y-6">
            <AlertsPanel alerts={operatorAlerts} />
          </div>
        </div>
        
        <AllStepsList steps={mySteps} />
      </div>
    </div>
  );
}
