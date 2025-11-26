import React, { useState } from 'react';
import { Users, Package, Activity, AlertCircle, BarChart3, Clock, CheckCircle, Pause, Cog, PlayCircle } from 'lucide-react';
import AlertsCard from "@/components/ui/AlertsCard";

// =================== TYPES ===================
type StepStatus = 'completed' | 'in_progress' | 'pending' | 'paused';
type MachineStatus = 'in_use' | 'available' | 'maintenance' | 'out_of_service';
type AlertType = 'warning' | 'error' | 'info';

interface ProductionStep {
  _id: string;
  name: string;
  status: StepStatus;
  progress: number;
  startTime: string | null;
  endTime: string | null;
  estimatedDuration: string;
  operator: string | null;
  machine: string | null;
}

interface Machine {
  _id: string;
  name: string;
  type: string;
  status: MachineStatus;
  efficiency: number;
  currentStep: string | null;
}

interface Operator {
  _id: string;
  name: string;
  availability: boolean;
  currentStep: string | null;
  skills: string[];
}

interface AlertItem {
  _id: string;
  type: AlertType;
  message: string;
  timestamp: string;
  step: string;
}

// =================== MOCK DATA ===================
const productionSteps: ProductionStep[] = [
  { _id: '1', name: 'Injection Molding', status: 'completed', progress: 100, startTime: '2024-11-19T08:00:00', endTime: '2024-11-19T09:30:00', estimatedDuration: '1h 30min', operator: 'Ahmed Ben Ali', machine: 'Injection M1' },
  { _id: '2', name: 'Blow Molding', status: 'completed', progress: 100, startTime: '2024-11-19T09:30:00', endTime: '2024-11-19T11:00:00', estimatedDuration: '1h 30min', operator: 'Ahmed Ben Ali', machine: 'Blowing M2' },
  { _id: '3', name: 'Cooling', status: 'in_progress', progress: 65, startTime: '2024-11-19T11:00:00', endTime: null, estimatedDuration: '45min', operator: 'Fatima Mansour', machine: 'Cooling M3' },
  { _id: '4', name: 'Quality Control', status: 'pending', progress: 0, startTime: null, endTime: null, estimatedDuration: '30min', operator: null, machine: null },
  { _id: '5', name: 'Labeling', status: 'pending', progress: 0, startTime: null, endTime: null, estimatedDuration: '20min', operator: null, machine: null },
  { _id: '6', name: 'Packaging', status: 'pending', progress: 0, startTime: null, endTime: null, estimatedDuration: '40min', operator: null, machine: null }
];

const machines: Machine[] = [
  { _id: '1', name: 'Injection M1', type: 'Injection Molding', status: 'available', efficiency: 94, currentStep: null },
  { _id: '2', name: 'Blowing M2', type: 'Blow Molding', status: 'available', efficiency: 89, currentStep: null },
  { _id: '3', name: 'Cooling M3', type: 'Cooling', status: 'in_use', efficiency: 92, currentStep: 'Cooling' },
  { _id: '4', name: 'QC Station 1', type: 'Quality Control', status: 'available', efficiency: 100, currentStep: null },
  { _id: '5', name: 'Labeling M5', type: 'Labeling', status: 'available', efficiency: 95, currentStep: null },
  { _id: '6', name: 'Packaging M6', type: 'Packaging', status: 'maintenance', efficiency: 0, currentStep: null }
];

const operators: Operator[] = [
  { _id: '1', name: 'Ahmed Ben Ali', availability: true, currentStep: null, skills: ['Injection Molding', 'Blow Molding'] },
  { _id: '2', name: 'Fatima Mansour', availability: false, currentStep: 'Cooling', skills: ['Cooling', 'Quality Control'] },
  { _id: '3', name: 'Mohamed Trabelsi', availability: true, currentStep: null, skills: ['Quality Control', 'Labeling'] },
  { _id: '4', name: 'Amira Zaidi', availability: true, currentStep: null, skills: ['Labeling', 'Packaging'] }
];

const alerts: AlertItem[] = [
  { _id: '1', type: 'warning', message: 'Cooling temperature slightly elevated', timestamp: '2024-11-19T11:15:00', step: 'Cooling' },
  { _id: '2', type: 'info', message: 'Blow Molding completed successfully', timestamp: '2024-11-19T11:00:00', step: 'Blow Molding' },
  { _id: '3', type: 'error', message: 'Packaging machine requires maintenance', timestamp: '2024-11-19T10:45:00', step: 'Packaging' }
];

const stats = {
  currentBatch: 'Batch PB-2024-001',
  productType: '500ml Water Bottle',
  targetQuantity: 5000,
  currentQuantity: 3250,
  startTime: '08:00',
  estimatedCompletion: '14:30',
  overallProgress: 54,
  stepsCompleted: 2,
  totalSteps: 6
};

// =================== COMPONENT ===================
export default function SupervisorDashboard() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  // Status Config
  const getStepStatusConfig = (status: StepStatus) => {
    switch (status) {
      case 'in_progress': return { label: 'In Progress', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Activity className="w-3 h-3" /> };
      case 'pending': return { label: 'Pending', class: 'bg-muted text-muted-foreground border-border', icon: <Clock className="w-3 h-3" /> };
      case 'completed': return { label: 'Completed', class: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="w-3 h-3" /> };
      case 'paused': return { label: 'Paused', class: 'bg-orange-100 text-orange-700 border-orange-200', icon: <Pause className="w-3 h-3" /> };
      default: return { label: status, class: 'bg-muted text-muted-foreground border-border', icon: null };
    }
  };

  const getMachineStatusConfig = (status: MachineStatus) => {
    switch (status) {
      case 'in_use': return { label: 'In Use', class: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'available': return { label: 'Available', class: 'bg-green-100 text-green-700 border-green-200' };
      case 'maintenance': return { label: 'Maintenance', class: 'bg-orange-100 text-orange-700 border-orange-200' };
      case 'out_of_service': return { label: 'Out of Service', class: 'bg-red-100 text-red-700 border-red-200' };
      default: return { label: status, class: 'bg-muted text-muted-foreground border-border' };
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            Production Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Real-time monitoring of plastic bottle production process</p>
        </div>

        {/* Current Batch Info */}
        <div className="bg-card border rounded-lg p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{stats.currentBatch}</h2>
              <p className="text-muted-foreground text-sm sm:text-base">{stats.productType}</p>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Target</p>
                <p className="text-lg sm:text-xl font-bold">{stats.targetQuantity.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Produced</p>
                <p className="text-lg sm:text-xl font-bold text-primary">{stats.currentQuantity.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Est. Completion</p>
                <p className="text-lg sm:text-xl font-bold">{stats.estimatedCompletion}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Overall Progress</span>
              <span className="text-xs sm:text-sm font-semibold">{stats.overallProgress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 sm:h-3">
              <div className="bg-primary h-2 sm:h-3 rounded-full transition-all duration-500" style={{ width: `${stats.overallProgress}%` }} />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {stats.stepsCompleted} of {stats.totalSteps} steps completed
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

          {/* Left Panel */}
          <div className="md:col-span-2 lg:col-span-2 space-y-6">

            {/* Production Steps */}
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="p-4 sm:p-6 border-b">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" /> Production Steps
                </h2>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                {productionSteps.map((step, index) => {
                  const status = getStepStatusConfig(step.status);
                  return (
                    <div
                      key={step._id}
                      onClick={() => setSelectedStep(step._id)}
                      className={`p-4 border rounded-xl cursor-pointer hover:bg-muted transition ${selectedStep === step._id ? 'bg-muted border-primary' : ''}`}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <p className="font-semibold text-sm sm:text-lg break-words">{step.name}</p>
                            <div className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg border flex items-center gap-1 ${status.class}`}>
                              {status.icon} {status.label}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm pl-2 md:pl-12">
                        <div>
                          <p className="text-muted-foreground text-xs sm:text-sm">Duration</p>
                          <p className="font-medium">{step.estimatedDuration}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs sm:text-sm">Operator</p>
                          <p className="font-medium">{step.operator || 'Not assigned'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs sm:text-sm">Machine</p>
                          <p className="font-medium">{step.machine || 'Not assigned'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs sm:text-sm">Started</p>
                          <p className="font-medium">
                            {step.startTime ? new Date(step.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '-'}
                          </p>
                        </div>
                      </div>

                      {step.status === 'in_progress' && (
                        <div className="mt-3 pl-2 md:pl-12">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs sm:text-sm text-muted-foreground">Progress</span>
                            <span className="text-xs sm:text-sm font-semibold">{step.progress}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2 sm:h-3">
                            <div className="bg-primary h-2 sm:h-3 rounded-full transition-all duration-500" style={{ width: `${step.progress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Machine Status */}
            <div className="bg-card border rounded-lg">
              <div className="p-4 sm:p-6 border-b">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <Cog className="w-5 h-5 sm:w-6 sm:h-6 text-primary" /> Machine Status
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {machines.map((machine) => {
                    const status = getMachineStatusConfig(machine.status);
                    return (
                      <div key={machine._id} className="p-3 sm:p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <div>
                            <p className="font-semibold text-sm sm:text-base">{machine.name}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{machine.type}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs sm:text-sm rounded-lg border ${status.class}`}>
                            {status.label}
                          </span>
                        </div>
                        {machine.currentStep && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Working on: {machine.currentStep}</p>
                        )}
                        {machine.status === 'in_use' && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs sm:text-sm mb-1">
                              <span className="text-muted-foreground">Efficiency</span>
                              <span className="font-semibold">{machine.efficiency}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-1.5 sm:h-2">
                              <div className="bg-primary h-1.5 sm:h-2 rounded-full" style={{ width: `${machine.efficiency}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel */}
          <div className="space-y-6">

            {/* Operators */}
            <div className="bg-card border rounded-lg">
              <div className="p-4 border-b">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" /> Operators
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {operators.map((operator) => (
                  <div key={operator._id} className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {operator.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base break-words">{operator.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">{operator.skills.join(', ')}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs sm:text-sm rounded-lg border ${operator.availability ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                            {operator.availability ? 'Available' : 'On Duty'}
                          </span>
                          {operator.currentStep && (
                            <span className="text-xs sm:text-sm text-muted-foreground">{operator.currentStep}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          {/* Alerts */}
<AlertsCard alerts={alerts} />


          </div>
        </div>

      </div>
    </div>
  );
}
