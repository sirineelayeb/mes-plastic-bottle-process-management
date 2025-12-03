'use client';

import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink } from '@/components/ui/pagination';
import { axiosPublic } from '@/api/axios';
import { toast, Toaster } from 'react-hot-toast';
import type { Machine } from '@/types/types';

const statusStyles: Record<Machine['status'], string> = {
en_service: 'bg-green-100 text-green-700 border-green-300',
en_arret: 'bg-red-100 text-red-700 border-red-300',
en_maintenance: 'bg-yellow-100 text-yellow-700 border-yellow-300',
};

export default function InServiceMachines() {
const [machines, setMachines] = useState<Machine[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 3;

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

const inServiceMachines = machines.filter(m => m.status === 'en_service');
const totalPages = Math.ceil(inServiceMachines.length / ITEMS_PER_PAGE);
const paginatedMachines = inServiceMachines.slice(
(currentPage - 1) * ITEMS_PER_PAGE,
currentPage * ITEMS_PER_PAGE
);

return ( <div className="min-h-screen p-4 sm:p-6 bg-background"> <Toaster position="top-right" reverseOrder={false} />

 
  <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-6">
    <Activity className="w-8 h-8 text-primary" /> Machines In Service
  </h1>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {paginatedMachines.map(machine => (
      <Card key={machine._id} className="p-4 border rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">{machine.name}</h2>
          <Badge className={`px-2 py-1 rounded-lg border ${statusStyles[machine.status]}`}>
            {machine.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{machine.description || '-'}</p>
      </Card>
    ))}
  </div>

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="mt-6 flex justify-center">
      <Pagination aria-label="Pagination Navigation">
        <PaginationPrevious
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        />
        <PaginationContent>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
