'use client';
import React, { useState } from 'react';
import { Cog } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';

interface Machine {
  _id: string;
  name: string;
  type: string;
  status: 'in_use' | 'available' | 'maintenance' | 'out_of_service';
  efficiency: number;
  currentStep: string | null;
  unavailableFrom?: string;
  expectedAvailable?: string;
}

// Mock data (replace with your API data)
const allMachines: Machine[] = [
  { _id: '1', name: 'Injection M1', type: 'Injection Molding', status: 'available', efficiency: 94, currentStep: null },
  { _id: '2', name: 'Blowing M2', type: 'Blow Molding', status: 'available', efficiency: 89, currentStep: null },
  { _id: '3', name: 'Cooling M3', type: 'Cooling', status: 'in_use', efficiency: 92, currentStep: 'Cooling', unavailableFrom: '2024-11-22', expectedAvailable: '2024-11-23' },
  { _id: '4', name: 'QC Station 1', type: 'Quality Control', status: 'available', efficiency: 100, currentStep: null },
  { _id: '5', name: 'Labeling M5', type: 'Labeling', status: 'maintenance', efficiency: 0, currentStep: null, unavailableFrom: '2024-11-22', expectedAvailable: '2024-11-25' },
];

export default function InMaintenanceMachines() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Filter only maintenance machines
  const maintenanceMachines = allMachines.filter(m => m.status === 'maintenance');

  const totalPages = Math.ceil(maintenanceMachines.length / itemsPerPage);
  const paginatedMachines = maintenanceMachines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-background">
      <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-6">
        <Cog className="w-8 h-8 text-primary" /> Machines Under Maintenance
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedMachines.map(machine => (
          <div key={machine._id} className="bg-card border rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{machine.name}</h2>
              <span className="px-2 py-1 rounded-lg border bg-orange-100 text-orange-700 border-orange-200">
                Maintenance
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{machine.type}</p>

            {machine.unavailableFrom && machine.expectedAvailable && (
              <p className="text-sm text-muted-foreground">
                Unavailable: {machine.unavailableFrom} | <br /> Expected Availability: {machine.expectedAvailable}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
