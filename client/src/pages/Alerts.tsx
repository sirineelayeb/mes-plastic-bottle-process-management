'use client';

import React from 'react';
import AlertsCard from '@/components/ui/AlertsCard';
import type { AlertItem } from '@/types/types'; // <- type-only import

// Mock alerts data
const alerts: AlertItem[] = [
  { _id: '1', type: 'warning', message: 'Cooling temperature slightly elevated', timestamp: '2024-11-19T11:15:00', step: 'Cooling' },
  { _id: '2', type: 'info', message: 'Blow Molding completed successfully', timestamp: '2024-11-19T11:00:00', step: 'Blow Molding' },
  { _id: '3', type: 'error', message: 'Packaging machine requires maintenance', timestamp: '2024-11-19T10:45:00', step: 'Packaging' },
];

export default function AlertsPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 bg-background">
      <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-6">
        Alerts
      </h1>
      <AlertsCard alerts={alerts} />
    </div>
  );
}
