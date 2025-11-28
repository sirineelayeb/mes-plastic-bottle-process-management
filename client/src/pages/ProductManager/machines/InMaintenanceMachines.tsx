'use client';

import { useState } from 'react';
import { Cog } from 'lucide-react';
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import { machines as allMachines } from '@/components/productmanager/mockData';
import type { MachineItem } from '@/types/types';

const ITEMS_PER_PAGE = 4; // 4 machines per page

export default function InMaintenanceMachines() {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter only machines under maintenance
  const maintenanceMachines = allMachines.filter((m) => m.status === 'maintenance');

  const totalPages = Math.ceil(maintenanceMachines.length / ITEMS_PER_PAGE);

  const paginatedMachines = maintenanceMachines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-background">
      <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-6">
        <Cog className="w-8 h-8 text-primary" /> Machines Under Maintenance
      </h1>

      {paginatedMachines.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No machines in maintenance.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {paginatedMachines.map((machine: MachineItem) => (
            <div
              key={machine.id}
              className="bg-card border rounded-lg p-4 flex flex-col gap-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{machine.name}</h2>
                <span className="px-2 py-1 rounded-lg border bg-orange-100 text-orange-700 border-orange-200">
                  Maintenance
                </span>
              </div>

              <p className="text-sm text-muted-foreground">{machine.type || '-'}</p>

              {machine.unavailableFrom && machine.expectedAvailable ? (
                <p className="text-sm text-muted-foreground">
                  Unavailable: <span className="font-medium">{machine.unavailableFrom}</span>
                  <br />
                  Expected Availability:{' '}
                  <span className="font-medium">{machine.expectedAvailable}</span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">No schedule info</p>
              )}

              {machine.efficiency !== undefined && (
                <p className="text-sm text-muted-foreground">
                  Efficiency: <span className="font-medium">{machine.efficiency}%</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    isActive={currentPage === idx + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(idx + 1);
                    }}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages && handlePageChange(currentPage + 1)
                  }
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
