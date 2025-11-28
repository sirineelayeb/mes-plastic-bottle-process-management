import DashboardHeader from "@/components/productmanager/DashboardHeader";
import BatchInfoCard from "@/components/productmanager/BatchInfoCard";
import ProductionSteps from "@/components/productmanager/ProductionSteps";
import MachineStatusList from "@/components/productmanager/MachineStatusList";
import OperatorsList from "@/components/productmanager/OperatorsList";
import AlertsList from "@/components/productmanager/AlertsList";
import ProductionPieChart from "@/components/productmanager/ProductionPieChart";
import ProductionTimeline from "@/components/productmanager/ProductionTimeline"; // New component

import { batchInfo, steps, machines, operators, alerts } from "@/components/productmanager/mockData";

export default function ProductManagerHome() {
  return (
    <div className="p-6 space-y-8">

      {/* -------------------- Dashboard Header -------------------- */}
      <DashboardHeader title="Product Manager Dashboard" />

      {/* -------------------- Top Grid: Batch Info & Pie Chart -------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BatchInfoCard
          productName={batchInfo.productName}
          quantity={batchInfo.quantity}
          progress={batchInfo.progress}
        />

        <ProductionPieChart
          completed={batchInfo.progress}
          remaining={batchInfo.quantity - batchInfo.progress}
        />
      </div>

      {/* -------------------- Production Timeline -------------------- */}
      <div className="grid grid-cols-1 gap-6">
        <ProductionTimeline steps={steps} />
      </div>

      {/* -------------------- Main Dashboard Components -------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Production Steps with details */}
        <ProductionSteps steps={steps} />

        {/* Machines and Operators */}
        <div className="space-y-6">
          <MachineStatusList machines={machines} />
          <OperatorsList operators={operators} />
        </div>
      </div>

      {/* -------------------- Alerts -------------------- */}
      <div className="grid grid-cols-1 gap-6">
        <AlertsList alerts={alerts} />
      </div>

    </div>
  );
}
