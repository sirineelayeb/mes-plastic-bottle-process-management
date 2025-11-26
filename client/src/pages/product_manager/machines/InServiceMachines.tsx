'use client';
import React, { useState } from 'react';
import { Cog, Activity } from 'lucide-react';
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationItem,
  PaginationLink,
  PaginationContent,
  PaginationEllipsis,
} from '@/components/ui/pagination';

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

export default function InServiceMachines() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const inServiceMachines = allMachines.filter(
    (m) => m.status === 'available' || m.status === 'in_use'
  );

  const totalPages = Math.ceil(inServiceMachines.length / itemsPerPage);
  const paginatedMachines = inServiceMachines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-background">
      <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-6">
        <Activity className="w-8 h-8 text-primary" /> Machines In Service
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedMachines.map((machine) => (
          <div key={machine._id} className="bg-card border rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{machine.name}</h2>
              <span
                className={`px-2 py-1 rounded-lg border ${
                  machine.status === 'in_use'
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-green-100 text-green-700 border-green-200'
                }`}
              >
                {machine.status === 'in_use' ? 'In Use' : 'Available'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{machine.type}</p>

            {machine.currentStep && <p className="text-sm">Working on: {machine.currentStep}</p>}

            {machine.unavailableFrom && machine.expectedAvailable && (
              <p className="text-sm text-muted-foreground">
                Unavailable: {machine.unavailableFrom} | Expected: {machine.expectedAvailable}
              </p>
            )}

            {machine.status === 'in_use' && (
              <div className="mt-2">
                <p className="text-sm">Efficiency: {machine.efficiency}%</p>
                <div className="w-full bg-secondary h-1.5 rounded-full">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${machine.efficiency}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination aria-label="Pagination Navigation">
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
}
