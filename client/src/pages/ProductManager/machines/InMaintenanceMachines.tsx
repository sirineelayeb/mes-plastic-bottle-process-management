'use client';

import React, { useState, useEffect } from 'react';
import { Cog } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationItem, PaginationLink, PaginationContent, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { axiosPublic } from '@/api/axios';
import type { Machine } from '@/types/types';
import { toast } from 'sonner';

const statusStyles: Record<Machine["status"], string> = {
en_service: "bg-green-100 text-green-700 border-green-300 rounded-[10px]",
en_arret: "bg-red-700/20 font-bold text-red-700 rounded-[10px]",
en_maintenance: "bg-primary/20 text-primary font-bold rounded-[10px]",
};

const ITEMS_PER_PAGE = 4;

export default function InMaintenanceMachines() {
const [machines, setMachines] = useState<Machine[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [currentPage, setCurrentPage] = useState(1);

useEffect(() => {
const fetchMachines = async () => {
try {
const res = await axiosPublic.get('/machines');
setMachines(res.data.machines);
} catch (err) {
console.error(err);
setError('Failed to load machines');
toast.error('Failed to load machines');
} finally {
setLoading(false);
}
};
fetchMachines();
}, []);

if (loading) return <p>Loading machines...</p>;
if (error) return <p className="text-red-500">{error}</p>;

const maintenanceMachines = machines.filter(m => m.status === 'en_maintenance');
const totalPages = Math.ceil(maintenanceMachines.length / ITEMS_PER_PAGE);
const paginatedMachines = maintenanceMachines.slice(
(currentPage - 1) * ITEMS_PER_PAGE,
currentPage * ITEMS_PER_PAGE
);

const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleString() : '-';

return ( <div className="min-h-screen p-4 sm:p-6 bg-background">


  <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-6">
    <Cog className="w-8 h-8 text-primary" /> Machines Under Maintenance
  </h1>

  {paginatedMachines.length === 0 ? (
    <p className="text-center text-muted-foreground">No machines in maintenance.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      {paginatedMachines.map(machine => (
        <Card key={machine._id} className="p-4 flex flex-col gap-2 shadow-sm border rounded-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">{machine.name}</h2>
            <Badge className={`px-2 py-1 rounded-lg border ${statusStyles[machine.status]}`}>
              Maintenance
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{machine.description || '-'}</p>

          {machine.unavailableFrom && machine.expectedAvailable ? (
            <p className="text-sm text-muted-foreground">
              Unavailable: <span className="font-medium">{formatDate(machine.unavailableFrom)}</span>
              <br />
              Expected Availability: <span className="font-medium">{formatDate(machine.expectedAvailable)}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No schedule info</p>
          )}

          {machine.efficiency !== undefined && (
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
        </Card>
      ))}
    </div>
  )}

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="mt-6 flex justify-center">
      <Pagination>
        <PaginationPrevious
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        />
        <PaginationContent>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
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
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        />
      </Pagination>
    </div>
  )}
</div>


);
}
