"use client";

import React, { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

type MachineStatus = "available" | "in_use" | "maintenance" | "out_of_service";

interface Machine {
  id: number;
  name: string;
  type: string;
  status: MachineStatus;
  unavailableFrom?: string;  // ISO date string
  expectedAvailable?: string; // ISO date string
}

const MOCK_MACHINES: Machine[] = [
  { id: 1, name: "Injection M1", type: "Injection", status: "available" },
  { id: 2, name: "Blower B2", type: "Blow Molding", status: "in_use" },
  { id: 3, name: "Cooling C3", type: "Cooling", status: "maintenance", unavailableFrom: "2025-11-20T08:00:00", expectedAvailable: "2025-11-22T12:00:00" },
  { id: 4, name: "Packaging P4", type: "Packaging", status: "out_of_service", unavailableFrom: "2025-11-19T14:00:00", expectedAvailable: "2025-11-25T09:00:00" },
  { id: 5, name: "Labeling L5", type: "Labeling", status: "available" },
  { id: 6, name: "QC Station 1", type: "Quality Control", status: "available" },
  { id: 7, name: "Mixer MX7", type: "Preparation", status: "in_use" },
];

const statusStyles: Record<MachineStatus, string> = {
  available: "bg-green-100 text-green-700 border-green-300",
  in_use: "bg-blue-100 text-blue-700 border-blue-300",
  maintenance: "bg-yellow-100 text-yellow-700 border-yellow-300",
  out_of_service: "bg-red-100 text-red-700 border-red-300",
};

export default function AllMachines() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<MachineStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  const filtered = MOCK_MACHINES.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "-";

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">All Machines</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search machine..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="md:w-1/3"
        />

        <Select
          onValueChange={(val) => {
            setFilterStatus(val as MachineStatus | "all");
            setCurrentPage(1);
          }}
          defaultValue="all"
        >
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="in_use">In Use</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="out_of_service">Out of Service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Machine List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginated.map((machine) => (
          <Card key={machine.id} className="p-4 border rounded-lg space-y-2">
            <h2 className="text-lg font-semibold">{machine.name}</h2>
            <p className="text-sm text-gray-600">{machine.type}</p>

            <span
              className={`text-xs px-2 py-1 rounded-md border inline-block ${statusStyles[machine.status]}`}
            >
              {machine.status.replace("_", " ").toUpperCase()}
            </span>

            {(machine.status !== "available") && (
              <div className="text-xs text-gray-700 mt-1 space-y-1">
                <p>Unavailable from: {formatDate(machine.unavailableFrom)}</p>
                <p>Expected availability: {formatDate(machine.expectedAvailable)}</p>
              </div>
            )}
          </Card>
        ))}

        {paginated.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">No machines found.</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            />
          </PaginationItem>

          <PaginationItem>
            <span className="px-3 py-2 text-sm">Page {currentPage} of {totalPages}</span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
